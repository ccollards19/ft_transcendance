from django.db import models
from django.contrib.auth.models import AbstractUser

class Game(models.TextChoices):
    CHESS = "Chess"
    PONG = "Pong"

GAME_MODES = {
    "Chess": {},
    "Pong": {},
    "None": {},
}

# Create your models here.
class user(AbstractUser):
    avatar = models.CharField(max_length=1000) #need sanitation
    bio = models.CharField(max_length=10000) #need sanitation
    catchphrase = models.CharField(max_length=10000) #need sanitation
    
    def __str__(self):
        return self.username

class match(models.Model):
    game = models.CharField(choices=Game.choices)
    player_a = models.ForeignKey("user", null=True, on_delete=models.SET_NULL, related_name='player_a')
    player_b = models.ForeignKey("user", null=True, on_delete=models.SET_NULL, related_name='player_b')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    length = models.DurationField()
    tournament = models.ForeignKey("tournament", null=True, on_delete=models.SET_NULL)
    game_mode = models.CharField(choices=GAME_MODES)
    public = models.BooleanField()
    ranked = models.BooleanField()

class scheduled_match(models.Model):
    match = models.ForeignKey("match", on_delete=models.CASCADE)

class match_history(models.Model):
    match = models.ForeignKey("match", on_delete=models.CASCADE)

class tournament(models.Model):
    game = models.CharField(choices=Game.choices)
    title = models.CharField(max_length=1000)
    picture = models.CharField(max_length=1000)
    organizer = models.ForeignKey("user", null=True, on_delete=models.SET_NULL)

