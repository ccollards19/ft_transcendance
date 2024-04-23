import json
import threading
from typing import get_args
from channels.generic.websocket import JsonWebsocketConsumer
from django.contrib.auth import authenticate, login, logout
from api.models import Accounts, Pong_stats, Chess_stats
from channels.db import database_sync_to_async
from api.serializers import ProfileSerializer
from asgiref.sync import async_to_sync




def profile_comp_msg(user):
    print(f"user = {user}")
    target = None
    if (not user.is_authenticated):

        return ({
            "target" : target,
            "payload" : {
                "type" : "chat.message",
                "message" : {
                    "action":"chat",
                    "type" : "message",
                    "target" : "chat_general",
                    "id" : "0",
                    "name" : "server",
                    "text" : "profile error"
                    }
                },
            })
    targets = Accounts.objects.get(user=user)
    payload = ProfileSerializer(targets).data()
    return ({
        "target" : target,
        "payload" : {
            "type" : "chat.message",
            "message" : payload
            },
        })



def make_batch(user, text_data, component):
    msg_queue = []
    if (component == "profile"):
        msg_queue.append(profile_comp_msg(user))
        return msg_queue;
    # action = text_data.get("action")
    # if (action == "chat"):
    target = text_data.get("target")
    if target is None : return []
    msg_queue.append({
        "target" : target,
        "payload" : {
            "type" : "chat.message",
            "message" : {
                "action":"chat",
                "type" : text_data.get("type"),
                "target" : text_data.get("target"),
                "id" : "0",#event['message'].get("myId"),
                "name" : text_data.get("name"),
                "text" : text_data.get("text")
                }
            },
        })
    return msg_queue
    # self.channel_layer.group_send( target, {
    #     "type" : "chat.message",
    #     "message" : text_data
    # })

        # account_instance = Accounts.objects.get(id=id)
        # if account_instance is None:
        #     return JsonResponse({"details": f"{id}: Not a valid Id"}, status=500)
        # account_ser = ProfileSerializer(account_instance)
        # return JsonResponse(account_ser.data(), status=200)

      #   payload = {
      #       "action" : "profile",
		    # "item" : {
			   #  
		    # }
      #   }
    #   payload = {
	# 	"action" : "profile",
	# 	"item" : {
	# 		...profile que je consulte en entier
	# 	}
	# 	//
	# 	"action" : "addFriend" / "updateFriend",
	# 	"item" : {
	# 		"avatar",
	# 		"name",
	# 		"id",
	# 		"status"
	# 	}
	# 	//
	# 	"action" : "removeFriend",
	# 	"id" :  "id"
	# }


class ChatConsumer(JsonWebsocketConsumer):
    # group["broadcast"]

    def connect(self):
        self.user = self.scope["user"]
        self.component = ""
        self.accept()
        # add to broadcast list
        async_to_sync(self.channel_layer.group_add)("chat_general", self.channel_name)

        print("CONNECTED")


    def disconnect(self, close_code):
        print("DISCONNECT TEST")
        self.channel_layer.group_discard("chat_general", self.channel_name)
        if (self.user.is_authenticated):
            self.channel_layer.group_discard(self.user.username, self.channel_name)
            self.channel_layer.group_discard("online", self.channel_name)
            # propagate_status(self.scope[user])

    # Receive message from WebSocket
    def receive_json(self, text_data):
        print("recv|||||||||||||||||||||||||||||||||||||||||");
        print(text_data);
        component = text_data.get("status")
        if component is not None:
            self.register_user()
            return
        component = text_data.get("component")
        if component is not None:
            self.component = component
        msg_batch = make_batch(self.scope["user"], text_data, component)
        for msg in msg_batch:
            print(msg)
            if msg is None : continue
            elif msg["target"] is None :
                self.send_json(msg["payload"]["message"])
            else :
                async_to_sync(self.channel_layer.group_send)( msg["target"], msg["payload"])
        print("sent|||||||||||||||||||||||||||||||||||||||||");

#########################################################################
    def register_user(self):
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
				"text" : "not logged in"
			})

 ##########################################################################

    def chat_message(self, event):
        print("|||||||||||||||||||||||||||||||||||||||||");
        if self.user.username == event['message']['name']: return
        payload = event["message"]
        print(f"sending {payload}");
        self.send_json(payload)
        print("|||||||||||||||||||||||||||||||||||||||||");

############################################################################
    
    def component_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)

    def home_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)

    def about_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)

    def login_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)

    def play_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)

    def tournaments_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)

    def leaderboard_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)
    
    def profile_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)

############################################################################

    def broadcast_message(self, event):
        print("broadcast_test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        self.send_json(payload)
        
        # self.send_json({
        #     "action":"chat",
        #     "type" : "message",
        #     "target" : "lobby",
        #     "id" : "2",
        #     "name" : "test",
        #     "text" : f"broadcast_test : {event['message']}"
        # })
#############################################################################
    # def run_in_threadpool(self, func, *args, **kwargs):
    #     # Define a function to run the given function in a synchronous thread pool
    #     # Adapted from: https://channels.readthedocs.io/en/stable/topics/consumers.html#running-code-in-threads
    #     return self.channel_layer.threadpool.submit(func, *args, **kwargs).result()

