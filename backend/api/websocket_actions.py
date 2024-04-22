# import json

# from asgiref.sync import async_to_sync
# from channels.generic.websocket import AsyncJsonWebsocketConsumer
# from channels.db import database_sync_to_async

# async def websocket_actions(component, text_data):
#     return [{
#         "target":"chat_general",
#         "payload" :{
#             "action":"chat",
#             "type" : "message",
#             "target" : "chat_general",
#             "id" : "0",
#             "name" : "server",
#             "text" : "dummy component update"
#             }
#         }]
# async def set_home():
# async def propagate_home():
