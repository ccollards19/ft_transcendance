from django.db import models
from django.contrib.auth.models import User

GAME = {
        "c" : "Chess",
    "p" : "Pong"
    }

GAME_MODES = {
    "Chess": {},
    "Pong": {},
    "None": {}
    }

RANK = {
    "default":"pirate-symbol-mark-svgrepo-com.svg"
        }

# Create your models here.
class Accounts(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # username 
    # first_name
    # last_name
    # email
    # password
    # groups
    # user_permissions
    # is_staff
    # is_active
    # is_superuser
    # last_login
    # date_joined
    avatar = models.CharField(max_length=1000, default="default_avatar.jpeg")
    bio = models.CharField(max_length=10000, default="") 
    catchphrase = models.CharField(max_length=10000, default="")
    status = models.CharField(max_length=10000, default="online")
    match = models.IntegerField(default=0)
    challengeable = models.BooleanField(default=False)
    playing = models.BooleanField(default=False)
    friends = models.ManyToManyField('self', blank=True, symmetrical=True)
    friend_requests = models.ManyToManyField('self', blank=True)
    blocked = models.ManyToManyField('self', blank=True, symmetrical=True)
    chess_stats = models.OneToOneField('Chess_stats',  null=True, on_delete=models.CASCADE, related_name="chess_stats")
    pong_stats = models.OneToOneField('Pong_stats', null=True, on_delete=models.CASCADE, related_name="pong_stats")
    tournaments = models.ManyToManyField('Tournament', related_name="organised_tournaments")
    subscriptions = models.ManyToManyField('Tournament', related_name="subscribed_tournaments")

    def __str__(self):
        return self.user.username


class Chess_stats(models.Model):
    rank = models.CharField(choices=RANK, default=RANK["default"])
    matches = models.IntegerField(default=0)
    level = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    loses = models.IntegerField(default=0)
    challengers = models.ManyToManyField("Accounts", related_name="chess_challengers")
    challenged = models.ManyToManyField("Accounts", related_name="chess_challenged")
    
class Pong_stats(models.Model):
    rank = models.CharField(choices=RANK, default=RANK["default"])
    matches = models.IntegerField(default=0)
    level = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    loses = models.IntegerField(default=0)
    challengers = models.ManyToManyField("Accounts", related_name="pong_challengers")
    challenged = models.ManyToManyField("Accounts", related_name="pong_challenged")

class Match(models.Model):
     game = models.CharField(choices=GAME)
     winner = models.ForeignKey("Accounts", null=True, on_delete=models.SET_NULL, related_name='player_a')
     loser = models.ForeignKey("Accounts", null=True, on_delete=models.SET_NULL, related_name='player_b')
     # start_time = models.DateTimeField()
     # end_time = models.DateTimeField()
     # length = models.DurationField()
     tournament = models.ForeignKey("Tournament", null=True, on_delete=models.SET_NULL)
     # game_mode = models.CharField(choices=GAME_MODES)


class Tournament(models.Model):
    game = models.CharField(choices=GAME)
    title = models.CharField(max_length=1000, default="")
    picture = models.CharField(max_length=1000, default="")
    organizer = models.ForeignKey("Accounts", null=True, on_delete=models.SET_NULL)
    matches =  models.ManyToManyField("Accounts", related_name="tournament_matches")
    
    def __str__(self):
        return self.title
