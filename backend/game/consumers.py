import json
from channels.generic.websocket import WebsocketConsumer, JsonWebsocketConsumer
from channels.consumer import SyncConsumer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import  F, Q, FloatField, ExpressionWrapper
from tournaments.models import Tournament
from profiles.models import Profile, Pong_stats, Chess_stats
from api.serializers import ProfileSerializer, MyProfileSerializer, LeaderboardEntrySerializer, ProfileSampleSerializer, TournamentSerializer, MatchSampleSerializer
from asgiref.sync import async_to_sync
from game.models import Room, Match
from profiles.models import Profile
from django.http import JsonResponse
import logging
import json


logger = logging.getLogger(__name__)

class ChessConsumer(JsonWebsocketConsumer):
######################connection###################################################
    
    def connect(self):
        self.accept()
        self.room = self.scope["url_route"]["kwargs"]["room"]

    def disconnect(self, close_code):
        self.send("leave "+ self.room)

    def receive(self, text_data):
        self.send("receive message in"+ self.room)

    def chess_message(self, event):
        pass

class PongConsumer(JsonWebsocketConsumer):
######################connection###################################################

    rooms = {}
    
    def connect(self):
        try:
            self.user = self.scope["user"]
            roomId = self.scope["url_route"]["kwargs"]["room"]
            self.room = Room.objects.get(id=roomId)
            if self.room == None:
                self.send_json({"details" : "that room does not exist"})
                self.close()
                return
            if self.room.cancelled:
                self.send_json({"details" : "cancelled"})
                self.close()
                return
            if not self.room.spectate and self.room.player1.user != self.user and self.room.player2.user != self.user:
                self.send_json({"details" : "no spectators"})
                self.close()
                return
            self.accept()
            if self.room.player1.user == self.user:
                self.player = 1
            elif self.room.player2.user == self.user:
                self.player = 2
            else:
                self.player = 0
            if not self.room.match:
                newMatch = Match(player1=self.room.player1, player2=self.room.player2)
                newMatch.save()
                self.room.match = newMatch
                self.room.save()
                self.room.player1.pong_stats.challengers.remove(self.room.player2)
                self.room.player1.pong_stats.challenged.remove(self.room.player2)
                self.room.player2.pong_stats.challengers.remove(self.room.player1)
                self.room.player2.pong_stats.challenged.remove(self.room.player1)
                self.room.player1.pong_stats.save()
                self.room.player2.pong_stats.save()
            self.room_group_name = "room_" + str(roomId)
            if not self.room_group_name in PongConsumer.rooms:
                PongConsumer.rooms[self.room_group_name] = {
                    "score_1" : 0,
                    "score_2" : 0,
                    "player1Y" : 50,
                    "player2Y" : 50,
                    "vote1" : None,
                    "vote2" : None
                }
            else:
                self.send_json({
                    "action" : 'init',
                    "item" : PongConsumer.rooms[self.room_group_name]
                })
            async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
        except Exception as e : self.send(e)
        

    def disconnect(self, close_code):
        self.room.refresh_from_db()
        if not self.room.over and self.room_group_name in PongConsumer.rooms:
            PongConsumer.rooms[self.room_group_name]['pause' + str(self.player)] = True
            async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
                "type" : "ws.send",
                "message" : {"action" : "quit", "player" : self.player}
            })
        async_to_sync(self.channel_layer.group_discard)(self.room_group_name, self.channel_name)
    
    def ws_send(self, event):
        payload = event["message"]
        self.send_json(payload)

    def receive_json(self, content):
        self.room.refresh_from_db()
        if bool(self.room.cancelled):
            self.room.player1.room = None
            self.room.player2.room = None
            self.room.player1.playing = False
            self.room.player2.playing = False
            self.room.player1.save()
            self.room.player2.save()
            async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
                "type" : "ws.send",
                "message" : {"action" : "cancelled"}
            })
        action = content.get("action")
        if action == 'start':
            self.handle_start()
        elif action == 'quit':
            self.handle_quit()
        elif action == 'resume':
            self.handle_resume()
        elif action == 'up':
            y = content.get("myY")
            self.handle_up(int(y))
        elif action == 'down':
            y = content.get("myY")
            self.handle_down(int(y))
        elif action == 'yes':
            self.handle_yes()
        elif action == 'no':
            self.handle_no()
        elif action == 'score':
            self.handle_score()
        elif action == 'pause':
            self.handle_pause()
        elif action == 'resume' and self.player > 0:
            self.handl_resume()
    
    def handle_start(self):
        PongConsumer.rooms[self.room_group_name]['start'] = True
        async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
            "type" : "ws.send",
            "message" : {"action" : "start"}
        })
    
    def handle_quit(self):
        if self.player == 1:
            self.handle_win(2)
        elif self.player == 2:
            self.handle_win(1)
        self.room.player1.room = None
        self.room.player2.room = None
        self.room.player1.playing = False
        self.room.player2.playing = False
        self.room.player1.save()
        self.room.player2.save()
        del PongConsumer.rooms[self.room_group_name]
        async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
            "type" : "ws.send",
            "message" : {
                "action" : "quit",
                "quitter" : self.player
            }
        })

    def handle_resume(self):
        PongConsumer.rooms[self.room_group_name]['pause' + str(self.player)] = False
        async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
            "type" : "ws.send",
            "message" : {"action" : "resume", "player" : self.player}
        })
    
    def handle_up(self, y):
        PongConsumer.rooms[self.room_group_name]['player' + str(self.player) + 'Y'] = y
        PongConsumer.rooms[self.room_group_name]['player' + str(self.player) + 'Y'] -= 25
        if self.player > 0:
            async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
                "type" : "ws.send",
                "message" : {
                    "action" : "update",
                    "user1Y" : PongConsumer.rooms[self.room_group_name]['player1Y'],
                    "user2Y" : PongConsumer.rooms[self.room_group_name]['player2Y']
                }
            })

    def handle_down(self, y):
        PongConsumer.rooms[self.room_group_name]['player' + str(self.player) + 'Y'] = y
        PongConsumer.rooms[self.room_group_name]['player' + str(self.player) + 'Y'] += 25
        if self.player > 0:
            async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
                "type" : "ws.send",
                "message" : {
                    "action" : "update",
                    "user1Y" : PongConsumer.rooms[self.room_group_name]['player1Y'],
                    "user2Y" : PongConsumer.rooms[self.room_group_name]['player2Y']
                }
            })
    
    def handle_score(self):
        if self.player == 1:
            PongConsumer.rooms[self.room_group_name]['score_1'] += 1
        elif self.player == 2:
            PongConsumer.rooms[self.room_group_name]['score_2'] += 1
        if PongConsumer.rooms[self.room_group_name]['score_1'] == 100:
            self.handle_win(1)
            if bool(self.room.roomTournament):
                self.handle_no()
        elif PongConsumer.rooms[self.room_group_name]['score_2'] == 100:
            self.handle_win(2)
            if bool(self.room.roomTournament):
                self.handle_no()
        async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
            "type" : "ws.send",
            "message" : {
                "action" : "resetBall",
                "player1Y" : PongConsumer.rooms[self.room_group_name]['player1Y'],
                "player2Y" : PongConsumer.rooms[self.room_group_name]['player2Y']
            }
        })

    def handle_win(self, player):
        if player == 1:
            winnerStats = self.room.player1.pong_stats
            loserStats = self.room.player2.pong_stats
            self.room.match.winner = self.room.player1.id
        elif player == 2:
            winnerStats = self.room.player2.pong_stats
            loserStats = self.room.player1.pong_stats
            self.room.match.winner = self.room.player2.id
        if abs(winnerStats.score - loserStats.score) > 50:
            update = 3
        elif abs(winnerStats.score - loserStats.score) > 10:
            update = 2
        else:
            update = 1
        winnerStats.score += update
        loserStats.score += update
        winnerStats.matches += 1
        loserStats.matches += 1
        winnerStats.wins += 1
        loserStats.losses += 1
        winnerStats.history.add(self.room.match)
        loserStats.history.add(self.room.match)
        winnerStats.save()
        loserStats.save()
        self.room.match.save()
        async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
                "type" : "ws.send",
                "message" : {"action" : "win", "winner" : player}
            })

    def handle_yes(self):
        if self.player == 1:
            PongConsumer.rooms[self.room_group_name]['vote1'] = True
        elif self.player == 2:
            PongConsumer.rooms[self.room_group_name]['vote2'] = True
        if self.player > 0:
            async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
                "type" : "ws.send",
                "message" : {
                    "action" : "voted",
                    "player" : self.player
                }
            })
        if PongConsumer.rooms[self.room_group_name]['vote1'] == True and PongConsumer.rooms[self.room_group_name]['vote2'] == True:
            PongConsumer.rooms[self.room_group_name] = {
                "score_1" : 0,
                "score_2" : 0,
                "player1Y" : 50,
                "player2Y" : 50,
                "vote1" : None,
                "vote2" : None
            }
            newMatch = Match(player1=self.room.player1, player2=self.room.player2)
            newMatch.save()
            self.room.match = newMatch
            self.room.save()
            async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
                "type" : "ws.send",
                "message" : {"action" : "restart"}
            })
             
    def handle_no(self):
        del PongConsumer.rooms[self.room_group_name]
        self.room.over = True
        async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
            "type" : "ws.send",
            "message" : {"action" : "noRestart"}
        })

    def handle_pause(self):
        async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
            "type" : "ws.send",
            "message" : {"action" : "pause", "player" : self.player}
        })
    
    def handle_resume(self):
        async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
            "type" : "ws.send",
            "message" : {"action" : "resume", "player" : self.player}
        })



class RoomConsumer(JsonWebsocketConsumer):
######################connexion###################################################

    def connect(self):
        if self.scope["user"].is_authenticated:
            self.user = self.scope["user"]
            roomId = self.scope["url_route"]["kwargs"]["room"]
            self.room = Room.objects.get(id=roomId)
            if self.room == None:
                self.send_json({"details" : "that room does not exist"})
                self.close()
            if self.room.player1.user != self.user and self.room.player2.user != self.user:
                self.send_json({"details" : "not your match"})
                self.close()
            self.profile = Profile.objects.get(user=self.user)
            self.profile.matchChannelName = self.channel_name
            self.profile.save()
            self.room_group_name = "room_" + str(roomId)
            async_to_sync(self.channel_layer.group_add)(self.room_group_name, self.channel_name)
            self.accept()
            if self.room.player1.user == self.user:
                self.send_json({"action" : "updateReadyStatus", "status" : self.room.player2Ready})
            else:
                self.send_json({"action" : "updateReadyStatus", "status" : self.room.player1Ready})

    def disconnect(self, close_code):
        self.profile.matchChannelName = None
        async_to_sync(self.channel_layer.group_discard)(self.room_group_name, self.channel_name)


    def ws_send(self, event):
        payload = event["message"]
        self.send_json(payload)

    def receive_json(self, content):
        try:
            if not self.user.is_authenticated:
                raise Exception
            self.room.refresh_from_db()
            action = content["action"]
            if action == 'cancel':
                self.room.player1.room = None
                self.room.player2.room = None
                self.room.player1.save()
                self.room.player2.save()
                if self.room.player1.user == self.user:
                    target = self.room.player2.matchChannelName
                else:
                    target = self.room.player1.matchChannelName
                if target:
                    async_to_sync(self.channel_layer.send)(target, {
                        "type" : 'ws.send',
                        "message" : {
                            "action" : "cancelled",
                            "name" : self.user.username
                        }
                    })
            elif action == 'setReady':
                status = content["status"]
                target = None
                if self.room.player1.user == self.user:
                    self.room.player1Ready = status
                    target = self.room.player2.matchChannelName
                else:
                    self.room.player2Ready = status
                    target = self.room.player1.matchChannelName
                self.room.save()
                if self.room.player1Ready and self.room.player2Ready:
                    self.room.player1.playing = True
                    self.room.player2.playing = True
                    self.room.player1.save()
                    self.room.player2.save()
                    async_to_sync(self.channel_layer.group_send)(self.room_group_name, {
                        "type" : 'ws.send',
                        "message" : {"action" : "startMatch"}
                    })
                elif target:
                    async_to_sync(self.channel_layer.send)(target, {
                        "type" : 'ws.send',
                        "message" : {
                            "action" : "updateReadyStatus",
                            "status" : status
                        }
                    })
        except: self.close()
