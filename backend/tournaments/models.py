from django.db import models


class Tournament(models.Model):
    title = models.CharField(max_length=30, default="sample_tournament")
    game = models.CharField(max_length=100, default="pong")
    organizerId = models.IntegerField(default=0)
    organizerName = models.CharField(max_length=20, default="")
    picture = models.CharField(max_length=100, default="default_tournament_picture.jpeg")
    background = models.CharField(max_length=100, default="")
    maxContenders = models.IntegerField(default=4)
    selfContender = models.BooleanField(default=True)
    description = models.CharField(max_length=1000, default="")
    winnerId = models.IntegerField(default=0)
    winnerName = models.CharField(max_length=20, default="")