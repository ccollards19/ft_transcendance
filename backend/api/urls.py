from django.urls import include, path
from api.views import view_Profile, view_my_Profile, UpdateAvatar

urlpatterns = [
    path("profile/<int:id>/", view_Profile),
    path("profile/<int:id>/updateAvatar", UpdateAvatar.as_view()),
    path("profile/", view_my_Profile)
    # path("init", init_view),
    # path("id", user_id)
    # path("match", match_view.as_view())
    # path("tournament", tournament_view.as_view())
] 
