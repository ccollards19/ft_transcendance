import json
from channels.generic.websocket import JsonWebsocketConsumer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import  F, Q, FloatField, ExpressionWrapper
from api.models import Tournament, Match, Accounts, Pong_stats, Chess_stats
from api.serializers import ProfileSerializer, MyProfileSerializer, LeaderboardEntrySerializer, ProfileSampleSerializer, TournamentSerializer, MatchSampleSerializer
from asgiref.sync import async_to_sync    

class GlobalConsumer(JsonWebsocketConsumer):
    chess_leaderboard = Accounts.objects.annotate(ratio=ExpressionWrapper((F('chess_stats__wins') + 1) / (F('chess_stats__loses') + 1), output_field=FloatField())).order_by("ratio")[:10]
    pong_leaderboard = Accounts.objects.annotate(ratio=ExpressionWrapper((F('pong_stats__wins') + 1) / (F('pong_stats__loses') + 1), output_field=FloatField())).order_by("ratio")[:10]

    def connect(self):
        self.user = self.scope["user"]
        self.component = ""
        self.accept()
        async_to_sync(self.channel_layer.group_add)("chat_general", self.channel_name)
        if self.user.is_authenticated :
            self.register_user()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)("chat_general", self.channel_name)
        if (self.user.is_authenticated):
            self.unregister_user()

    def register_user(self):
        self.user = self.scope["user"]
        self.account = Accounts.objects.get(user=self.scope["user"])
        if (self.user.is_authenticated):
            # self.friends = query
            async_to_sync(self.channel_layer.group_add)(self.user.username, self.channel_name)
            async_to_sync(self.channel_layer.group_add)("online", self.channel_name)
            #self.update_status
            # self.chat_print("logged in")
        # else :
            # self.chat_print("not logged in")

    def unregister_user(self):
        self.user = self.scope["user"]
        if (self.user.is_authenticated):
            async_to_sync(self.channel_layer.group_discard)(self.user.username, self.channel_name)
            async_to_sync(self.channel_layer.group_discard)("online", self.channel_name)
            # self.update_status

#########################################################################

    # receive a json from a websocket
    # parse the json
    # make a batch of messages depending on the component
    # send the batch of messages to the appropriate client connections
    def receive_json(self, text_data):
        # self.chat_print(self.user.id)
        component = text_data.get("component")
        action = text_data.get("action")
        item = text_data.get("item")
        msg_batch = []
        # self.chat_print(item)
        if component is None: return
        elif (component == "app" and self.user.is_authenticated):
            if (action == "addfriend"):
                self.friend_request(item)
            elif (action == "unfriend"):
                self.unfriend(item)
            elif (action == "block") :
                self.block(item)
            elif (action == "unblock") :
                self.unblock(item)
            elif (action == "challenge") :
                self.challenge(item)
            elif (action == "acceptRequest") :
                self.accept_request(item)
            elif (action == "dismissRequest") :
                self.dismiss_request(item)
        elif (component == "chat"):
            msg_batch = self.handle_chat(action, item)
        elif (component == "login"):
            self.component = component
            # msg_batch = self.handle_login(action, item)
        elif (component == "home"):
            self.component = component
            # msg_batch = self.handle_home(action, item)
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
        elif (component == "local"):
            self.component = component
        elif (component == "match"):
            self.component = component
            msg_batch = self.handle_match(action, item)
        elif (component == "leaderboard"):
            self.component = component
            msg_batch = self.handle_leaderboard(action, item)
        else: return
        if msg_batch is None : return
        for msg in msg_batch:
            if msg is None : continue
            elif msg.get("target") is None :
                self.send_json(msg["payload"]["message"])
            else :
                async_to_sync(self.channel_layer.group_send)( msg["target"], msg["payload"])

#########################################################################

    def add_friend(self, item):
        id = item.get("id")
        if id is None: return
        friend = Accounts.objects.get(id=id)
        self.account.friends.add(friend)
        friend.friends.add(self.user)
        friend.save()
        self.account.save()
        
    def unfriend(self, item):
        id = item.get("id")
        if id is None: return
        friend = Accounts.objects.get(id=id)
        self.account.friends.remove(friend)
        friend.friends.remove(self.user)
        friend.save()
        self.account.save()

    def block(self, item):
        id = item.get("id")
        if id is None: return
        blocked = Accounts.objects.get(id=id)
        self.account.blocked.add(blocked)
        self.account.save()
        
    def unblock(self, item):
        id = item.get("id")
        if id is None: return
        blocked = Accounts.objects.get(id=id)
        self.account.blocked.remove(blocked)
        self.account.save()

    def challenge(self, item):
        id = item.get("id")
        if id is None: return
        game = item.get("game")
        if game is None: return
        challenged = Accounts.objects.get(id=id)
        if challenged is None: return
        if (game == "chess"):
            self.account.chess_stats.challenged.add(challenged)
            challenged.chess_stats.challengers.add(self.account)
        elif (game == "pong"):
            self.account.pong_stats.challenged.add(challenged)
            challenged.pong_stats.challengers.add(self.account)
        self.account.save()
        challenged.save()
        
 ###############################chat###########################################

    def handle_chat(self, action, item):
        msg_batch = []
        if (action == "leave_chat"):
            self.leave_chat(item)
        if (action == "join_chat"):
            self.join_chat(item)
        elif (action == "whisp"):
            msg_batch = self.chat_whisp(item)
        elif (action == "message"):
            msg_batch = self.chat_message(item)
        return msg_batch

    def join_chat(self, item):
        target = item.get("chat")
        if target is None: return
        async_to_sync(self.channel_layer.group_add)(target, self.channel_name)

    def leave_chat(self, item):
        target = item.get("chat")
        self.chat_print(target)
        if target is None: return
        async_to_sync(self.channel_layer.group_discard)(target, self.channel_name)

    def chat_message(self, item):
        msg_batch = []
        target = item.get("target")
        if target is None : return msg_batch
        msg_batch.append({
            "target" : target,
            "payload" : {
                "type" : "chat.send",
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

    def chat_whisp(self, item):
        msg_batch = []
        target = item.get("target")
        self.chat_print(target)
        if target is None : return msg_batch
        msg_batch.append({
            "payload" : {
                "type" : "chat.send",
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
        user_instance = User.objects.get(username=target)
        instance = Accounts.objects.get(user=user_instance)
        if (not instance.blocked.all().contains(self.account)):
            msg_batch.append({
                "target" : target,
                "payload" : {
                    "type" : "chat.send",
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
        else :
            self.chat_print("you are blocked")
        return msg_batch

    def chat_send(self, event):
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
                        "action": "setMatches",
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
        if action is None:
            msg_batch = self.send_tournaments(item)
        elif (action == "join_chat"):
            self.join_chat(item)
        return msg_batch

        
    def send_tournaments(self, item):    
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
        target = None
        instance = Accounts.objects.get(user=self.scope["user"])#TODO protect here
        game = item.get("game")
        if (game == "chess"):
            challengers = instance.challengers.all()
            challenged = instance.challenged.all() 
        elif (game == "pong"):
            challengers = instance.challengers.all()
            challenged = instance.challenged.all()
        else:
            return msg_batch
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
        payload = []
        for  challenger in challenged :
            payload.append({
                "id" : challenger.id,
                "item": ProfileSampleSerializer(challenger).data()
                })
        msg_batch.append({
            "target" : target,
            "payload" : {
                "type" : "play.update",
                "message" : {
                    "action": "setChallenged",
                    "item": payload
                    }
                },
            })
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
                    "action": "setTournaments",
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
        game = item.get("game")
        if (game == "chess"): 
            leaderboard = Accounts.objects.annotate(ratio=ExpressionWrapper((F('chess_stats__wins') + 1) / (F('chess_stats__loses') + 1), output_field=FloatField())).order_by("ratio")[:10]
        elif (game == "pong") :
            leaderboard = Accounts.objects.annotate(ratio=ExpressionWrapper((F('pong_stats__wins') + 1) / (F('pong_stats__loses') + 1), output_field=FloatField())).order_by("ratio")[:10]
        else :
            return msg_batch
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

    def change_name(self, item):
        name = item
        if name is None: return
        self.account.name = name
        self.account.save()

    def change_bio(self, item):
        bio = item
        if bio is None: return
        self.account.bio = bio
        self.account.save()

    def change_cp(self, item):
        cp  = item
        if cp is None: return
        self.account.catchphrase = cp
        self.account.save()

    def handle_profile(self, action, item):
        msg_batch = []
        # self.chat_print(action)
        if action is None:
            msg_batch = self.send_profile(item)
        elif (action == "changeName"):
            self.change_name(item)
        elif (action == "changeCP"):
            self.change_cp(item)
        elif (action == "changeBio"):
            self.change_bio(item)
        return msg_batch

    def send_profile(self, item):
        msg_batch = []
        target = None
        if (item['id'] == None): return msg_batch
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
            tmp =ProfileSampleSerializer(friend).data()
            payload.append({
                "id": tmp.get("id"),
                "item":tmp
                })
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
        if (self.user.is_authenticated and self.account.id == instance.id):
            requests = instance.friend_requests.all()
            payload = []
            for request in requests :
                payload.append(ProfileSampleSerializer(request).data())
            msg_batch.append({
                "target" : target,
                "payload" : {
                    "type" : "profile.update",
                    "message" : {
                        "action": "setRequests",
                        "item": payload
                        }
                    },
                })
        return msg_batch

    def send_myProfile(self, item):
        msg_batch = []
        target = None
        if (item['id'] == None): return msg_batch
        try: id = int(item['id'])
        except : return msg_batch
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
        requests = instance.friend_requests.all()
        payload = []
        for request in requests :
            payload.append(ProfileSampleSerializer(request).data())
        msg_batch.append({
            "target" : target,
            "payload" : {
                "type" : "profile.update",
                "message" : {
                    "action": "setRequests",
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
				"type" : "admin",
                "target" : "chat_general",
				"id" : "0",
				"name" : "server",
                "text" : f"server : [{msg}]"
			})

