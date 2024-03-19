from django.db import models
from django.contrib.postgres.fields import ArrayField

class Player(models.Model):
    name = models.CharField(max_length=100)
    mmr = models.IntegerField()
    friend_list = models.ManyToManyField('self', symmetrical=False, related_name='friends')
    friend_request_list = models.ManyToManyField('self', symmetrical=False, related_name='friend_requests')
    waiting_challenges_list = models.ManyToManyField('self', symmetrical=False, related_name='waiting_challenges')
    victories = models.PositiveIntegerField(default=0)
    defeats = models.PositiveIntegerField(default=0)

class GameState(models.Model):
     fen = models.CharField(max_length=255)
     moves = ArrayField(models.CharField(max_length=50), blank=True, null=True)
     turn = models.BooleanField(True)
     ball = models.OneToOneField("Ball", on_delete=models.CASCADE)
     paddle = models.OneToOneField("Paddle", on_delete=models.CASCADE)
     score = models.OneToOneField("Score", on_delete=models.CASCADE)

class Ball(models.Model):
    x = models.IntegerField()
    y = models.IntegerField()
    angle = models.IntegerField()
    speed = models.IntegerField()

class Paddle(models.Model):
    P1= models.IntegerField()
    P2 = models.IntegerField()

class Score(models.Model):
    P1 = models.IntegerField()
    P2 = models.IntegerField()

class Game(models.Model):
    name = models.CharField(max_length=100)
    state = models.OneToOneField("GameState", on_delete=models.CASCADE)   

class Room(models.Model):
    room_id = models.CharField(max_length=100)
    players = models.ManyToManyField("Player")
    game = models.OneToOneField("GameState", on_delete=models.CASCADE)
