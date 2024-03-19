# urls.py
from django.urls import path
from .views import RoomDetail, RoomCreate, AddPlayer
from .views import handle_post_data
urlpatterns = [
    path('room/create/', RoomCreate.as_view(), name='room-create'),
    path('room/<str:room_id>/', RoomDetail.as_view(), name='room-detail'),
    path('room/<str:room_id>/add-player/', AddPlayer.as_view(), name='add-player'),
    path('post', handle_post_data, name='post-data'),
]