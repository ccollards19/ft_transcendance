from django.urls import include, path
from views import TournamentCreate

urlpatterns = [
    path('create/', TournamentCreate.as_view(), name="tournament-create")
] 
