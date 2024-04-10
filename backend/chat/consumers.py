import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class UserConsumer(WebsocketConsumer):
    account_instance = Accounts.objects.get(id=id)


    def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, self.channel_name
        )
        self.accept()
        print("CONNECTED")

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name, self.channel_name
        )
        print("DISCONNECTED")

    # Receive message from room group
    def profile_update(self, event):
        message = event

        # Send message to WebSocket
        self.send(text_data=json.dumps({"message": message}))
        print(f"send {message}")
