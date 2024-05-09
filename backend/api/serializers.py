from api.models import *
# from channels.db import database_sync_to_async

class PongStatsSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        return {
            "rank" : self.instance.rank,
            "matches" : self.instance.matches,
            "wins" : self.instance.wins,
            "loses" : self.instance.loses,
            "challengers" : list(self.instance.challenged.all().values_list("id", flat=True)),
            "challenged" : list(self.instance.challengers.all().values_list("id", flat=True)),
        }

class ChessStatsSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
            return {
            "rank" : self.instance.rank,
            "matches" : self.instance.matches,
            "wins" : self.instance.wins,
            "loses" : self.instance.loses,
            "challengers" : list(self.instance.challenged.all().values_list("id", flat=True)),
            "challenged" : list(self.instance.challengers.all().values_list("id", flat=True)),
        }

class ProfileSampleSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        pong_data = PongStatsSerializer(self.instance.pong_stats).data()
        chess_data = ChessStatsSerializer(self.instance.chess_stats).data()
        return {
            "id" : self.instance.id, 
            "avatar" :  self.instance.avatar, #"luffy.jpeg"
            "name" : self.instance.user.username, #"Monkey D. Luffy"
            "challengeable" : self.instance.challengeable,
            "spectate" : self.instance.spectate,
            "status" : self.instance.status,
        }

class ProfileSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        pong_data = PongStatsSerializer(self.instance.pong_stats).data()
        chess_data = ChessStatsSerializer(self.instance.chess_stats).data()
        return {
            "id" : self.instance.id, 
            "avatar" :  self.instance.avatar, 
            "name" : self.instance.user.username, 
            "catchphrase" : self.instance.catchphrase, 
            "bio" : self.instance.bio, 
            "tournaments" : list(self.instance.tournaments.all().values_list("id", flat=True)),
            "subscriptions" : list(self.instance.subscriptions.all().values_list("id", flat=True)),
            "status" : self.instance.status,
            "challengeable" : self.instance.challengeable,
            "match" : self.instance.match,
            "friends" : list(self.instance.friends.all().values_list("id", flat=True)),
            "friend_requests" : list(self.instance.friend_requests.all().values_list("id", flat=True)),
            "blocked" : list(self.instance.blocked.all().values_list("id", flat=True)),
            "pong" : pong_data,
            "chess" : chess_data
        }

class MyProfileSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        pong_data = PongStatsSerializer(self.instance.pong_stats).data()
        chess_data = ChessStatsSerializer(self.instance.chess_stats).data()
        return {
            "id" : self.instance.id, 
            "avatar" :  self.instance.avatar, 
            "name" : self.instance.user.username, 
            "catchphrase" : self.instance.catchphrase, 
            "bio" : self.instance.bio, 
            "tournaments" : list(self.instance.tournaments.all().values_list("id", flat=True)),
            "subscriptions" : list(self.instance.subscriptions.all().values_list("id", flat=True)),
            "status" : self.instance.status,
            "challengeable" : self.instance.challengeable,
            "match" : self.instance.match,
            "friends" : list(self.instance.friends.all().values_list("id", flat=True)),
            "friend_requests" : list(self.instance.friend_requests.all().values_list("id", flat=True)),
            "blocked" : list(self.instance.blocked.all().values_list("id", flat=True)),
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
            "loser" : self.instance.loser,
            "tournament" : self.instance.tournament
            # "start_time" : self.instance.start_time,
            # "end_time" : self.instance.end_time,
            # "length" : self.instance.length,
            # "game_mode" : self.instance.game_mode
        }

class MatchSampleSerializer():
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        return {
            "contenders" : [self.instance.winner, self.instance.loser],
            "winner" : self.instance.winner
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
            "organizerId" : self.instance.organizer.id,
            "organizerName" : self.instance.organizer.user.username,
            "picture" : self.instance.picture,
            "background" : self.instance.background,
            "description" : self.instance.description,
            "winnerId" : self.instance.winner.id,
            "winnerName" : self.instance.winner.user.username,
            "reasonForNoWinner" : self.instance.reasonForNoWinner,
            "maxContenders" : self.instance.maxContenders,
            "allContenders" : list(self.instance.contenders.all().values_list("id", flat=True)),
            "timeout" : self.instance.timeout,
            "history" : list(self.instance.history.all().values_list("id", flat=True))
        }

class ChallengerSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        return {
            "avatar" : self.instance.avatar,
            "id" : self.instance.avatar,
            "name" : self.instance.user.username,
            "playing" : self.instance.playing,
            "status" : self.instance.status,
            "match" : self.instance.match
        }

class LeaderboardEntrySerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        return {
            "avatar" : self.instance.avatar,
            "id" : self.instance.id,
            "name" :  self.instance.user.username,
            "pong" : {
                "rank" : self.instance.chess_stats.rank,
                "wins" : self.instance.chess_stats.wins,
                "loses" : self.instance.chess_stats.loses,
                "matches" : self.instance.chess_stats.matches,
                "level" : self.instance.chess_stats.level
                },
            "chess" : {
                "rank" : self.instance.pong_stats.rank,
                "wins" : self.instance.pong_stats.wins,
                "loses" : self.instance.pong_stats.loses,
                "matches" : self.instance.pong_stats.matches,
                "level" : self.instance.pong_stats.level
                },
            "friends" : list(self.instance.friends.all().values_list("id", flat=True))
        }
