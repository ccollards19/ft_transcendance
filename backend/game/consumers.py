import json
from channels.generic.websocket import WebsocketConsumer, JsonWebsocketConsumer
from channels.consumer import SyncConsumer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import  F, Q, FloatField, ExpressionWrapper
from tournaments.models import Tournament
from game.models import Match
from profiles.models import Profile, Pong_stats, Chess_stats
from api.serializers import ProfileSerializer, MyProfileSerializer, LeaderboardEntrySerializer, ProfileSampleSerializer, TournamentSerializer, MatchSampleSerializer
from asgiref.sync import async_to_sync
from game.models import Room
from profiles.models import Profile
from django.http import JsonResponse
import logging
import json


logger = logging.getLogger(__name__)

class ChessConsumer(WebsocketConsumer):
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

class PongConsumer(WebsocketConsumer):
######################connection###################################################
    connections = []

    def connect(self):
        self.accept()
        self.room = self.scope["url_route"]["kwargs"]["room"]

    def disconnect(self, close_code):
        self.send("leave "+ self.room)

    def receive(self, text_data):
        self.send("receive message in"+ self.room)

    def chess_message(self, event):
        pass

class RoomConsumer(JsonWebsocketConsumer):
######################connection###################################################

    def connect(self):
        if self.scope["user"].is_authenticated:
            self.user = self.scope["user"]
            self.roomId = self.scope["url_route"]["kwargs"]["room"]
            self.room = Room.objects.get(id=self.roomId)
            if self.room.player1.user == self.user or self.room.player2.user == self.user:
                me = Profile.objects.get(user=self.user)
                me.matchChannelName = self.channel_name
                me.save()
                self.room_group_name = "room_" + str(self.roomId)
                async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
                self.accept()
                if self.room.player1.user == self.user:
                    self.send_json({"action" : "updateReadyStatus", "status" : self.room.player2Ready})
                else:
                    self.send_json({"action" : "updateReadyStatus", "status" : self.room.player1Ready})

    def ws_send(self, event):
        payload = event["message"]
        self.send_json(payload)

    def receive_json(self, content):
        try:
            if not self.user.is_authenticated:
                raise Exception
            self.room.refresh_from_db()
            action = content["action"]
            if action == 'setReady':
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
            elif action == 'cancel':
                self.room.player1.room = None
                self.room.player2.room = None
                self.room.player1.save()
                self.room.player2.save()
                self.room.delete()
                async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
                    "type" : 'ws.send',
                    "message" : {"action" : "cancel"}
                })
        except: self.close()
