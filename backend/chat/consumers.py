import json

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth import authenticate, login, logout
# from api.websocket_actions import websocket_actions


# async def make_msg(text_data):
#     message_queue = []
#     action = text_data.get("component")
#     if action is not None :
#         message_queue = websocket_actions(action, text_data)
#         return message_queue
#     target = text_data.get("target")
#     if target is None : return
#     message_queue.append({
#         "target" : target,
#         "payload" : {
#             "type" : "chat.message",
#             "message" : text_data
#             },
#         })
#     return message_queue


class ChatConsumer(AsyncJsonWebsocketConsumer):
    # group["broadcast"]

    async def connect(self):
        self.user = self.scope["user"]
        await self.accept()
        # add to broadcast list
        await self.channel_layer.group_add("broadcast", self.channel_name)
        print("CONNECTED TEST")
        if (self.user.is_authenticated):
            print("CONNECTED")
            await self.channel_layer.group_add(self.user.username, self.channel_name)
            await self.channel_layer.group_add("chat_general", self.channel_name)
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
        await self.channel_layer.group_discard("broadcast", self.channel_name)
        if (self.user.is_authenticated):
            await self.channel_layer.group_discard(self.user.username, self.channel_name)
            await self.channel_layer.group_discard("chat_general", self.channel_name)
            # await propagate_status(self.scope[user])

    # Receive message from WebSocket
    async def receive_json(self, text_data):
        # check type add to component group 
        # propagate
        print("|||||||||||||||||||||||||||||||||||||||||");
        print(text_data);
        component = text_data.get("component")
        if component is not None:
            message_queue = [{
                "type" : component+".update",
                "message": {
                    }
            },
                             {
                "type" : "component.update",
                "message": {
                    "action":"chat",
                    "type" : "message",
                    "target" : "chat_general",
                    "id" : "0",
                    "name" : "server",
                    "text" : "dummy component update"
                    }
            }]
            print(message_queue)
            for msg in message_queue:
                await self.channel_layer.group_send( "broadcast", msg )
            return
        target = text_data.get("target")
        if target is None : return
        print(target);
        await self.channel_layer.group_send( target, {
            "type" : "chat.message",
            "message" : text_data
        })
        print("|||||||||||||||||||||||||||||||||||||||||");

    async def chat_message(self, event):
        print("|||||||||||||||||||||||||||||||||||||||||");
        if self.user.username == event['message']['name']: return
        payload = {
                "action":"chat",
				"type" : event['message'].get("type"),
                "target" : event['message'].get("target"),
				"id" : "0",#event['message'].get("myId"),
				"name" : event['message'].get("name"),
                "text" : event['message'].get("text")
        }
        print(f"sending {payload}");
        #if need to change things for each user
        # payload['id'] = self.scope['user'].id
        # payload['name'] = self.scope['user'].username
        await self.send_json(payload)
        print("|||||||||||||||||||||||||||||||||||||||||");
    
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

    async def tournament_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        await self.send_json(payload)

    async def leaderboard_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        payload = event["message"]
        await self.send_json(payload)
    
    async def profile_update(self, event):
        print("comp test|||||||||||||||||||||||||||||||||||||||||");
        # account_instance = Accounts.objects.get(id=id)
        # if account_instance is None:
        #     return JsonResponse({"details": f"{id}: Not a valid Id"}, status=500)
        # account_ser = ProfileSerializer(account_instance)
        # return JsonResponse(account_ser.data(), status=200)

        payload = {
            "action" : "profile",
		    "item" : {
			    
		    }
        }
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
        await self.send_json(payload)



    async def broadcast_message(self, event):
        print("broadcast_test|||||||||||||||||||||||||||||||||||||||||");
        
        # await self.send_json({
        #     "action":"chat",
        #     "type" : "message",
        #     "target" : "lobby",
        #     "id" : "2",
        #     "name" : "test",
        #     "text" : f"broadcast_test : {event['message']}"
        # })
