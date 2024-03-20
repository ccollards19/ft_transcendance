from django.db import models
from django.contrib.auth.models import AbstractUser

GAME = {
        "c" : "Chess",
    "p" : "Pong",
    }

GAME_MODES = {
    "Chess": {},
    "Pong": {},
    "None": {},
    }

# Create your models here.
class user(AbstractUser):
    avatar = models.CharField(max_length=1000, default="")
    bio = models.CharField(max_length=10000, default="") 
    catchphrase = models.CharField(max_length=10000, default="")
    status = models.CharField(max_length=10000, default="online")
    challengeable = models.BooleanField(default=False)
    playing = models.BooleanField(default=False)
    friends = models.ManyToManyField('self', blank=True, symmetrical=True)
    # chess_stats = models.OneToOneField()
    # pong_stats = models.OneToOneField()
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

    def __str__(self):
        return self.username

    def to_dict(self):
        data = {}
        data["username"] = getattr(self, "username")
        data["password"] = getattr(self, "password")
        try : 
            data["address"] = getattr(self, "address")
        except Exception:
            data["address"] = "" 
        return data

# class chess_stats(models.Model)
# class pong_stats(models.Model)

class match(models.Model):
     game = models.CharField(choices=GAME)
     player_a = models.ForeignKey("user", null=True, on_delete=models.SET_NULL, related_name='player_a')
     player_b = models.ForeignKey("user", null=True, on_delete=models.SET_NULL, related_name='player_b')
     start_time = models.DateTimeField()
     end_time = models.DateTimeField()
     length = models.DurationField()
     timeout = models.DurationField()
     tournament = models.ForeignKey("tournament", null=True, on_delete=models.SET_NULL)
     game_mode = models.CharField(choices=GAME_MODES)
     public = models.BooleanField(default=False)
     ranked = models.BooleanField(default=False)

class scheduled_match(models.Model):
    match = models.ForeignKey("match", on_delete=models.CASCADE)

class match_history(models.Model):
    match = models.ForeignKey("match", on_delete=models.CASCADE)

class tournament(models.Model):
    game = models.CharField(choices=GAME)
    title = models.CharField(max_length=1000, default="")
    picture = models.CharField(max_length=1000, default="")
    organizer = models.ForeignKey("user", null=True, on_delete=models.SET_NULL)
