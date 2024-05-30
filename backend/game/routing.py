from django.urls import path

from game.consumers import PongConsumer, ChessConsumer, RoomConsumer

game_urlpatterns = [
        path("ws/pong/<int:room>/", PongConsumer.as_asgi()),
        path("ws/chess/<int:room>/", ChessConsumer.as_asgi()),
        path("ws/room/<int:room>/", RoomConsumer.as_asgi())
]
