from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.http import HttpResponseNotAllowed
from django.http import JsonResponse
from django.core import serializers
from api.models import Accounts
from api.serializers import ProfileSerializer, MyProfileSerializer

import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User


# def view_Challengedchess(request, id):
#     try:
#         json_data = json.loads(request.body)
#         username = json_data.get('name')
#         password = json_data.get('password')
#         user_instance = authenticate(request, username=username, password=password)
#         if user_instance is not None:
#             payload = user_instance.profile();
#             return JsonResponse(payload, status=200)
#     except Exception as e:
#             return JsonResponse({"details": f"{e} "}, status=404)
#     return {}
# def view_Challengedpong(request):
#     return {}
# def view_Challengerschess(request):
#     return {}
# def view_Challengerspong(request):
#     return {}
# def view_Chat(request):
#     return {}
# def view_Friends(request):
#     return {}
# def view_Init(request):
#     return {}
# def view_Ladder(request):
#     return {}
# def view_Ladderchess(request):
#     return {}
# def view_Ladderpong(request):
#     return {}
# def view_Message(request):
#     return {}
# def view_MyTournamentschess(request):
#     return {}
# def view_MyTournamentspong(request):
#     return {}
# def view_Play(request):
#     return {}
# def view_Playchess(request):
#     return {}
# def view_Playpong(request):
#     return {}
class UpdateAvatar(View):
    def post(self, request, id):
        try:
            data = request.FILES
            avatar = data.get('avatar')
            if avatar:
                instance = Accounts.objects.get(id=int(id))
                instance.avatar = avatar
                instance.save()
            return JsonResponse({'message' : 'success'}, status=200, safe=False)
        except Exception as e: return JsonResponse(f"{e}", status=500)

def view_Profile(request, id):
    try:
        account_instance = Accounts.objects.get(id=id)
        if account_instance is None:
            return JsonResponse({"details": f"{id}: Not a valid Id"}, status=404)
        account_ser = ProfileSerializer(account_instance)
        return JsonResponse(account_ser.data(), status=200)
    except Exception as e:
        return JsonResponse({"details": f"{e}"}, status=500)

def view_my_Profile(request):
    if (not request.user.is_authenticated):
        return JsonResponse({"details": "not authenticated"}, status=401)
    try:
        account_instance = Accounts.objects.get(user=request.user)
        if account_instance is None:
            return JsonResponse({"details": "Profile not found"}, status=404)
        account_ser = ProfileSerializer(account_instance)
        return JsonResponse(account_ser.data(), status=200)
    except Exception as e:
        return JsonResponse({"details": f"{e}"}, status=500)

# def view_Profiles(request, id):
#     return {}
# def view_Tournament(request):
#     return {}
# def view_Tournaments(request):
#     return {}
# def view_Tournamentschess(request):
#     return {}
# def view_Tournamentspong(request):
#     return {}


# def get_ladder_view(request):
#     if request.method == "GET":
#         try:
#             json_data = json.loads(request.body)
#             username = json_data.get('name')
#             password = json_data.get('password')
#             user_instance = authenticate(request, username=username, password=password)
#             if user_instance is not None:
#                 payload = user_instance.profile();
#                 return JsonResponse(payload, status=200)
#         except Exception as e:
#             return JsonResponse({"details": f"{e} "}, status=404)
#     return JsonResponse({"details": f"Wrong {username}:{password}"}, status=404)

# def user_id(request):
#     if request.method == "GET":
#         try:
#             json_data = json.loads(request.body)
#             username = json_data.get('name')
#             jerk = user.objects.get(username=username)
#             id = jerk.id
#             return JsonResponse({"id":id}, status=200)
#         except Exception as e:
#             return JsonResponse({"details": f"{e}"}, status=404)
#     else:
#         return JsonResponse({"details":"Wrong"}, status=404)
