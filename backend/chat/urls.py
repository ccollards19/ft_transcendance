from django.urls import path

from . import views


urlpatterns = [
        path("", views.index, name="index"),
        path('stream/', views.sse_stream),
        path("<str:room_name>/", views.room, name="room"),
]
