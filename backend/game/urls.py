# urls.py
from django.urls import path
from .views import RoomDetail, RoomCreate, AddPlayer
from .views import PostChessMove, ChessMoves
urlpatterns = [
    path('room/create/', RoomCreate.as_view(), name='room-create'),
    path('room/<str:room_id>/', RoomDetail.as_view(), name='room-detail'),
    path('room/<str:room_id>/add-player/<str:player_id>/', AddPlayer.as_view(), name='add-player'),
    path('post', PostChessMove, name='post-chess-move'),
    path('chess/moves/<str:room_id>/', ChessMoves.as_view(), name='chess-moves')
]