from django.urls import path
from tournaments.views import TournamentCreate, SetTournamentImages

urlpatterns = [
    path('create/', TournamentCreate.as_view(), name="tournament-create")
    # path('<str:id>/setImages/', SetTournamentImages.as_view(), name='tournament-update-images')
] 
