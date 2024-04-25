import json
import threading
from typing import get_args
from channels.generic.websocket import JsonWebsocketConsumer
from django.contrib.auth import authenticate, login, logout
from api.models import Accounts, Pong_stats, Chess_stats
from channels.db import database_sync_to_async
from api.serializers import ProfileSerializer
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
        self.send_json({
                "action":"chat",
				"type" : "message",
                "target" : "chat_general",
				"id" : "0",
				"name" : "server",
                "text" : f"test {text_data.get('target')}"
			})

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
            msg_batch = self.handle_login(action, item)
        elif (component == "home"):
            msg_batch = self.handle_home(action, item)
        elif (component == "profile"):
            msg_batch = self.handle_profile(action, item)
        elif (component == "tournament"):
            msg_batch = self.handle_tournament(action, item)
        elif (component == "tournaments"):
            msg_batch = self.handle_tournaments(action, item)
        elif (component == "play"):
            msg_batch = self.handle_play(action, item)
        elif (component == "match"):
            msg_batch = self.handle_match(action, item)
        elif (component == "leaderboard"):
            msg_batch = self.handle_leaderboard(action, item)
        else: return
        for msg in msg_batch:
            if msg is None : continue
            elif msg["target"] is None :
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
        if target is None : return []
        self.send_json({
                "action":"chat",
				"type" : "message",
                "target" : "chat_general",
				"id" : "0",
				"name" : "server",
                "text" : "test"
			})
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
        return msg_batch

    def tournament_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)

############################################################################

    def handle_tournaments(self, action, item):
        msg_batch = []
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
        return msg_batch

    def play_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)

############################################################################

    def handle_leaderboard(self, action, item):
        msg_batch = []
        return msg_batch

    def leaderboard_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)
 
############################################################################

    def handle_profile(self, action, item):
        msg_batch = []
        target = None
        targets = Accounts.objects.get(user=self.scope["user"])
        payload = ProfileSerializer(targets).data()
        msg_batch.append({
            "target" : target,
            "payload" : {
                "type" : "profile.update",
                "message" : {
                    "self, action": "Profile",
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
