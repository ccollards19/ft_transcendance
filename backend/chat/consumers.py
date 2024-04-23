import json

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth import authenticate, login, logout
from api.models import Accounts, Pong_stats, Chess_stats
from channels.db import database_sync_to_async
from api.serializers import ProfileSerializer

async def profile_comp_msg(user):
    print(f"user = {user}")
    if (not user.is_authenticated):
        return ({
            "target" : "chat_general",
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
    targets = await database_sync_to_async(Accounts.objects.get)(user=user)
    return ((await database_sync_to_async(ProfileSerializer)(targets)).data)



async def make_batch(user, text_data, component):
    msg_queue = []
    if (component == "profile"):
        msg_queue.append(await profile_comp_msg(user))
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
    # target = text_data.get("target")
    # if target is None : return


    # await self.channel_layer.group_send( target, {
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


class ChatConsumer(AsyncJsonWebsocketConsumer):
    # group["broadcast"]

    async def connect(self):
        self.user = self.scope["user"]
        self.component = ""
        await self.accept()
        # add to broadcast list
        await self.channel_layer.group_add("chat_general", self.channel_name)
        print("CONNECTED TEST")
        if (self.user.is_authenticated):
            print("CONNECTED")
            await self.channel_layer.group_add(self.user.username, self.channel_name)
            await self.channel_layer.group_add("online", self.channel_name)
            await self.send_json({
                "action":"chat",
				"type" : "message",
                "target" : "chat_general",
				"id" : "0",
				"name" : "server",
				"text" : "logged in"
			})
        else :
            print("NOT CONNECTED")
            await self.send_json({
                "action":"chat",
				"type" : "message",
                "target" : "chat_general",
				"id" : "0",
				"name" : "server",
				"text" : "not logged in"
			})
        print("CONNECTED TEST")


    async def disconnect(self, close_code):
        print("DISCONNECT TEST")
        await self.channel_layer.group_discard("chat_general", self.channel_name)
        if (self.user.is_authenticated):
            await self.channel_layer.group_discard(self.user.username, self.channel_name)
            await self.channel_layer.group_discard("online", self.channel_name)
            # await propagate_status(self.scope[user])

    # Receive message from WebSocket
    async def receive_json(self, text_data):
        print("|||||||||||||||||||||||||||||||||||||||||");
        print(text_data);
        component = text_data.get("component")
        if component is not None:
            self.component = component
        msg_batch = (await make_batch(self.scope["user"], text_data, component))
        for msg in msg_batch:
            print(msg)
            if msg is None : continue
            await self.channel_layer.group_send( msg["target"], msg["payload"])
        print("|||||||||||||||||||||||||||||||||||||||||");

 ##########################################################################

    async def chat_message(self, event):
        print("|||||||||||||||||||||||||||||||||||||||||");
        if self.user.username == event['message']['name']: return
        payload = event["message"]
        print(f"sending {payload}");
        await self.send_json(payload)
        print("|||||||||||||||||||||||||||||||||||||||||");

############################################################################
    
    async def component_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        await self.send_json(payload)

    async def home_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        await self.send_json(payload)

    async def about_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        await self.send_json(payload)

    async def login_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        await self.send_json(payload)

    async def play_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        await self.send_json(payload)

    async def tournaments_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        await self.send_json(payload)

    async def leaderboard_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        await self.send_json(payload)
    
    async def profile_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        await self.send_json(payload)

############################################################################

    async def broadcast_message(self, event):
        print("broadcast_test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        await self.send_json(payload)
        
        # await self.send_json({
        #     "action":"chat",
        #     "type" : "message",
        #     "target" : "lobby",
        #     "id" : "2",
        #     "name" : "test",
        #     "text" : f"broadcast_test : {event['message']}"
        # })
