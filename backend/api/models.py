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
    avatar = models.CharField(max_length=1000, default="")
    bio = models.CharField(max_length=10000, default="") 
    catchphrase = models.CharField(max_length=10000, default="")
    status = models.CharField(max_length=10000, default="online")
    match = models.IntegerField(default=0)
    challengeable = models.BooleanField(default=False)
    playing = models.BooleanField(default=False)
    friends = models.ManyToManyField('self', blank=True, symmetrical=True)
    muted = models.ManyToManyField('self', blank=True, symmetrical=True)
    chess_stats = models.OneToOneField('Chess_stats', on_delete=models.CASCADE, related_name="chess_stats")
    pong_stats = models.OneToOneField('Pong_stats', on_delete=models.CASCADE, related_name="pong_stats")
    tournaments = models.ManyToManyField('Tournament', related_name="organised_tournaments")
    subscriptions = models.ManyToManyField('Tournament', related_name="subscribed_tournaments")

    def __str__(self):
        return self.username

    def ppong_stats(self):
        pong = {}
        pong["rank"] = "pirate-symbol-mark-svgrepo-com.svg"
        pong["matches"] = 258
        pong["wins"] = 0
        pong["loses"] = 258
        pong["challengers"] = [2, 3, 4]
        pong["challenged"] = [5, 6, 7, 8, 9]
        return pong

    def cchess_stats(self):
        chess = {}
        chess["rank"] = "pirate-symbol-mark-svgrepo-com.svg"
        chess["matches"] = 258
        chess["wins"] = 0
        chess["loses"] = 258
        chess["challengers"] = [10, 11, 12]
        chess["challenged"] = [2, 13, 14, 15]
        return chess

    def profile(self):
        data = {}
        data["id"] = self.id 
        data["avatar"] =  self.avatar #"luffy.jpeg"
        data["name"] = self.user.username #"Monkey D. Luffy"
        data["catchphrase"] = self.catchphrase #"Le Roi des Pirates, ce sera moi !"
        data["bio"] = self.bio #"Monkey D. Luffy est un pirate et le principal protagoniste du manga et anime One Piece. Luffy est le fils du chef de l'Armée Révolutionnaire, Monkey D. Dragon, le petit-fils du célèbre héros de la Marine, Monkey D. Garp, le fils adoptif d'une bandit des montagnes, Curly Dadan ainsi que le frère adoptif du défunt Portgas D. Ace et de Sabo. "
        data["tournaments"] = list(self.tournaments.all().values_list("id", flat=True))
        data["subscriptions"] = list(self.subscriptions.all().values_list("id", flat=True))
        data["status"] = self.status 
        data["match"] = self.match
        data["friends"] = list(self.friends.all().values_list("id", flat=True))
        data["muted"] = list(self.muted.all().values_list("id", flat=True))
        data["pong"] = self.ppong_stats()
        data["chess"] = self.cchess_stats()
        payload = {}
        payload["profile"] = data
        return payload

class Chess_stats(models.Model):
    rank = models.CharField(choices=RANK)
    matches = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    loses = models.IntegerField(default=0)
    challengers = models.ManyToManyField("Accounts", related_name="chess_challengers")
    challenged = models.ManyToManyField("Accounts", related_name="chess_challenged")
    
class Pong_stats(models.Model):
    rank = models.CharField(choices=RANK)
    matches = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    loses = models.IntegerField(default=0)
    challengers = models.ManyToManyField("Accounts", related_name="pong_challengers")
    challenged = models.ManyToManyField("Accounts", related_name="pong_challenged")

class Match(models.Model):
     game = models.CharField(choices=GAME)
     winner = models.ForeignKey("Accounts", null=True, on_delete=models.SET_NULL, related_name='player_a')
     looser = models.ForeignKey("Accounts", null=True, on_delete=models.SET_NULL, related_name='player_b')
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
