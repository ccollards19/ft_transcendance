import logging
from game.serializers import MatchSerializer

logger = logging.getLogger(__name__)

class PongStatsSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
            return {
            "rank" : self.instance.rank,
            "matches" : self.instance.matches,
            "wins" : self.instance.wins,
            "losses" : self.instance.losses,
            "score" : self.instance.score
        }

class ChessStatsSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
            return {
            "rank" : self.instance.rank,
            "matches" : self.instance.matches,
            "wins" : self.instance.wins,
            "losses" : self.instance.losses,
            "score" : self.instance.score
        }

class ProfileSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self, game, is_my_profile):
        matches = []
        if game == 'pong':
            gameData = PongStatsSerializer(self.instance.pong_stats).data()
            savedMatches = list(self.instance.pong_stats.history.all())
        elif game == 'chess':
            gameData = ChessStatsSerializer(self.instance.chess_stats).data()
            savedMatches = list(self.instance.chess_stats.history.all())
        matches = []
        if savedMatches:
            savedMatches = savedMatches.reverse()
            i = 0
            while i < 10 and i < len(savedMatches):
                matches.append(MatchSerializer(savedMatches[i]).data())
                i += 1
        requests = []
        if is_my_profile:
            for item in list(self.instance.friend_requests.all()):
                requests.append(FriendSerializer(item).data())
        friends = []
        for item in list(self.instance.friends.all()):
            friends.append(FriendSerializer(item).data())
        room = 0
        game = ''
        if bool(self.instance.room) and self.instance.room.spectate:
            room = self.instance.room.id
            game = self.instance.room.game
        return {
            "id" : self.instance.id, 
            "avatar" :  self.instance.avatar.url,
            "name" : self.instance.user.username, 
            "catchphrase" : self.instance.catchphrase, 
            "bio" : self.instance.bio, 
            "status" : self.instance.status,
            "challengeable" : self.instance.challengeable,
            "friends" : friends,
            "friend_requests" : requests,
            "gameStat" : gameData,
            "matches" : matches,
            "room" : room,
            "game" : game
        }
    
class PongChallengersSerializer:
    def __init__(self, instance):
        self.instance = instance

    def data(self):
        challengers = list(self.instance.challengers.all().values_list("id", flat=True)) + list(self.instance.challenged.all().values_list("id", flat=True))
        if challengers is None:
            return []
        return 
    
class ChessChallengersSerializer:
    def __init__(self, instance):
        self.instance = instance

    def data(self):
        challengers = list(self.instance.challengers.all().values_list("id", flat=True)) + list(self.instance.challenged.all().values_list("id", flat=True))
        if challengers is None:
            challengers = []
        return challengers
    
class MyProfileSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        room = None
        if self.instance.room:
            room = self.instance.room.id
        return {
            "id" : self.instance.id,
            "name" : self.instance.user.username,
            "language" : self.instance.language,
            "game" : self.instance.defaultGame,
            "challengeable" : self.instance.challengeable,
            "spectate" : self.instance.spectate,
            "room" : room,
            "playing" : self.instance.playing,
            "avatar" : self.instance.avatar.url,
            "friends" : list(self.instance.friends.all().values_list("id", flat=True)),
            "blocked" : list(self.instance.blocked.all().values_list("id", flat=True)),
            "pongChallengers" : list(self.instance.pong_stats.challengers.all().values_list("id", flat=True)) + list(self.instance.pong_stats.challenged.all().values_list("id", flat=True)),
            "chessChallengers" : list(self.instance.chess_stats.challengers.all().values_list("id", flat=True)) + list(self.instance.chess_stats.challenged.all().values_list("id", flat=True)),
            "subscriptions" : list(self.instance.subscriptions.all().values_list("id", flat=True)),
            "tournaments" : list(self.instance.tournaments.all().values_list("id", flat=True))
        }
    
class FriendSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        room = 0
        game = ''
        if self.instance.room and self.instance.room.spectate:
            room = self.instance.room.id
            game = self.instance.room.game
        return {
            "id" : self.instance.id,
            "avatar" : self.instance.avatar.url,
            "name" : self.instance.user.username, 
            "status" : self.instance.status,
            "challengeable" : self.instance.challengeable,
            "room" : room,
            "game" : game
        }
    
class ChampionSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self, stats):
        return {
            "id" : self.instance.id,
            "avatar" : self.instance.avatar.url,
            "name" : self.instance.user.username,
            "matches" : stats.matches,
            "wins" : stats.wins,
            "losses" : stats.losses,
            "score" : stats.score
        }
    
class ChatProfileSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        room = 0
        game = ''
        if self.instance.room and self.instance.room.spectate:
            room = self.instance.room.id
            game = self.instance.room.game
        return {
            "id" : self.instance.id,
            "name" : self.instance.user.username,
            "challengeable" : self.instance.challengeable,
            "status" : self.instance.status,
            "room" : room,
            "game" : game
        }
    
class ChatListSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        return {
            "id" : self.instance.id,
            "name" : self.instance.user.username
        }