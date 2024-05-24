from django.db import models
from django.contrib.auth.models import BaseUserManager, UserManager, AbstractBaseUser, AbstractUser, User

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

STATUS = {
    "offline":"offline",
    "online":"online"
    }

# class MyUserManager(UserManager):
#     def create_user(self, username, password, email):
#         if not email:
#             raise ValueError("Users must have an email address")
#         if not password:
#             raise ValueError("Users must have password")

#         user = self.model(
#             email=self.normalize_email(email),
#             username=username,
#         )

#         user.set_password(password)
#         user.save(using=self._db)
#         return user
#     
#     def create_superuser(self, username, password, email):

#         user = self.create_user(
#             username=username,
#             email=self.normalize_email(email),
#             password=password
#         )
#         user.is_admin=True
#         user.save(using=self._db)
#         return user


# class User(AbstractUser):
#     email = models.EmailField(
#         verbose_name="email address",
#         max_length=255,
#         unique=True,
#     )
#     username = models.CharField(max_length=1000, unique=True)
#     is_active = models.BooleanField(default=True)
#     is_admin = models.BooleanField(default=False)

#     objects = MyUserManager()

#     USERNAME_FIELD = "email"
#     REQUIRED_FIELDS = []

#     def __str__(self):
#         return self.email

#     def has_perm(self, perm, obj=None):
#         "Does the user have a specific permission?"
#         # Simplest possible answer: Yes, always
#         return True

#     def has_module_perms(self, app_label):
#         "Does the user have permissions to view the app `app_label`?"
#         # Simplest possible answer: Yes, always
#         return True

#     @property
#     def is_staff(self):
#         "Is the user a member of staff?"
#         # Simplest possible answer: All admins are staff
#         return self.is_admin


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
    avatar = models.ImageField(default="default_avatar.jpeg", blank=True)
    bio = models.CharField(max_length=10000, default="") 
    catchphrase = models.CharField(max_length=10000, default="")
    status = models.CharField(choices=STATUS, default=STATUS["offline"])
    match = models.IntegerField(default=0)
    challengeable = models.BooleanField(default=True)
    spectate = models.BooleanField(default=True)
    playing = models.BooleanField(default=False)
    friends = models.ManyToManyField('self', blank=True, symmetrical=True)
    friend_requests = models.ManyToManyField('self', blank=True, related_name="request_accounts", symmetrical=False)
    blocked = models.ManyToManyField('self', blank=True, related_name="blocked_accounts", symmetrical=False)
    # challengers = models.ManyToManyField('self', blank=True)
    # challenged = models.ManyToManyField('self', blank=True)
    chess_stats = models.OneToOneField('Chess_stats',  null=True, on_delete=models.CASCADE, related_name="chess_stats")
    pong_stats = models.OneToOneField('Pong_stats', null=True, on_delete=models.CASCADE, related_name="pong_stats")
    tournaments = models.ManyToManyField('Tournament', related_name="organised_tournaments", symmetrical=False)
    subscriptions = models.ManyToManyField('Tournament', related_name="subscribed_tournaments", symmetrical=False)

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
    #  tournament = models.ForeignKey("Tournament", null=True, on_delete=models.SET_NULL)
     # game_mode = models.CharField(choices=GAME_MODES)


class Tournament(models.Model):
    title = models.CharField(max_length=30, default="sample_tournament")
    game = models.CharField(max_length=100, default="pong")
    organizerId = models.IntegerField(default=0)
    organizerName = models.CharField(max_length=20, default="")
    picture = models.ImageField()
    background = models.ImageField(default=None, blank=True)
    maxContenders = models.IntegerField(default=4)
    description = models.CharField(max_length=1000, default="")
    winnerId = models.IntegerField(default=0)
    winnerName = models.CharField(max_length=20, default="")
    allContenders = models.ManyToManyField(Accounts, blank=True)
    reasonForNoWinner = models.CharField(max_length=100, default="")
    history = models.ManyToManyField(Match, blank=True)
    
    def __str__(self):
        return self.title
