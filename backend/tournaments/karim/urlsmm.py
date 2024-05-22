from django.urls import path
from .views import join_queue, matchmake

urlpatterns = [
    path('join_queue/', join_queue, name='join_queue'),
    path('matchmake/', matchmake, name='matchmake'),
]
