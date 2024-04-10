from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.http import JsonResponse
from api.models import Accounts, Pong_stats, Chess_stats
from api.serializers import ProfileSerializer
import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

def create_account(username, password, email=""):
    new_user = User.objects.create_user(username=username, password=password, email=email)
    new_user.save();
    pst = Pong_stats.objects.create()
    pst.save()
    cst = Chess_stats.objects.create()
    cst.save()
    new_account = Accounts.objects.create(user=new_user, pong_stats=pst, chess_stats=cst)
    new_account.save()
    return new_account

     
    
# Create your views here.
@csrf_exempt
def sign_up_view(request):
    if not request.method == "POST":
        return JsonResponse({"details":"Wrong HTTP Method"}, status=500)
    try:
        json_data = json.loads(request.body)
        username = json_data.get('name')
        password = json_data.get('password')
        email =  json_data.get('address')
        new_account = create_account(username=username, password=password, email=email)
        return JsonResponse(ProfileSerializer(new_account).data(), status=200)
    except Exception as e:
        return JsonResponse({"details": f"{e}"}, status=500)


@csrf_exempt
def resign_view(request):
    if not request.method == "DELETE":
        return JsonResponse({"details":"Wrong HTTP Method"}, status=500)
    try :
        if not request.user.is_authenticated():
            return JsonResponse({"details": "Not logged in"}, status=404)
        account_instance = Accounts.objects.get(user=request.user)
        account_instance.delete()
        return JsonResponse({"details":"Account successfully deleted"}, status=200)
    except Exception as e:
        return JsonResponse({"details": f"{e}"}, status=500)


@csrf_exempt
def sign_in_view(request):
    if not request.method == "POST":
        return JsonResponse({"details":"Wrong HTTP method"}, status=500)
    try:
        if request.user.is_authenticated:
            return JsonResponse({"details":"Already signed in"}, status=200)
        json_data = json.loads(request.body)
        username = json_data.get('name')
        password = json_data.get('password')
        user_instance = authenticate(request, username=username, password=password)
        if user_instance == None:
            return JsonResponse({"details":"Could not authenticate user"}, status=404)
        login(request, user_instance, backend=None)
        account_instance = Accounts.objects.get(user=user_instance)
        return JsonResponse(ProfileSerializer(account_instance).data(), status=200)
    except Exception as e:
        return JsonResponse({"details": f"{e}"}, status=500)

# def update_view(request):

@csrf_exempt
def sign_out_view(request):
    if not request.method == "POST":
        return JsonResponse({"details":"Wrong HTTP method"}, status=404)
    try:
        if not request.user.is_authenticated:
            return JsonResponse({"details":"Not Logged in"}, status=404)
        logout(request)
        return JsonResponse({"details":"Successfuly logged out"}, status=200)
    except Exception as e:
        return JsonResponse({"details": f"{e}"}, status=500) 
