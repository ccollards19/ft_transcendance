from django.urls import path
from profiles.views import GetProfile, GetMyProfile, AddFriend, AcceptRequest, BlockUser, ModifyProfile, Unfriend, Unblock, Challenge, GetProfileChat, UpdateAvatar, Leaderboard, UpdateSettings, GetChatList, GetFriendlist

urlpatterns = [
    path("<int:id>/<str:game>/", GetProfile.as_view()),
    path("<int:id>/", GetProfileChat.as_view()),
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
] 
