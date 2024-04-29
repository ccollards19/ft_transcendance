import json
import threading
from typing import get_args
from channels.generic.websocket import JsonWebsocketConsumer
from django.contrib.auth import authenticate, login, logout
from django.db.models import  F, Q, FloatField, ExpressionWrapper
from api.models import Tournament, Match, Accounts, Pong_stats, Chess_stats
from channels.db import database_sync_to_async
from api.serializers import ProfileSerializer, LeaderboardEntrySerializer, ProfileSampleSerializer, TournamentSerializer, MatchSampleSerializer
from asgiref.sync import async_to_sync    

class GlobalConsumer(JsonWebsocketConsumer):

    def connect(self):
        self.user = self.scope["user"]
        self.component = ""
        self.accept()
        async_to_sync(self.channel_layer.group_add)("chat_general", self.channel_name)
        print("CONNECTED")

    def disconnect(self, close_code):
        print("DISCONNECT TEST")
        self.channel_layer.group_discard("chat_general", self.channel_name)
        if (self.user.is_authenticated):
            self.channel_layer.group_discard(self.user.username, self.channel_name)
            self.channel_layer.group_discard("online", self.channel_name)

#########################################################################

    # receive a json from a websocket
    # parse the json
    # make a batch of messages depending on the component
    # send the batch of messages to the appropriate client connections
    def receive_json(self, text_data):
   #      self.send_json({
   #              "action":"chat",
			# 	"type" : "message",
   #              "target" : "chat_general",
			# 	"id" : "0",
			# 	"name" : "server",
   #              "text" : f"test"
			# })

        component = text_data.get("component")
        action = text_data.get("action")
        item = text_data.get("item")
        if component is None: return
        elif (component == "app"):
            if text_data.get("status") is not None:
                self.register_user()
            msg_batch = []
        elif (component == "chat"):
            msg_batch = self.handle_chat(action, item)
        elif (component == "login"):
            self.component = component
            msg_batch = self.handle_login(action, item)
        elif (component == "home"):
            self.component = component
            msg_batch = self.handle_home(action, item)
        elif (component == "profile"):
            self.component = component
            msg_batch = self.handle_profile(action, item)
        elif (component == "tournament"):
            self.component = component
            msg_batch = self.handle_tournament(action, item)
        elif (component == "tournaments"):
            self.component = component
            msg_batch = self.handle_tournaments(action, item)
        elif (component == "play"):
            self.component = component
            msg_batch = self.handle_play(action, item)
        elif (component == "match"):
            self.component = component
            msg_batch = self.handle_match(action, item)
        elif (component == "leaderboard"):
            self.component = component
            msg_batch = self.handle_leaderboard(action, item)
        else: return
        for msg in msg_batch:
            if msg is None : continue
            elif msg.get("target") is None :
                self.send_json(msg["payload"]["message"])
            else :
                async_to_sync(self.channel_layer.group_send)( msg["target"], msg["payload"])

#########################################################################

    def register_user(self):
        self.user = self.scope["user"]
        print(self.user)
        if (self.user.is_authenticated):
            print("REGISTERED")
            async_to_sync(self.channel_layer.group_add)(self.user.username, self.channel_name)
            async_to_sync(self.channel_layer.group_add)("online", self.channel_name)
            self.send_json({
                "action":"chat",
				"type" : "message",
                "target" : "chat_general",
				"id" : "0",
				"name" : "server",
				"text" : "logged in"
			})
        else :
            self.send_json({
                "action":"chat",
				"type" : "message",
                "target" : "chat_general",
				"id" : "0",
				"name" : "server",
				"text" : f"not logged in {self.user}"
			})

 ##########################################################################

    def handle_chat(self, action, item):
        msg_batch = []

        target = item.get("target")
        if target is None : return msg_batch
        msg_batch.append({
            "target" : target,
            "payload" : {
                "type" : "chat.message",
                "message" : {
                    "action":"chat",
                    "type" : item.get("type"),
                    "target" : item.get("target"),
                    "id" : str(item.get("myId")),
                    "name" : item.get("name"),
                    "text" : item.get("text")
                    }
                },
            })
        return msg_batch

    def chat_message(self, event):
        print("|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        print(f"sending {payload}");
        self.send_json(payload)
        print("|||||||||||||||||||||||||||||||||||||||||");

############################################################################

    def handle_home(self, action, item):
        msg_batch = []
        return msg_batch

    def home_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)

############################################################################

    def handle_about(self, action, item):
        msg_batch = []
        return msg_batch

    def about_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)

############################################################################

    def handle_tournament(self, action, item):
        msg_batch = []
        target = None
        id = item.get('id')
        if id is None : return msg_batch
        try : 
            instance = Tournament.objects.get(id=(int(id)))
            payload = TournamentSerializer(instance).data()
            msg_batch.append({
                "target" : target,
                "payload" : {
                    "type" : "tournament.update",
                    "message" : {
                        "action": "setTournament",
                        "item": payload
                        }
                    },
                })
            matches = instance.matches.all()
            payload = []
            for match in matches :
                payload.append({
                    "id": match.id,
                    "item": MatchSampleSerializer(match).data()
                })
            msg_batch.append({
                "target" : target,
                "payload" : {
                    "type" : "profile.update",
                    "message" : {
                        "action": "setMatch",
                        "item": payload
                        }
                    },
                })
            return msg_batch
        except :
            tour_item = {
		"id" : 1,
		"game": "pong",
		"organizerId" : 1,
		"organizerName" : "Monkey D. Luffy",
		"picture" : "davy_back_fight.jpeg",
		"background" : "dbf.jpeg",
		"title" : "Davy back fight",
		"description" : "The Davy Back Fight is a traditional pirate game held in homage to the mythical Davy Jones, meant to challenge—and conscript—members of opposing crews.",
		"winnerId" : 1,
		"winnerName" : "Monkey D. Luffy",
		"reasonForNoWinner" : "",
		"maxContenders" : 8,
		"allContenders" : [1, 2, 3, 4, 5, 6, 7, 8],
		"timeout" : 0,
		"history" : [1, 2, 3, 4, 5, 6, 7]
	    }
            return ([
                {
                    "target" : target,
                    "payload" : {
                        "type" : "tournament.update",
                        "message" : {
                            "action": "setTournament",
                            "item": tour_item#{}
                            }
                        },
                },
                {
                    "target" : target,
                    "payload" : {
                        "type" : "profile.update",
                        "message" : {
                            "action": "setMatches",
                            "item": [
                                {"id" : 1,
                                 "item" :{
                                     "id" : 1,
                                     "contenders" : [1, 2],
                                     "winner" : 1
                                     }},
                                 {"id":2,
                                  "item":{
                                      "id" : 2,
                                      "contenders" : [3, 4],
                                      "winner" : 3
                                      }}
                            ]
                        }
                    }
                }])

    def tournament_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)

############################################################################

    def handle_tournaments(self, action, item):
        msg_batch = []
        payload = []
        target = None
        # game = item.get("game")
        # if game is None : return msg_batch
        # tournaments = Tournament.objects.all().filter(game=game)
        # for tournament in tournaments:
        #     payload.append({
        #         "id": tournament.id,
        #         "item" : TournamentSerializer(tournament).data()
        #     })
        payload = [
        {
        "item" : {
        "id" : 2,
        "game": "chess",
        "organizerId" : 1,
        "picture" : "corrida_colosseum.jpg",
        "title" : "Corrida colosseum",
        "winnerId" : 0,
        "reasonForNoWinner" : ""
        }},
        {
        "item" : {
        "id" : 3,
        "game": "chess",
        "organizerId" : 1,
        "picture" : "corrida_colosseum.jpg",
        "title" : "Corrida colosseum",
        "winnerId" : 0,
        "reasonForNoWinner" : ""
        }},
        {
        "item" : {
        "id" : 4,
        "game": "chess",
        "organizerId" : 1,
        "picture" : "corrida_colosseum.jpg",
        "title" : "Corrida colosseum",
        "winnerId" : 0,
        "reasonForNoWinner" : ""
        }},
        {
        "item" : {
        "id" : 5,
        "game": "chess",
        "organizerId" : 1,
        "picture" : "corrida_colosseum.jpg",
        "title" : "Corrida colosseum",
        "winnerId" : 0,
        "reasonForNoWinner" : ""
        }},
]
        msg_batch.append({
            "target" : target,
            "payload" : {
                "type" : "tournaments.update",
                "message" : {
                    "action": "setTournaments",
                    "item": payload 
                    }
                },
            })
        return msg_batch

    def tournaments_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)

############################################################################

    def handle_login(self, action, item):
        msg_batch = []
        return msg_batch

    def login_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)

############################################################################

    def handle_play(self, action, item):
        msg_batch = []
        if item["game"] is None: return msg_batch
        target = None
        instance = Accounts.objects.get(user=self.user)
        challengers = instance.challengers.all()
        payload = []
        for  challenger in challengers :
            payload.append({
                "id" : challenger.id,
                "item": ProfileSampleSerializer(challenger).data()
                })
        msg_batch.append({
            "target" : target,
            "payload" : {
                "type" : "play.update",
                "message" : {
                    "action": "setChallengers",
                    "item": payload
                    }
                },
            })
        game = item.get("game")
        if game is None : return msg_batch
        tournaments = instance.tournaments.all().filter(game=game)
        for tournament in tournaments:
            payload.append({
                "id": tournament.id,
                "item" : TournamentSerializer(tournament).data()
                })
        msg_batch.append({
            "target" : target,
            "payload" : {
                "type" : "play.update",
                "message" : {
                    "action": "setChallengers",
                    "item": payload
                    }
                },
            })
        return msg_batch

    def play_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)

############################################################################

    def handle_leaderboard(self, action, item):
        msg_batch = []
        payload = []
        self.chat_print("leaderboard")
        leaderboard = Accounts.objects.annotate(ratio=ExpressionWrapper((F('chess_stats__wins') + 1) / (F('chess_stats__loses') + 1), output_field=FloatField())).order_by("ratio")[:10]
        for entry in leaderboard:
            tmp = LeaderboardEntrySerializer(entry).data()
            payload.append({
                "id": tmp.get("id"),
                "item": tmp
                })
        msg_batch.append({
            "payload" : {
                "type" : "leaderboard.update",
                "message" : {
                    "action" : "setChampions",
                    "item" : payload
                    } 
                }
            })
        return msg_batch

    def leaderboard_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)
 
############################################################################

    def handle_profile(self, action, item):
        # if action is None: return
        # elif (action == "friendRequest"):
        # elif (action == "unfriend"):
        # elif (action == "challenge"):
        # else :
        msg_batch = []
        target = None
        if (item['id'] == None): return
        try: id = int(item['id'])
        except : return
        instance = Accounts.objects.get(id=id)
        payload = ProfileSerializer(instance).data()
        msg_batch.append({
            "target" : target,
            "payload" : {
                "type" : "profile.update",
                "message" : {
                    "action": "setProfile",
                    "item": payload
                    }
                },
            })
        friends = instance.friends.all()
        payload = []
        for friend in friends :
            payload.append(ProfileSampleSerializer(friend).data())
        msg_batch.append({
            "target" : target,
            "payload" : {
                "type" : "profile.update",
                "message" : {
                    "action": "setFriends",
                    "item": payload
                    }
                },
            })
        matches = Match.objects.all().filter(Q(winner=instance) | Q(loser=instance)).order_by("id")[:10]
        payload = []
        for match in matches :
            payload.append({
                "item": MatchSampleSerializer(match).data()
            })
        msg_batch.append({
            "target" : target,
            "payload" : {
                "type" : "profile.update",
                "message" : {
                    "action": "setMatches",
                    "item": payload
                }
            },
        })
        return msg_batch

    def profile_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)

############################################################################

    def broadcast_message(self, event):
        print("broadcast_test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)
        
#############################################################################
    def chat_print(self, msg):
     self.send_json({
                "action":"chat",
				"type" : "message",
                "target" : "chat_general",
				"id" : "0",
				"name" : "server",
                "text" : f"test : {msg}"
			})

