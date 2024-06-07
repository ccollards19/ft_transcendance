import json
from channels.generic.websocket import WebsocketConsumer, JsonWebsocketConsumer
from channels.consumer import SyncConsumer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import  F, Q, FloatField, ExpressionWrapper
from tournaments.models import Tournament
from profiles.models import Profile, Pong_stats, Chess_stats
from api.serializers import ProfileSerializer, MyProfileSerializer, LeaderboardEntrySerializer, ProfileSampleSerializer, TournamentSerializer, MatchSampleSerializer
from asgiref.sync import async_to_sync
from game.models import Room, Match
from profiles.models import Profile
from django.http import JsonResponse
import logging
import json


logger = logging.getLogger(__name__)

class ChessConsumer(JsonWebsocketConsumer):
######################connection###################################################
    
    def connect(self):
        self.accept()
        self.room = self.scope["url_route"]["kwargs"]["room"]

    def disconnect(self, close_code):
        self.send("leave "+ self.room)

    def receive(self, text_data):
        self.send("receive message in"+ self.room)

    def chess_message(self, event):
        pass

class PongConsumer(JsonWebsocketConsumer):
######################connection###################################################
    
    def connect(self):
        self.user = self.scope["user"]
        roomId = self.scope["url_route"]["kwargs"]["room"]
        self.room = Room.objects.get(id=roomId)
        if self.room == None:
            self.send_json({"details" : "that room does not exist"})
            self.close()
            return
        if self.room.cancelled:
            self.send_json({"details" : "cancelled"})
            self.close()
            return
        if not self.room.spectate and self.room.player1.user != self.user and self.room.player2.user != self.user:
            self.send_json({"details" : "no spectators"})
            self.close()
            return
        self.accept()
        if self.room.player1.user == self.user:
            self.player = 1
        elif self.room.player2.user == self.user:
            self.player = 2
        else:
            self.player = 0
        if not self.room.match:
            newMatch = Match(player1=self.room.player1, player2=self.room.player2)
            newMatch.save()
            self.room.match = newMatch
            self.room.save()
        self.room_group_name = "room_" + str(roomId)
        async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
        self.send_json({
            "roomId" : self.room.id,
            "player1" : self.room.player1.user.username,
            "player2" : self.room.player2.user.username,
            "AmIAPlayer" : self.player,
            "room_group_name" : self.room_group_name,
            "aLastKeyWontHurt" : "Coucou les loulous !"
        })

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.room_group_name, self.channel_name)
    
    def ws_send(self, event):
        payload = event["message"]
        self.send_json(payload)

    def receive_json(self, content):
        action = content.get("action")
        item = content.get("item")
        self.room.refresh_from_db()
        if action == 'win':
            self.handle_win()
        elif action == 'replay':
            self.handle_replay(item)
        elif action == 'quit':
            self.handle_quit()
        elif action == 'giveUp':
            self.handle_giveUp()

    def handle_giveUp(self):
        try:
            assert self.user.is_authenticated and (self.room.player1.user == self.user or self.room.player2.user == self.user)
            if self.room.player2.user == self.user:
                winnerStats = self.room.player1.pong_stats
                loserStats = self.room.player2.pong_stats
            elif self.room.player1.user == self.user:
                winnerStats = self.room.player2.pong_stats
                loserStats = self.room.player1.pong_stats
            if abs(winnerStats.score - loserStats.score) > 50:
                update = 3
            elif abs(winnerStats.score - loserStats.score) > 10:
                update = 2
            else:
                update = 1
            winnerStats.score += update
            loserStats.score -= update
            winnerStats.matches += 1
            loserStats.matches += 1
            winnerStats.wins += 1
            loserStats.losses += 1
            winnerStats.history.add(self.room.match)
            loserStats.history.add(self.room.match)
            winnerStats.save()
            loserStats.save()
            async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
                "type" : "ws.send",
                "message" : {
                    "action" : "endRound",
                }
            })
        except: self.close()

    def handle_win(self):
        try:
            assert self.user.is_authenticated and (self.room.player1.user == self.user or self.room.player2.user == self.user)
            if self.room.player1.user == self.user:
                winnerStats = self.room.player1.pong_stats
                loserStats = self.room.player2.pong_stats
            elif self.room.player2.user == self.user:
                winnerStats = self.room.player2.pong_stats
                loserStats = self.room.player1.pong_stats
            if abs(winnerStats.score - loserStats.score) > 50:
                update = 3
            elif abs(winnerStats.score - loserStats.score) > 10:
                update = 2
            else:
                update = 1
            winnerStats.score += update
            loserStats.score += update
            winnerStats.matches += 1
            loserStats.matches += 1
            winnerStats.wins += 1
            loserStats.losses += 1
            logger.debug('1')
            self.room.match.winner = self.user.id
            self.room.match.save()
            winnerStats.history.add(self.room.match)
            loserStats.history.add(self.room.match)
            winnerStats.save()
            loserStats.save()
            logger.debug('2')
            async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
                "type" : "ws.send",
                "message" : {
                    "action" : "endRound",
                }
            })
        except: self.close()

    def handle_replay(self, item):
        answer = item.get("answer")
        if self.room.player1.user == self.user:
            self.room.player1Replay = answer
        elif self.room.player2.user == self.user:
            self.room.player2Replay = answer
        self.room.save()
        replay = None
        if self.room.player1Replay != None and self.room.player2Replay != None:
            replay = self.room.player1Replay == True and self.room.player2Replay == True
        if replay:
            async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
                "type" : "ws.send",
                "message" : {
                    "action" : "replay",
                    "answer" : replay
                }
            })

    def handle_quit(self):
        self.room.player1.playing = False
        self.room.player1.room = None
        self.room.player2.playing = False
        self.room.player2.room = None
        self.room.cancelled = True
        self.room.player1.save()
        self.room.player2.save()
        self.room.save()
        async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
            "type" : "ws.send",
            "message" : {"action" : "quit"}
        })


class RoomConsumer(JsonWebsocketConsumer):
######################connexion###################################################

    def connect(self):
        if self.scope["user"].is_authenticated:
            self.user = self.scope["user"]
            roomId = self.scope["url_route"]["kwargs"]["room"]
            self.room = Room.objects.get(id=roomId)
            if self.room == None:
                self.send_json({"details" : "that room does not exist"})
                self.close()
            if self.room.player1.user != self.user and self.room.player2.user != self.user:
                self.send_json({"details" : "not your match"})
                self.close()
            self.profile = Profile.objects.get(user=self.user)
            self.profile.matchChannelName = self.channel_name
            self.profile.save()
            self.room_group_name = "room_" + str(roomId)
            async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
            self.accept()
            if self.room.player1.user == self.user:
                self.send_json({"action" : "updateReadyStatus", "status" : self.room.player2Ready})
            else:
                self.send_json({"action" : "updateReadyStatus", "status" : self.room.player1Ready})

    def disconnect(self, close_code):
        self.profile.matchChannelName = None
        async_to_sync(self.channel_layer.group_discard)(self.room_group_name, self.channel_name)


    def ws_send(self, event):
        payload = event["message"]
        self.send_json(payload)

    def receive_json(self, content):
        try:
            if not self.user.is_authenticated:
                raise Exception
            self.room.refresh_from_db()
            action = content["action"]
            if action == 'cancel':
                self.room.player1.room = None
                self.room.player2.room = None
                self.room.player1.save()
                self.room.player2.save()
                if self.room.player1.user == self.user:
                    target = self.room.player2.matchChannelName
                else:
                    target = self.room.player1.matchChannelName
                if target:
                    async_to_sync(self.channel_layer.send)(target, {
                        "type" : 'ws.send',
                        "message" : {
                            "action" : "cancelled",
                            "name" : self.user.username
                        }
                    })
            elif action == 'setReady':
                status = content["status"]
                target = None
                if self.room.player1.user == self.user:
                    self.room.player1Ready = status
                    target = self.room.player2.matchChannelName
                else:
                    self.room.player2Ready = status
                    target = self.room.player1.matchChannelName
                self.room.save()
                if self.room.player1Ready and self.room.player2Ready:
                    self.room.player1.playing == True
                    self.room.player2.playing == True
                    self.room.player1.save()
                    self.room.player2.save()
                    async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
                        "type" : 'ws.send',
                        "message" : {"action" : "startMatch"}
                    })
                elif target:
                    async_to_sync(self.channel_layer.send)(target, {
                        "type" : 'ws.send',
                        "message" : {
                            "action" : "updateReadyStatus",
                            "status" : status
                        }
                    })
        except: self.close()
