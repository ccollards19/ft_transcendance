from django.db import models
from django.contrib.postgres.fields import ArrayField
from typing import *
from dataclasses import dataclass
from enum import Enum

GAME = {
    "c" : "Chess",
    "p" : "Pong"
    }

class Match(models.Model):
     player1 = models.ForeignKey('profiles.Profile', null=True, on_delete=models.SET_NULL, related_name='player_a')
     player2 = models.ForeignKey('profiles.Profile', null=True, on_delete=models.SET_NULL, related_name='player_b')
     winner = models.IntegerField(default=0)
     matchTournament = models.ForeignKey('tournaments.Tournament', null=True, on_delete=models.SET_NULL, related_name='matchTournament')

class Ball(models.Model):
    x = models.IntegerField(default=0)
    y = models.IntegerField(default=0)
    angle = models.IntegerField(default=0)
    speed = models.IntegerField(default=5)
class Paddle(models.Model):
    P1 = models.IntegerField(default=1)
    P2 = models.IntegerField(default=1)

class Score(models.Model):
    P1 = models.IntegerField(default=0)
    P2 = models.IntegerField(default=0)

class GameState(models.Model):
    fen = models.CharField(max_length=255, default="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -0 1")
    moves = ArrayField(models.CharField(max_length=500), blank=True, null=True)
    turn = models.BooleanField(True, default=True)
    paddle = models.OneToOneField("Paddle", on_delete=models.CASCADE)
    ball = models.OneToOneField("Ball", on_delete=models.CASCADE, null=True)
    score = models.OneToOneField("Score", on_delete=models.CASCADE)
    kingpin = models.BooleanField(True, default=False)
    checkmate = models.BooleanField(True, default=False)
    promotion = models.CharField(max_length=10, null=True)

class Game(models.Model):
    name = models.CharField(max_length=100, default="pong")
    state = models.OneToOneField("GameState", on_delete=models.CASCADE)   

class Room(models.Model):
    player1 = models.ForeignKey('profiles.Profile', null=True, on_delete=models.SET_NULL, related_name="player1")
    player2 = models.ForeignKey('profiles.Profile', null=True, on_delete=models.SET_NULL, related_name="player2")
    player1Ready = models.BooleanField(default=False)
    player2Ready = models.BooleanField(default=False)
    player1Replay = models.BooleanField(default=None, null=True)
    player2Replay = models.BooleanField(default=None, null=True)
    game = models.CharField(default='')
    spectate = models.BooleanField(default=True)
    cancelled = models.BooleanField(default=False)
    match = models.ForeignKey('Match', null=True, on_delete=models.SET_NULL, related_name='match')
    roomTournament = models.ForeignKey('tournaments.Tournament', null=True, on_delete=models.SET_NULL, related_name='roomTournament')
    nextRoom = models.ForeignKey('self', null=True, on_delete=models.SET_NULL, related_name='next_room')