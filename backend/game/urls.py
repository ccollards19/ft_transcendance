# urls.py
from django.urls import path
from game.views import RoomDetail, RoomCreate, AddPlayer, RoomDelete, RoomReset, RoomNumber
from game.views import PostChessMove, ChessMoves, Promote, DisPlay, GetGame, DismissChallenge, UpdateRoom, CancelGame

urlpatterns = [
    path('room/create/', RoomCreate.as_view(), name='room-create'),
    path('room/<int:id>/', RoomDetail.as_view(), name='room-detail'),
    path('room/<str:room_id>/delete/', RoomDelete.as_view(), name='room-delete'),
    path('room/<str:room_id>/reset/', RoomReset.as_view(), name='room-reset'),
    path('room/number/', RoomNumber.as_view(), name='room-number'),
    path('room/<str:room_id>/add-player/<str:player_id>/', AddPlayer.as_view(), name='add-player'),
    path('chess/<str:room_id>/post/', PostChessMove.as_view(), name='post-chess-move'),
    path('chess/<str:room_id>/moves/', ChessMoves.as_view(), name='chess-moves'),
    path('chess/<str:room_id>/promote/<str:grade>/', Promote.as_view(), name='promote'),
    path("play/<str:game>/", DisPlay.as_view()), 
    path("getGame/", GetGame.as_view()),
    path("dismiss/<int:id>/<str:game>/<str:tab>/", DismissChallenge.as_view()),
    path("updateRoom/<int:id>/", UpdateRoom.as_view()),
    path("cancel/<int:id>/<int:otherPlayerId>/", CancelGame.as_view())
]