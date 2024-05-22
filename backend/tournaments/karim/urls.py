from django.urls import path
from . import views

urlpatterns = [
    path('start/<int:tournament_id>/', views.start_tournament, name='start_tournament'),
    path('<int:tournament_id>/', views.tournament_matches, name='tournament_matches'),
    path('<int:tournament_id>/match/<int:match_id>/update/', views.update_match_result, name='update_match_result'),


    path('createTournament/', views.create_tournament, name='create_tournament'),

]
