from django.urls import include, path
from api.views import init_view, user_id


urlpatterns = [
    path("init", init_view),
    path("id", user_id)
    # path("user",  user_view.as_view())
    # path("match", match_view.as_view())
    # path("tournament", tournament_view.as_view())
] 
