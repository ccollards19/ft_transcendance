from django.core.serializers import serialize
from django.core.serializers.json import DjangoJSONEncoder
from django.utils.safestring import mark_safe
from .models import Room
from django.contrib.auth.models import User
from profiles.models import Chess_stats, Pong_stats, Tictactoe_stats
from tournaments.serializers import TournamentListSerializer
import logging

import json

logger = logging.getLogger(__name__)

class ChallengerSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        room = None
        if bool(self.instance.room):
            room = RoomSerializer(self.instance.room).data()
        return {
            "id" : self.instance.id,
            "avatar" : self.instance.avatar.url,
            "name" : self.instance.user.username, 
            "status" : self.instance.status,
            "challengeable" : self.instance.challengeable,
            "room" : room,
            "playing" : self.instance.playing
        }

class DisPlaySerializer:
    def __init__(self, instance, user):
        self.instance = instance
        self.user = user
    def data(self, game):
        gameData = None
        if game == 'pong':
            gameData = Pong_stats.objects.get(id=self.instance.id)
        else:
            gameData = Tictactoe_stats.objects.get(id=self.instance.id)
        challengers = []
        challenged = []
        tournaments = []
        challengersData = list(gameData.challengers.all())
        for item in challengersData:
            challengers.append(ChallengerSerializer(item).data())
        challengedData = list(gameData.challenged.all())
        for item in challengedData:
            challenged.append(ChallengerSerializer(item).data())
        tournamentsData = list(self.instance.tournaments.all().filter(game=game))
        subscriptionsData = list(self.instance.subscriptions.all().filter(game=game))
        for item in tournamentsData:
            if item.winner == None and item.reasonForNoWinner == '' and not self.instance.subscriptions.contains(item):
                tournaments.append(TournamentListSerializer(item, self.user).data())
        for item in subscriptionsData:
            if item.winner == None and item.reasonForNoWinner == '':
                tournaments.append(TournamentListSerializer(item, self.user).data())
        return {
            "challengers" : challengers,
            "challenged" : challenged,
            "tournaments" : tournaments
        }

class PlayerSerializer:
    def __init__(self, instance):
        self.instance = instance

    def data(self):
        return {
            "id" : self.instance.id,
            "avatar" : self.instance.avatar.url,
            "name" : self.instance.user.username,
            "catchphrase" : self.instance.catchphrase
        }

class MatchSerializer:
    def __init__(self, instance):
        self.instance = instance

    def data(self):
        return {
            "player1" : PlayerSerializer(self.instance.player1).data(),
            "player2" : PlayerSerializer(self.instance.player2).data(),
            "winner" : self.instance.winner,
            "score1" : self.instance.score1,
            "score2" : self.instance.score2,
            "timestamp" : self.instance.timestamp
        }

class RoomSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):

        tournaments = False
        if bool(self.instance.roomTournament):
            tournament = True
        return {
            'id': self.instance.id,
            'player1': PlayerSerializer(self.instance.player1).data(),
            'player2': PlayerSerializer(self.instance.player2).data(),
            'player1Ready' : self.instance.player1Ready,
            'player2Ready' : self.instance.player2Ready,
            'game': self.instance.game,
            'spectate' : self.instance.spectate,
            "cancelled" : self.instance.cancelled,
            "over" : self.instance.over,
            "tournament" : tournament
        }
