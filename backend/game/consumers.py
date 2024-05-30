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
        self.user = self.scope["user"]
        self.room_group_name = "room_" + str(self.scope["url_route"]["kwargs"]["room"])
        async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
        self.accept()

    def websocket_send(self, event):
        payload = event["message"]
        self.send_json(payload)

    def receive_json(self, content):
        try:
            action = content["action"]
            id = content["roomId"]
            myId = content["myId"]
            room = Room.objects.get(id=id)
            if action == 'checkPlayer':
                if room.player1.id != myId and room.player2.id != myId:
                    self.close()
            elif action == 'setReady':
                status = content["status"]
                if room.player1.id == myId or room.player2.id == myId:
                    if room.player1.id == myId:
                        room.player1Ready = status
                    elif room.player2.id == myId:
                        room.player2Ready = status
                    room.save()
                    if room.player1Ready and room.player2Ready:
                        async_to_sync(self.channel_layer.group_send)(
                            self.room_group_name,
                            {
                                "type" : 'websocket.send',
                                "message" : {
                                    "action" : "startMatch"
                                }
                            })
                    else:
                        async_to_sync(self.channel_layer.group_send)(
                            self.room_group_name,
                            {
                                "type" : 'websocket.send',
                                "message" : {
                                    "action" : 'updateReadyStatus',
                                    "player1" : room.player1Ready,
                                    "player2" : room.player2Ready
                                }
                            })
                else:
                    raise Exception
        except: self.close()
