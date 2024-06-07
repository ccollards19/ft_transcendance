from django.urls import path

from . import consumers

api_urlpatterns = [
    path("ws/", consumers.GlobalConsumer.as_asgi()),
]
