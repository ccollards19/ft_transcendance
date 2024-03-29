from api.models import *

class PongStatsSerializer:
    def __init__(self, instance):
        self.instance = instance

    def data(self):
        return {
        }

class ChessStatsSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        return {
        }


class ProfileSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        pong_data = PongStatsSerializer(self.instance.pong_stats).data()
        chess_data = ChessStatsSerializer(self.instance.chess_stats).data()
        return {
            "id" : self.instance.id, 
            "avatar" :  self.instance.avatar, #"luffy.jpeg"
            "name" : self.instance.user.username, #"Monkey D. Luffy"
            "catchphrase" : self.instance.catchphrase, #"Le Roi des Pirates, ce sera moi !"
            "bio" : self.instance.bio, #"Monkey D. Luffy est un pirate et le principal protagoniste du manga et anime One Piece. Luffy est le fils du chef de l'Armée Révolutionnaire, Monkey D. Dragon, le petit-fils du célèbre héros de la Marine, Monkey D. Garp, le fils adoptif d'une bandit des montagnes, Curly Dadan ainsi que le frère adoptif du défunt Portgas D. Ace et de Sabo. "
            "tournaments" : list(self.instance.tournaments.all().values_list("id", flat=True)),
            "subscriptions" : list(self.instance.subscriptions.all().values_list("id", flat=True)),
            "status" : self.instance.status,
            "match" : self.instance.match,
            "friends" : list(self.instance.friends.all().values_list("id", flat=True)),
            "muted" : list(self.instance.muted.all().values_list("id", flat=True)),
            "pong" : pong_data,
            "chess" : chess_data
        }

class MatchSerializer():
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        return {
            "game" : self.instance.game,
            "winner" : self.instance.winner,
            "looser" : self.instance.looser,
            "tournament" : self.instance.tournament
            # "start_time" : self.instance.start_time,
            # "end_time" : self.instance.end_time,
            # "length" : self.instance.length,
            # "game_mode" : self.instance.game_mode
        }
     # start_time = models.DateTimeField()
     # end_time = models.DateTimeField()
     # length = models.DurationField()
     # game_mode = models.CharField(choices=GAME_MODES)


class TournamentSerializer():
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        return {
            "game" : self.instance.game,
            "title" : self.instance.title,
            "picture" : self.instance.picture,
            "organizer" : self.instance.organizer
        }
