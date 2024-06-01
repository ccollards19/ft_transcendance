import logging
import json
from channels.generic.websocket import JsonWebsocketConsumer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import  F, Q, FloatField, ExpressionWrapper
from tournaments.models import Tournament
from game.models import Match
from profiles.models import Profile
from profiles.serializers import MyProfileSerializer
from asgiref.sync import async_to_sync    

logger = logging.getLogger(__name__)

class GlobalConsumer(JsonWebsocketConsumer):
######################connection###################################################
    def connect(self):
        self.user = self.scope["user"]
        self.accept()
        async_to_sync(self.channel_layer.group_add)("chat_general", self.channel_name)
        if self.user.is_authenticated :
            self.profile = Profile.objects.get(user=self.user)
            self.profile.status = "online"
            self.profile.chatChannelName = self.channel_name
            self.profile.save()
            data = {
                "action" : "myProfile",
                "item" : MyProfileSerializer(self.profile).data()
            }
            self.send_json(data)


    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)("chat_general", self.channel_name)
        if (self.user.is_authenticated):
            self.profile.status = "offline"
            self.profile.room = None
            self.profile.playing = False
            self.profile.chatChannelName = ''
            self.profile.save()

#######################entrypoint##################################################

    # receive a json from a websocket
    # make a batch of messages
    # send the batch of messages to the appropriate client connections

    def ws_send(self, event):
        self.send_json(event["message"])

    def receive_json(self, content):
        action = content["action"]
        item = content["item"]
        if not self.user.is_authenticated: return
        self.profile.refresh_from_db()
        if action == 'friend':
            self.handle_friends(item)
        else:
            self.handle_chat(action, item)

#######################actions##################################################

    def handle_friends(self, item):
        type = item["type"]
        id = item["id"]
        friend = Profile.objects.get(id=id)
        me = Profile.objects.get(user=self.user)
        if type == 'dismiss': self.dismissFriend(me, friend)
        elif type == 'accept': self.acceptFriend(me, friend)
        elif type == 'unfriend' : self.unfriend(me, friend)
        elif type == 'block': self.block(me, friend)
        else: self.friendRequest(me, friend)

    def dismissFriend(self, me, friend):
        me.friend_requests.remove(friend)
        me.save()
        async_to_sync(self.channel_layer.send)(friend.chatChannelName, {
        "type" : "ws.send",
        "message" : {
            "action" : "system",
            "type" : 'dismissFriend',
            "name" : self.user.username,
        }})

    def acceptFriend(self, me, friend):
        me.friends.add(friend)
        me.friend_requests.remove(friend)
        friend.friends.add(me)
        me.save()
        friend.save()
        async_to_sync(self.channel_layer.send)(friend.chatChannelName, {
            "type" : "ws.send",
            "message" : {
                "action" : "system",
                "type" : 'acceptFriend',
                "name" : self.user.username,
            }
        })
    
    def friendRequest(self, me, friend):
        if friend.friend_requests.contains(me):
            self.send_json({
                "action" : "system",
                "type" : 'requested',
                "name" : friend.user.username,
            })
        elif friend.blocked.all().contains(me):
            self.send_json({
                "action" : "system",
                "type" : 'blocked',
                "name" : friend.user.username,
            })
        else:
            friend.friend_requests.add(me)
            friend.save()
            async_to_sync(self.channel_layer.send)(friend.chatChannelName, {
                "type" : "ws.send",
                "message" : {
                    "action" : "system",
                    "type" : 'friendRequest',
                    "name" : self.user.username,
                }
            })
    
    def unfriend(self, me, friend):
        me.friends.remove(friend)
        friend.friends.remove(me)
        me.save()
        friend.save()
        async_to_sync(self.channel_layer.send)(friend.chatChannelName, {
                "type" : "ws.send",
                "message" : {
                    "action" : "system",
                    "type" : 'unfriended',
                    "name" : self.user.username,
                }
            })
        
    def block(self, me, friend):
        me.friends.remove(friend)
        me.blocked.add(friend)
        friend.friends.remove(me)
        me.save()
        friend.save()
        async_to_sync(self.channel_layer.send)(friend.chatChannelName, {
                "type" : "ws.send",
                "message" : {
                    "action" : "system",
                    "type" : 'blocked',
                    "name" : self.user.username,
                }
            })

        
###############################chat###########################################

    def handle_chat(self, action, item):
        msg_batch = []
        if (action == "leave_chat"):
            self.leave_chat(item)
        if (action == "join_chat"):
            self.join_chat(item)
        elif (action == "whisp"):
            msg_batch = self.chat_whisp(item)
        elif (action == "message"):
            msg_batch = self.chat_message(item)
        return msg_batch

    def join_chat(self, item):
        if item is None: return
        target = item.get("chat")
        if target is None: return
        async_to_sync(self.channel_layer.group_add)(target, self.channel_name)

    def leave_chat(self, item):
        if item is None: return
        target = item.get("chat")
        if target is None: return
        async_to_sync(self.channel_layer.group_discard)(target, self.channel_name)

    def chat_message(self, item):
        msg_batch = []
        if item is None: return msg_batch
        target = item.get("target")
        if target is None : return msg_batch
        async_to_sync(self.channel_layer.group_send)(target, {
            "type" : "ws.send",
            "message" : {
                "action" : "chat",
                "type" : "message",
                "target" : target,
                "id" : self.user.id,
                "name" : self.user.username,
                "text" : item.get("text")
            }
        })

    def chat_whisp(self, item):
        if item is None: return
        target = item.get("target")
        if target is None : return 
        try:
            user = User.objects.get(username=target)
            profile = Profile.objects.get(id=user.id)
            if profile.blocked.all().contains(self.profile):
                self.send_json({
                    "action" : "system",
                    "type" : "blocked",
                    "name" : target
                })
            elif profile.status == 'offline':
                self.send_json({
                    "action" : "system",
                    "type" : "isOffline",
                    "name" : target
                })
            else:
                message = {
                    "action" : "chat",
                    "type" : "whisp",
                    "id" : self.user.id,
                    "name" : self.user.username,
                    "text" : item.get("text"),
                    "target" : target
                }
                chatName = profile.chatChannelName
                async_to_sync(self.channel_layer.send)(chatName, {
                    "type" : "ws.send",
                    "message" : message
                })
                self.send_json(message)
        except :
            self.send_json({
                "action" : "system",
                "type" : "noUser",
                "name" : target
            })

############################################################################

    def blocked(self, target):
        self.send_json({
                "name": target,
                "action":"chat",
				"type" : "blocked",
			})
    
    def taken(self, target):
        self.send_json({
                "name": target,
                "action":"chat",
				"type" : "taken",
			})

    def requested(self, target):
        self.send_json({
                "name": target,
                "action":"chat",
				"type" : "requested",
			})

    def update(self, event=None):
        if (not self.user.is_authenticated) : return
        payload = MyProfileSerializer(self.account).data()
        self.send_json({
            "action": "myProfile",
            "item": payload
            })

    def ws_message(self, event):
        payload = event["message"]
        self.send_json(payload)
        
#############################################################################

    def chat_print(self, msg):
     self.send_json({
                "action":"chat",
				"type" : "admin",
                "target" : "chat_general",
				"id" : "0",
				"name" : "server",
                "text" : f"server : [{msg}]"
			})

