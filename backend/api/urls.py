from django.urls import include, path
from api.views import view_Profile

urlpatterns = [
    path("user/<int:id>/", view_Profile)
    # path("profiles/<int:id>/", view_Profiles)
    # path("init", init_view),
    # path("id", user_id)
    # path("match", match_view.as_view())
    # path("tournament", tournament_view.as_view())
] 
