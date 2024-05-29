from django.urls import path
from profiles.views import GetProfile, GetMyProfile, AddFriend, AcceptRequest, BlockUser, ModifyProfile, Unfriend, Unblock, Challenge, GetProfileChat, UpdateAvatar, Leaderboard, UpdateSettings, GetChatList, GetFriendlist

urlpatterns = [
    # path("profile/<int:id>/", view_Profile),
    path("<int:id>/<str:game>/", GetProfile.as_view()),
    path("<int:id>/", GetProfileChat.as_view()),
    path("addFriend/<int:id>/", AddFriend.as_view()),
    path("acceptRequest/<int:id>/", AcceptRequest.as_view()),
    path("block/<int:id>/", BlockUser.as_view()),
    path("unfriend/<int:id>/", Unfriend.as_view()),
    path("unblock/<int:id>/", Unblock.as_view()),
    path("challenge/<int:id>/<str:game>/", Challenge.as_view()),
    path("modify/", ModifyProfile.as_view()),
    path("updateAvatar/", UpdateAvatar.as_view()),
    path("updateSettings/", UpdateSettings.as_view()),
    path("myProfile/", GetMyProfile.as_view()),
    path("leaderboard/<str:game>/", Leaderboard.as_view()),
    path("chatList/<int:id>/", GetChatList.as_view()),
    path("friendlist/", GetFriendlist.as_view())
    # path("leaderboard/<str:game>/", GetLeaderboard.as_view())
    # path("init", init_view),
    # path("id", user_id)
    # path("match", match_view.as_view())
    # path("tournament", tournament_view.as_view())
] 
