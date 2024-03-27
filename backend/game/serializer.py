from django.core.serializers import serialize
from django.core.serializers.json import DjangoJSONEncoder
from django.utils.safestring import mark_safe
from .models import GameState, Ball, Paddle, Score, Game, Room
import json

# class PlayerSerializer:
#     def __init__(self, instance):
#         self.instance = instance

#     def data(self):
#         return {
#             'id':self.instance.id,
#             'name': self.instance.name,
#             'mmr' : self.instance.mmr,
#             'friend_list':self.instance.friend_list,
#             'friend_request_list':self.instance.friend_request_list,
#             'waiting_challenges_list':self.instance.waiting_challenges_list,
#             'victories':self.instance.victories,
#             'defeats':self.instance.defeats
#         }
class BallSerializer:
    def __init__(self, instance):
        self.instance = instance

    def data(self):
        return {
            'x': self.instance.x,
            'y': self.instance.y,
            'angle': self.instance.angle,
            'speed': self.instance.speed
        }

class PaddleSerializer:
    def __init__(self, instance):
        self.instance = instance

    def data(self):
        return {
            'P1' : self.instance.P1,
            'P2' : self.instance.P2
        }

class ScoreSerializer:
    def __init__(self, instance):
        self.instance = instance

    def data(self):
        return {
            'P1': self.instance.P1,
            'P2': self.instance.P2
        }
        
class GameStateSerializer:
    def __init__(self, instance):
        self.instance = instance

    def data(self):
        ball_data = BallSerializer(self.instance.ball).data()
        paddle_data = PaddleSerializer(self.instance.paddle).data()
        score_data = ScoreSerializer(self.instance.score).data()
        return {
            'fen': self.instance.fen,
            'moves': self.instance.moves,
            'turn': self.instance.turn,
            'ball': ball_data,
            'paddle': paddle_data,
            'score': score_data,
            'pin' : self.instance.kingpin,
            'mate' : self.instance.checkmate,
            'promotion' : self.instance.promotion
        }

class GameSerializer:
    def __init__(self, instance):
        self.instance = instance

    def data(self):
        state_data = GameStateSerializer(self.instance.state).data()
        return {
            'name': self.instance.name,
            'state': state_data
        }

class RoomSerializer:
    def __init__(self, instance):
        self.instance = instance

    def data(self):
        players_data1 = None if not self.instance.player1 else (self.instance.player1).to_dict()
        players_data2 = None if not self.instance.player2 else (self.instance.player2).to_dict()
        game_data = GameSerializer(self.instance.game).data()
        id = self.instance.id

        return {
            'id': id,
            'player1': players_data1,
            'player2': players_data2,
            'game': game_data
        }
