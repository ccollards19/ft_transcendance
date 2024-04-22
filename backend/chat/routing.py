from django.urls import path

from . import consumers

chat_urlpatterns = [
    path("ws/", consumers.ChatConsumer.as_asgi()),
]
