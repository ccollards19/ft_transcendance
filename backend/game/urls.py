# urls.py
from django.urls import path
from .views import RoomDetail, RoomCreate, AddPlayer, RoomDelete, RoomReset, RoomNumber
from .views import PostChessMove, ChessMoves, Promote
urlpatterns = [
    path('room/create/', RoomCreate.as_view(), name='room-create'),
    path('room/<str:room_id>/', RoomDetail.as_view(), name='room-detail'),
    path('room/<str:room_id>/delete/', RoomDelete.as_view(), name='room-delete'),
    path('room/<str:room_id>/reset/', RoomReset.as_view(), name='room-reset'),
    path('room/number/', RoomNumber.as_view(), name='room-number'),
    path('room/<str:room_id>/add-player/<str:player_id>/', AddPlayer.as_view(), name='add-player'),
    path('chess/<str:room_id>/post/', PostChessMove.as_view(), name='post-chess-move'),
    path('chess/<str:room_id>/moves/', ChessMoves.as_view(), name='chess-moves'),
    path('chess/<str:room_id>/promote/<str:grade>/', Promote.as_view(), name='promote'),
]