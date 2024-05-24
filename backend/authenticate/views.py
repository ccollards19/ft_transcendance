from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from api.models import User, Accounts, Pong_stats, Chess_stats
from django.db import IntegrityError
from api.serializers import ProfileSerializer
import json
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
import logging
# from django.contrib.auth.models import User

logger = logging.getLogger(__name__)

def create_account(username, password, email):
    try:
        if username.startswith("match") or username.startswith("tournament"):
            raise IntegrityError
        new_user = User.objects.create_user(username=username, password=password, email=email)
        new_user.save()
        pst = Pong_stats()
        pst.save()
        cst = Chess_stats()
        cst.save()
        new_account = Accounts(user=new_user, pong_stats=pst, chess_stats=cst)
        new_account.save()
    except Exception as e : 
        logger.debug(e)
        return JsonResponse({"details" : f"{e}"}, status=500)

    return new_account
 
# Create your views here.
@csrf_exempt
def sign_up_view(request):
    if not request.method == "POST":
        return JsonResponse({"details":"Wrong HTTP Method"}, status=405)
    try:
        json_data = json.loads(request.body)
        username = json_data.get('username')
        password = json_data.get('password')
        email =  json_data.get('address')
        validate_email(email)
        if User.objects.filter(email=email).exists():
            return JsonResponse({"details": "Address already taken"}, status=409) 
        new_account = create_account(username=username, password=password, email=email)
        user_instance = authenticate(request, username=email, password=password)
        if user_instance == None:
            return JsonResponse({"details":"Could not authenticate new user"}, status=404)
        login(request, user_instance, backend=None)
        return JsonResponse(ProfileSerializer(new_account).data(), status=201)
    except ValidationError:
        return JsonResponse({"details": "Wrong Address"}, status=409) 
    except IntegrityError:
        return JsonResponse({"details": "Username already taken"}, status=409) 
    except Exception as e:
        return JsonResponse({"details": f"{e}"}, status=500)


@csrf_exempt
def resign_view(request):
    if not request.method == "DELETE":
        return JsonResponse({"details":"Wrong HTTP Method"}, status=405)
    try :
        if not request.user.is_authenticated:
            return JsonResponse({"details": "Not logged in"}, status=401)
        account_instance = Accounts.objects.get(user=request.user)
        request.user.delete()
        account_instance.delete()
        logout(request)
        return JsonResponse({"details":"Account successfully deleted"}, status=204)
    except Exception as e:
        return JsonResponse({"details": f"{e}"}, status=500)

@csrf_exempt
def sign_in_view(request):
    if not request.method == "POST":
        return JsonResponse({"details":"Wrong HTTP method"}, status=405)
    try:
        if request.user.is_authenticated:
            return JsonResponse({"details":"Already signed in"}, status=200)
        json_data = json.loads(request.body)
        username = json_data.get('username')
        password = json_data.get('password')
        user_instance = authenticate(request, username=username, password=password)
        if user_instance == None:
            return JsonResponse({f"details {username} {password}":"Could not authenticate user"}, status=404)
        account_instance = Accounts.objects.get(user=user_instance)
        login(request, user_instance, backend=None)
        return JsonResponse(ProfileSerializer(account_instance).data(), status=200)
    except Exception as e:
        return JsonResponse({"details": f"{e}"}, status=500)

# def update_view(request):

@csrf_exempt
def sign_out_view(request):
    if not request.method == "POST":
        return JsonResponse({"details":"Wrong HTTP method"}, status=405)
    try:
        if not request.user.is_authenticated:
            return JsonResponse({"details":"Not Logged in"}, status=401)
        logout(request)
        return JsonResponse({"details":"Successfuly logged out"}, status=200)
    except Exception as e:
        return JsonResponse({"details": f"{e}"}, status=500) 
