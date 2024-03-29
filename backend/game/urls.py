# urls.py
from django.urls import path
from .views import RoomDetail, RoomCreate, AddPlayer
from .views import PostChessMove, ChessMoves, Promote
urlpatterns = [
    path('room/create/', RoomCreate.as_view(), name='room-create'),
    path('room/<str:room_id>/', RoomDetail.as_view(), name='room-detail'),
    path('room/<str:room_id>/add-player/<str:player_id>/', AddPlayer.as_view(), name='add-player'),
    path('chess/<str:room_id>/post/', PostChessMove.as_view(), name='post-chess-move'),
    path('chess/<str:room_id>/moves/', ChessMoves.as_view(), name='chess-moves'),
    path('chess/<str:room_id>/promote/<str:grade>/', Promote.as_view(), name='promote')
]