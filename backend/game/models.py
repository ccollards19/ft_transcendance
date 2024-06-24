from django.db import models
from django.contrib.postgres.fields import ArrayField
from typing import *
from dataclasses import dataclass
from enum import Enum
from django.utils import timezone

GAME = {
    "c" : "Chess",
    "p" : "Pong"
    }

class Match(models.Model):
     player1 = models.ForeignKey('profiles.Profile', null=True, on_delete=models.SET_NULL, related_name='player_a')
     player2 = models.ForeignKey('profiles.Profile', null=True, on_delete=models.SET_NULL, related_name='player_b')
     winner = models.IntegerField(default=0)
     matchTournament = models.ForeignKey('tournaments.Tournament', null=True, on_delete=models.SET_NULL, related_name='matchTournament')
     score1 = models.IntegerField(default=0)
     score2 = models.IntegerField(default=0)
     timestamp = models.DateTimeField(default=timezone.now)
 

class Room(models.Model):
    player1 = models.ForeignKey('profiles.Profile', null=True, on_delete=models.PROTECT, related_name="player1")
    player2 = models.ForeignKey('profiles.Profile', null=True, on_delete=models.PROTECT, related_name="player2")
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
    over = models.BooleanField(default=False)
