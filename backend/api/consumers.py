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
        logger.debug(Profile.objects.all()[0])
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
            self.profile.chatChannelName = None
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
        elif action == 'challenge':
            self.handle_challenge(item)
        elif action == 'dismiss':
            self.handle_dismiss(item)
        elif action == 'joinMatch':
            self.handle_join()
        elif action == 'joinTournament':
            self.handle_joinTournament(item)
        else:
            self.handle_chat(action, item)

#######################actions##################################################

    def handle_friends(self, item):
        type = item["type"]
        id = item["id"]
        friend = Profile.objects.get(id=id)
        target = friend.chatChannelName
        if type == 'dismiss': self.dismissFriend(friend, target)
        elif type == 'accept': self.acceptFriend(friend, target)
        elif type == 'unfriend' : self.unfriend(friend, target)
        elif type == 'block': self.block(friend, target)
        else: self.friendRequest(friend, target)

    def dismissFriend(self, friend, target):
        self.profile.friend_requests.remove(friend)
        self.profile.save()
        if target:
            async_to_sync(self.channel_layer.send)(target, {
            "type" : "ws.send",
            "message" : {
                "action" : "system",
                "type" : 'dismissedFriend',
                "name" : self.user.username,
            }})

    def acceptFriend(self, friend, target):
        self.profile.friends.add(friend)
        self.profile.friend_requests.remove(friend)
        friend.friends.add(self.profile)
        self.profile.save()
        friend.save()
        if target:
            async_to_sync(self.channel_layer.send)(target, {
                "type" : "ws.send",
                "message" : {
                    "action" : "system",
                    "type" : 'acceptedFriend',
                    "name" : self.user.username,
                    "id" : self.profile.id
                }
            })
    
    def friendRequest(self, friend, target):
        if friend.friend_requests.contains(self.profile):
            self.send_json({
                "action" : "system",
                "type" : 'requested',
                "name" : friend.user.username,
            })
        elif friend.blocked.all().contains(self.profile):
            self.send_json({
                "action" : "system",
                "type" : 'blocked',
                "name" : friend.user.username,
            })
        else:
            friend.friend_requests.add(self.profile)
            friend.save()
            if target:
                async_to_sync(self.channel_layer.send)(target, {
                    "type" : "ws.send",
                    "message" : {
                        "action" : "system",
                        "type" : 'friendRequest',
                        "name" : self.user.username,
                    }
                })
    
    def unfriend(self, friend, target):
        self.profile.friends.remove(friend)
        friend.friends.remove(self.profile)
        self.profile.save()
        friend.save()
        if target:
            async_to_sync(self.channel_layer.send)(target, {
                "type" : "ws.send",
                "message" : {
                    "action" : "system",
                    "type" : 'unfriended',
                    "name" : self.user.username,
                    "id" : self.profile.id
                }
            })
        
    def block(self, friend, target):
        self.profile.friends.remove(friend)
        self.profile.blocked.add(friend)
        friend.friends.remove(self.profile)
        self.profile.save()
        friend.save()
        if target:
            async_to_sync(self.channel_layer.send)(target, {
                "type" : "ws.send",
                "message" : {
                    "action" : "system",
                    "type" : 'blocked',
                    "name" : self.user.username,
                    "id" : self.profile.id
                }
            })
        
###############################challenge######################################

    def handle_challenge(self, item):
        game = item["game"]
        id = item["id"]
        challenged = Profile.objects.get(id=id)
        if challenged.playing:
            self.send({
                "action" : "system",
                "type" : "playing",
                "name" : challenged.user.username
            })
        myGameStats = None
        challengedGameStats = None
        if game == 'pong':
            myGameStats = self.profile.pong_stats
            challengedGameStats = challenged.pong_stats
        else:
            myGameStats = self.profile.chess_stats
            challengedGameStats = challenged.chess_stats
        myGameStats.challenged.add(challenged)
        challengedGameStats.challengers.add(self.profile)
        myGameStats.save()
        challengedGameStats.save()
        if challenged.chatChannelName:
            async_to_sync(self.channel_layer.send)(challenged.chatChannelName, {
                "type" : "ws.send",
                "message" : {
                    "action" : "system",
                    "type" : game + "Challenge",
                    "name" : self.user.username,
                    "game" : game,
                    "id" : self.profile.id
                }
            })

###############################dismiss########################################

    def handle_dismiss(self, item):
        game = item["game"]
        id = item["id"]
        challenger = Profile.objects.get(id=id)
        reset = False
        if challenger.room and challenger.room.player2 == self.profile:
            challenger.room = None
            challenger.save()
            reset = True
        if game == 'pong':
            myGameStats = self.profile.pong_stats
            challengerGameStats = challenger.pong_stats
        else:
            myGameStats = self.profile.chess_stats
            challengerGameStats = challenger.chess_stats
        if myGameStats.challengers.all().contains(challenger):
            myGameStats.challengers.remove(challenger)
            challengerGameStats.challenged.remove(self.profile)
        else:
            myGameStats.challenged.remove(challenger)
            challengerGameStats.challengers.remove(self.profile)
        myGameStats.save()
        challengerGameStats.save()
        if challenger.chatChannelName:
            async_to_sync(self.channel_layer.send)(challenger.chatChannelName, {
                "type" : "ws.send",
                "message" : {
                    "action" : "system",
                    "type" : game + "Dismissed",
                    "name" : self.user.username,
                    "game" : game,
                    "id" : self.profile.id,
                    "reset" : reset
                }
            })

###############################join########################################

    def handle_join(self):
        challengersList = list(self.profile.pong_stats.challengers.all()) + list(self.profile.pong_stats.challenged.all()) + list(self.profile.chess_stats.challengers.all()) + list(self.profile.chess_stats.challenged.all())
        for challenger in challengersList:
            if challenger.room and challenger.room.player2.user == self.user and challenger.room != self.profile.room:
                async_to_sync(self.channel_layer.send)(challenger.chatChannelName, {
                    "type" : "ws.send",
                    "message" : {
                        "action" : "system",
                        "type" : "joinedMatch",
                        "name" : self.user.username
                    }
                })
        
###############################joinTournament###########################################

    def handle_joinTournament(self, item):
        try:
            assert self.user.is_authenticated
            id = item["id"]
            tournament = Tournament.objects.get(id=id)
            tournament.allContenders.add(self.profile)
            self.profile.subscriptions.add(tournament)
            tournament.save()
            self.profile.save()
            # contenders = list(tournament.allContenders.all().values)
            # nbOfContenders = len(contenders)
            # if contendersCount % 2 == 0:
            #     tournament.nextMatches.add(Room(player1=))
            if tournament.allContenders.all().counnt() == tournament.maxContenders:
                for contender in tournament.allContenders:
                    async_to_sync(self.channel_layer.send)(contender.chatChannelName, {
                    "type" : "ws.send",
                    "message" : {
                        "action" : "system",
                        "type" : "startTournament",
                        "name" : tournament.title
                    }
                })
        except: self.close()

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

