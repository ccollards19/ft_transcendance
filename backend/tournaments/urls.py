from django.urls import path
from tournaments.views import TournamentCreate, SetTournamentImages, GetTournament, GetAllTournaments, Subscribe, UpdateDescription

urlpatterns = [
    path('create/', TournamentCreate.as_view(), name="tournament-create"),
    path('<int:id>/setImages/', SetTournamentImages.as_view(), name='tournament-update-images'),
    path("<int:id>/", GetTournament.as_view()),
    path("all/<str:game>/", GetAllTournaments.as_view()),
    path("subscribe/<int:id>/", Subscribe.as_view()),
    path("<int:id>/updateDescription/", UpdateDescription.as_view())
] 
