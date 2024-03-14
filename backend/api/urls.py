from django.urls import include, path
from rest_framework.routers import DefaultRouter
from api.views import user_viewset, match_viewset, tournament_viewset, initial_json


router = DefaultRouter()
router.register(r'user', user_viewset)
router.register(r'match', match_viewset)
router.register(r'tournament', tournament_viewset)
urlpatterns = [
    path("init", initial_json),
        ] 
urlpatterns += router.urls
