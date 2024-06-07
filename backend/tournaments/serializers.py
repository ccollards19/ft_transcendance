import logging

logger = logging.getLogger(__name__)

class SpecialContenderSerializer:
    def __init__(self, instance):
        self.instance = instance

    def data(self):
        return {
            "id" : self.instance.id,
            "name" : self.instance.user.username
        }
    
class ContenderSerializer:
    def __init__(self, instance):
        self.instance = instance

    def data(self):
        return {
            "id" : self.instance.id,
            "name" : self.instance.user.username,
            "avatar" : self.instance.avatar.url
        }

class PlayerSerializer:
    def __init__(self, instance):
        self.instance = instance

    def data(self):
        return {
            "id" : self.instance.id,
            "avatar" : self.instance.avatar.url
        }

class MatchSerializer:
    def __init__(self, instance):
        self.instance = instance

    def data(self):
        return {
            "player1" : PlayerSerializer(self.instance.player1).data(),
            "player2" : PlayerSerializer(self.instance.player2).data(),
            "winner" : self.instance.winner
        }

class TournamentSerializer:
    def __init__(self, instance):
        self.instance = instance
    def data(self):
        background = self.instance.background
        if bool(background):
            background = self.instance.background.url
        else:
            background = None
        contenders = []
        for item in list(self.instance.allContenders.all()):
            contenders.append(ContenderSerializer(item).data())
        organizer = SpecialContenderSerializer(self.instance.organizer).data()
        winner = None
        if self.instance.winner:
            winner = SpecialContenderSerializer(self.instance.winner).data()
        matches = []
        for item in list(self.instance.history.all()):
            matches.append(MatchSerializer(item).data())
        return {
            "id" : self.instance.id,
            "title" : self.instance.title,
            "background" : background,
            "picture" : self.instance.picture.url,
            "organizer" : organizer, 
            "matches" : matches,
            "winner" : winner,
            "description" : self.instance.description,
            "maxContenders" : self.instance.maxContenders,
            "game" : self.instance.game,
            "reasonForNoWinner" : self.instance.reasonForNoWinner,
            "contenders" : contenders
        }
    
class TournamentListSerializer:
    def __init__(self, instance, user):
        self.instance = instance
        self.user = user
    def data(self):
        winner = None
        if self.instance.winner:
            winner = ContenderSerializer(self.instance.winner).data()
        yourTurn = False
        for item in self.instance.nextMatches.all():
            opponent = None
            if item.player1.user == self.user:
                opponent = item.player2
            elif item.player2.user == self.user:
                opponent = item.player1
            if bool(opponent):
                yourTurn = {
                    "id" : opponent.id,
                    "name" : opponent.username.name,
                    "status" : opponent.status,
                    "challengeable" : opponent.challengeable,
                    "opponentRoom" : opponent.room.id,
                    "room" : item.id
                }
        complete = False
        if (self.instance.allContenders.all().count() == self.instance.maxContenders):
            complete = True
        return {
            "picture" : self.instance.picture.url,
            "title" : self.instance.title,
            "id" : self.instance.id,
            "reasonForNoWinner" : self.instance.reasonForNoWinner,
            "winner" : winner,
            "yourTurn" : yourTurn,
            "complete" : complete
        }