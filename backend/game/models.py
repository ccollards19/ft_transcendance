from django.db import models
from django.contrib.postgres.fields import ArrayField
from api.models import user
# class Player(models.Model):
#     name = models.CharField(max_length=100, default="guest")
#     mmr = models.IntegerField(default=0)
#     friend_list = models.ManyToManyField('self', symmetrical=False, related_name='friends')
#     friend_request_list = models.ManyToManyField('self', symmetrical=False, related_name='friend_requests')
#     waiting_challenges_list = models.ManyToManyField('self', symmetrical=False, related_name='waiting_challenges')
#     victories = models.PositiveIntegerField(default=0)
#     defeats = models.PositiveIntegerField(default=0)

class GameState(models.Model):
    fen = models.CharField(max_length=255, default="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -0 1")
    moves = ArrayField(models.CharField(max_length=50), blank=True, null=True)
    turn = models.BooleanField(True, default=True)
    ball = models.OneToOneField("Ball", on_delete=models.CASCADE)
    paddle = models.OneToOneField("Paddle", on_delete=models.CASCADE)
    score = models.OneToOneField("Score", on_delete=models.CASCADE)
    kingpin = models.BooleanField(True, default=False)

class Ball(models.Model):
    x = models.IntegerField(default=0)
    y = models.IntegerField(default=0)
    angle = models.IntegerField(default=0)
    speed = models.IntegerField(default=5)

class Paddle(models.Model):
    P1= models.IntegerField(default=0)
    P2 = models.IntegerField(default=0)

class Score(models.Model):
    P1 = models.IntegerField(default=0)
    P2 = models.IntegerField(default=0)

class Game(models.Model):
    name = models.CharField(max_length=100, default="pong")
    state = models.OneToOneField("GameState", on_delete=models.CASCADE)   

class Room(models.Model):
    player1 = models.ForeignKey(user, null=True, on_delete=models.SET_NULL, related_name="player1")
    player2 = models.ForeignKey(user, null=True, on_delete=models.SET_NULL, related_name="player2")
    game = models.OneToOneField("Game", on_delete=models.CASCADE)
