# urls.py
from django.urls import path
from game.views import RoomDetail, RoomCreate, GetMyRoom, UpdateRoom, DisPlay

urlpatterns = [
    path('room/create/', RoomCreate.as_view()),
    path('myRoom/', GetMyRoom.as_view()),
    path('room/<int:id>/', RoomDetail.as_view()),
    path("play/<str:game>/", DisPlay.as_view()),
    path("updateRoom/<int:id>/", UpdateRoom.as_view())
]