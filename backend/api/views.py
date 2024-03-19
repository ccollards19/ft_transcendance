from rest_framework import permissions, viewsets
from api.models import user, match, tournament
from api.serializers import user_serializer, match_serializer, tournament_serializer, profile_serializer
from django.http import JsonResponse

# def get_ladder_chess(reauest):
#     if (request.method != "GET"):
#         return (JsonResponse( {"details":"wrong method"}, status=404))
#     else:
#         ladder = user.models.#TODO
#         return (JsonResponse(user_serializer(ladder))

# def get_ladder_pong(reauest):
#     if (request.method != "GET"):
#         return (JsonResponse( {"details":"wrong method"}, status=404))
#     else:
#         ladder = user.models.#TODO
#         return (JsonResponse(user_serializer(ladder))

def initial_json(request):
    if (request.method != "GET"):
        return (JsonResponse( {"details":"wrong method"}, status=404))
    else:
        # try:
        #     user = user_serializer(1)
        # except e:
        #     
        data = { 
                "profile" : {
                    "avatar" : "",
                    "id" : 0,
                    "name" :"",
                    "status" : "",
                    "playing" : False,
                    "match" : 0,
                    "game" : "",
                    "pong" : {
                        "rank" : "",
                        "matches" : 0,
                        "wins" : 0,
                        "loses" : 0,
                        "challengers" : [],
                        "challenged" : [],
                        "tournaments" : [],
                        "subscriptions" : []
                        },
                    "chess" : {
                        "rank" : "",
                        "matches" : 0,
                        "wins" : 0,
                        "loses" : 0,
                        "challengers" : [],
                        "challenged" : [],
                        "tournaments" : [],
                        "subscriptions" : []
                        },    
                    "queue" : 0,
                    "device" : "",
                    "scope" : "",
                    "gameType" : "",
                    "challengeable" : False,
                    "spectate" : False,
                    "friends" : [],
                    "catchphrase" : "",
                    "bio" : ""
	            },
                "friends" : [],
        }
        return JsonResponse(data)

class profile_viewset(viewsets.ModelViewSet):
    queryset = user.objects.all()
    serializer_class = profile_serializer

class user_viewset(viewsets.ModelViewSet):
    queryset = user.objects.all()
    serializer_class = user_serializer
    # permission_classes = [permissions.IsAuthenticated]

class match_viewset(viewsets.ModelViewSet):
    queryset = match.objects.all()
    serializer_class = match_serializer
    # permission_classes = [permissions.IsAuthenticAted]

class tournament_viewset(viewsets.ModelViewSet):
    queryset = tournament.objects.all()
    serializer_class = tournament_serializer
    # permission_classes = [permissions.IsAuthenticated]

