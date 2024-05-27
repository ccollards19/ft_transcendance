import json
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import  F, Q, FloatField, ExpressionWrapper
from tournaments.models import Tournament
from game.models import Match
from profiles.models import Profile, Pong_stats, Chess_stats
from api.serializers import ProfileSerializer, MyProfileSerializer, LeaderboardEntrySerializer, ProfileSampleSerializer, TournamentSerializer, MatchSampleSerializer
from asgiref.sync import async_to_sync    

class ChessConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.room = self.scope["url_route"]["kwargs"]["room"]
        # self.send("enter "+ self.room)

    def disconnect(self, close_code):
        self.send("leave "+ self.room)

    def receive(self, text_data):
        self.send("receive message in"+ self.room)

    def chess_message(self, event):
        pass

class PongConsumer(WebsocketConsumer):
######################connection###################################################
    def connect(self):
        self.accept()
        self.room = self.scope["url_route"]["kwargs"]["room"]
        # self.send("enter "+ self.room)

    def disconnect(self, close_code):
        self.send("leave "+ self.room)

    def receive(self, text_data):
        self.send("receive message in"+ self.room)

    def chess_message(self, event):
        pass

