from django.urls import path

from game.consumers import PongConsumer, RoomConsumer, TictactoeConsumer

game_urlpatterns = [
        path("ws/pong/<int:room>/", PongConsumer.as_asgi()),
        path("ws/tictactoe/<int:room>/", TictactoeConsumer.as_asgi()),
        path("ws/room/<int:room>/", RoomConsumer.as_asgi())
]
