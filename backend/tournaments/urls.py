from django.urls import path
from tournaments.views import TournamentCreate

urlpatterns = [
    path('create/', TournamentCreate.as_view(), name="tournament-create")
] 
