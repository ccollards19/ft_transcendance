from django.db import models
from django.contrib.auth.models import User 
import logging

logger = logging.getLogger(__name__)

STATUS = {
    "offline":"offline",
    "online":"online"
    }

class Chess_stats(models.Model):
    rank = models.IntegerField(default=0)
    matches = models.IntegerField(default=0)
    level = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    challengers = models.ManyToManyField("Profile", blank=True, related_name='chess_challengers')
    challenged = models.ManyToManyField("Profile", blank=True, related_name='chess_challenged')
    history = models.ManyToManyField(to='game.Match', blank=True, related_name="chess_history")
    score = models.IntegerField(default=100)
    
class Pong_stats(models.Model):
    rank = models.IntegerField(default=0)
    matches = models.IntegerField(default=0)
    level = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    challengers = models.ManyToManyField("Profile", related_name='pong_challengers')
    challenged = models.ManyToManyField("Profile", related_name='pong_challenged')
    history = models.ManyToManyField(to='game.Match', blank=True, related_name="pong_history")
    score = models.IntegerField(default=100)

class MatchField(models.ManyToManyField):
    def __init__(self, to, **options):
        models.ManyToManyField.__init__(self, to, **options)

    def lastTen(self):
        logger.debug('here')


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    language = models.CharField(max_length=2, default="en")
    defaultGame = models.CharField(max_length=5, default="pong")
    avatar = models.ImageField(default="default_avatar.jpeg", blank=True)
    bio = models.CharField(max_length=10000, default="") 
    catchphrase = models.CharField(max_length=10000, default="")
    status = models.CharField(choices=STATUS, default=STATUS["offline"])
    room = models.ForeignKey("game.Room", null=True, on_delete=models.CASCADE, related_name="room")
    challengeable = models.BooleanField(default=True)
    spectate = models.BooleanField(default=True)
    playing = models.BooleanField(default=False)
    friends = models.ManyToManyField("self", blank=True)
    friend_requests = models.ManyToManyField("self", blank=True, symmetrical=False)
    blocked = models.ManyToManyField("self", blank=True)
    chess_stats = models.OneToOneField("Chess_stats",  null=True, on_delete=models.CASCADE, related_name="chess_stats")
    pong_stats = models.OneToOneField('Pong_stats', null=True, on_delete=models.CASCADE, related_name="pong_stats")
    tournaments = models.ManyToManyField('tournaments.Tournament', blank=True, related_name='tournaments')
    subscriptions = models.ManyToManyField('tournaments.Tournament', blank=True, related_name='subsccriptions')
    chatChannelName = models.CharField(max_length=100, default='')
    matchChannelName = models.CharField(max_length=100, default='')

    def __str__(self):
        return self.user.username
    
