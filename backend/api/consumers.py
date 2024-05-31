import logging
import json
from channels.generic.websocket import JsonWebsocketConsumer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import  F, Q, FloatField, ExpressionWrapper
from tournaments.models import Tournament
from game.models import Match
from profiles.models import Profile
from api.serializers import ProfileSerializer, MyProfileSerializer, LeaderboardEntrySerializer, ProfileSampleSerializer, TournamentSerializer, MatchSampleSerializer
from asgiref.sync import async_to_sync    

logger = logging.getLogger(__name__)

class GlobalConsumer(JsonWebsocketConsumer):
######################connection###################################################
    def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated :
            self.profile = Profile.objects.get(user=self.user)
            self.profile.status = "online"
            self.profile.chatChannelName = self.channel_name
            self.profile.save()
        async_to_sync(self.channel_layer.group_add)("chat_general", self.channel_name)
        self.accept()


    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)("chat_general", self.channel_name)
        if (self.user.is_authenticated):
            self.profile.status = "offline"
            self.room = None
            self.playing = False
            self.profile.save()

#######################entrypoint##################################################

    # receive a json from a websocket
    # make a batch of messages
    # send the batch of messages to the appropriate client connections

    def chat_send(self, event):
        self.send_json(event["message"])

    def receive_json(self, content):
        action = content["action"]
        item = content["item"]
        msg_batch = []
        if not self.user.is_authenticated: return
        self.profile.refresh_from_db()
        self.handle_chat(action, item)
        # msg_batch = self.handle_chat(action, item)
        # if msg_batch is None : return
        # for msg in msg_batch:
        #     if msg is None : continue
        #     elif msg.get("target") is None :
        #         self.send_json(msg["payload"]["message"])
        #     else :
        #         if msg["payload"]["message"]["type"] == 'whisp':
        #             async_to_sync(self.channel_layer.send)(msg["target"], msg["payload"])
        #         else:
        #             async_to_sync(self.channel_layer.group_send)(msg["target"], msg["payload"])

#######################actions##################################################
        
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
            "type" : "chat.send",
            "message" : {
                "action" : "chat",
                "type" : "message",
                "target" : target,
                "id" : item.get('myId'),
                "name" : item.get("name"),
                "text" : item.get("text")
            }
        })

    def chat_whisp(self, item):
        msg_batch = []
        if item is None: return msg_batch
        target = item.get("target")
        try:
            user = User.objects.get(username=target)
            profile = Profile.objects.get(id=user.id)
            if profile.blocked.all().contains(self.profile):
                self.send_json({
                    "action" : "blocked",
                    "name" : target
                })
            elif profile.status == 'offline':
                self.send_json({
                    "action" : "isOffline",
                    "name" : target
                })
            else:
                chatName = profile.chatChannelName
                if target is None : return msg_batch
                async_to_sync(self.channel_layer.send)(chatName, {
                    "type" : "chat.send",
                    "message" : {
                        "action" : "chat",
                        "type" : "whisp",
                        "id" : item.get("myId"),
                        "name" : item.get("name"),
                        "text" : item.get("text")
                    }
                })
        except :
            self.send_json({
                "action" : "noUser",
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

