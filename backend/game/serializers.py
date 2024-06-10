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
            "winner" : self.instance.winner
        }

# class BallSerializer:
#     def __init__(self, instance):
#         self.instance = instance

#     def data(self):
#         return {
#             'x': self.instance.x,
#             'y': self.instance.y,
#             'angle': self.instance.angle,
#             'speed': self.instance.speed
#         }

# class PaddleSerializer:
#     def __init__(self, instance):
#         self.instance = instance

#     def data(self):
#         return {
#             'P1' : self.instance.P1,
#             'P2' : self.instance.P2
#         }

# class ScoreSerializer:
#     def __init__(self, instance):
#         self.instance = instance

#     def data(self):
#         return {
#             'P1': self.instance.P1,
#             'P2': self.instance.P2
#         }
        
# class GameStateSerializer:
#     def __init__(self, instance):
#         self.instance = instance
#     def data(self):
#         ball_data = BallSerializer(self.instance.ball).data()
#         paddle_data = PaddleSerializer(self.instance.paddle).data()
#         score_data = ScoreSerializer(self.instance.score).data()
#         return {
#             'fen': self.instance.fen,
#             'moves': self.instance.moves,
#             'turn': self.instance.turn,
#             'ball': ball_data,
#             'paddle': paddle_data,
#             'score': score_data,
#             'pin' : self.instance.kingpin,
#             'mate' : self.instance.checkmate,
#             'promotion' : self.instance.promotion
#         }

# class GameSerializer:
#     def __init__(self, instance):
#         self.instance = instance

#     def data(self):
#         state_data = GameStateSerializer(self.instance.state).data()
#         return {
#             'name': self.instance.name,
#             'state': state_data
#         }

class RoomSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        return {
            'id': self.instance.id,
            'player1': PlayerSerializer(self.instance.player1).data(),
            'player2': PlayerSerializer(self.instance.player2).data(),
            'player1Ready' : self.instance.player1Ready,
            'player2Ready' : self.instance.player2Ready,
            'game': self.instance.game,
            'spectate' : self.instance.spectate,
            "cancelled" : self.instance.cancelled,
            "over" : self.instance.over
        }
