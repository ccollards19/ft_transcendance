import logging
from game.serializers import MatchSerializer, RoomSerializer

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
        }
    
class RequestSerializer:
    def __init__(self, instance):
        self.instance = instance

    def data(self):
        return {
            "avatar" : self.instance.avatar.url,
            "id" : self.instance.id,
            "name" : self.instance.user.username
        }


class ProfileSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self, game, is_my_profile):
        if game == 'pong':
            gameData = PongStatsSerializer(self.instance.pong_stats).data()
        else:
            gameData = ChessStatsSerializer(self.instance.chess_stats).data()
        requests = []
        if is_my_profile:
            for item in list(self.instance.friend_requests.all()):
                requests.append(FriendSerializer(item).data())
        logger.debug(requests)
        friends = []
        for item in list(self.instance.friends.all()):
            friends.append(FriendSerializer(item).data())
        matches = []
        for item in list(self.instance.matches.all()):
            matches.append(MatchSerializer(item).data())
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
            "matches" : matches
        }
    
class PongChallengersSerializer:
    def __init__(self, instance):
        self.instance = instance

    def data(self):
        challengers = list(self.instance.challengers.all().values_list("id", flat=True)).append(list(self.instance.challenged.all().values_list("id", flat=True)))
        if challengers is None:
            challengers = []
        return challengers
    
class ChessChallengersSerializer:
    def __init__(self, instance):
        self.instance = instance

    def data(self):
        challengers = list(self.instance.challengers.all().values_list("id", flat=True)).append(list(self.instance.challenged.all().values_list("id", flat=True)))
        if challengers is None:
            challengers = []
        return challengers
    
class MyProfileSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        room = None
        if self.instance.room:
            room = RoomSerializer(self.instance.room).data()
        return {
            "id" : self.instance.id,
            "language" : self.instance.language,
            "game" : self.instance.defaultGame,
            "challengeable" : self.instance.challengeable,
            "spectate" : self.instance.spectate,
            "room" : room,
            "playing" : self.instance.playing,
            "avatar" : self.instance.avatar.url,
            "friends" : list(self.instance.friends.all().values_list("id", flat=True)),
            "blocked" : list(self.instance.blocked.all().values_list("id", flat=True)),
            "pongChallengers" : PongChallengersSerializer(self.instance.pong_stats).data(),
            "chessChallengers" : ChessChallengersSerializer(self.instance.chess_stats).data(),
            "subscriptions" : list(self.instance.subscriptions.all().values_list("id", flat=True)),
            "tournaments" : list(self.instance.tournaments.all().values_list("id", flat=True))
        }
    
class FriendSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        return {
            "id" : self.instance.id,
            "avatar" : self.instance.avatar.url,
            "name" : self.instance.user.username, 
            "status" : self.instance.status,
            "challengeable" : self.instance.challengeable
        }
    
class ChampionSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self, stats):
        logger.debug('DEBUG')
        logger.debug(self.instance)
        return {
            "id" : self.instance.id,
            "avatar" : self.instance.avatar.url,
            "name" : self.instance.user.username,
            "matches" : stats.matches,
            "wins" : stats.wins,
            "losses" : stats.losses
        }
    
class ChatProfileSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        return {
            "id" : self.instance.id,
            "name" : self.instance.user.username,
            "challengeable" : self.instance.challengeable
        }