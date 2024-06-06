from game.models import Match
from profiles.models import Profile
from django.db import models

# Create your models here.

class Tournament(models.Model):
    title = models.CharField(max_length=30, default="sample_tournament")
    game = models.CharField(max_length=100, default="pong")
    organizer = models.ForeignKey(Profile, null=True, on_delete=models.SET_NULL, related_name="organizer")
    picture = models.ImageField(default=None, blank=True)
    background = models.ImageField(default=None, blank=True)
    maxContenders = models.IntegerField(default=4)
    description = models.CharField(max_length=1000, default="")
    winner = models.ForeignKey(Profile, null=True, on_delete=models.SET_NULL, related_name="winner")
    allContenders = models.ManyToManyField(Profile, blank=True)
    reasonForNoWinner = models.CharField(max_length=100, default="")
    history = models.ManyToManyField(Match, blank=True)
