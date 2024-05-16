from django.urls import path

from . import consumers

game_urlpatterns = [
        path("ws/pong/<str:room>/", consumers.PongConsumer.as_asgi()),
        path("ws/chess/<str:room>/", consumers.ChessConsumer.as_asgi()),
]
