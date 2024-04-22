import json

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.contrib.auth import authenticate, login, logout
# from ..api.websocket_actions import websocket_actions


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
        # message_queue = make_msg(text_data) 
        # for msg in message_queue:
        #     await self.channel_layer.group_send( msg["target"], msg["payload"] )
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
