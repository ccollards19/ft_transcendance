from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.models import User
from profiles.models import Profile, Pong_stats, Chess_stats
from django.db import IntegrityError
import json
from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
import logging

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
        new_profile = Profile(user=new_user, pong_stats=pst, chess_stats=cst)
        new_profile.save()
    except Exception as e :
        return JsonResponse({"details" : f"{e}"}, status=500)


@csrf_exempt
def sign_up_view(request):
    logger.debug('DEBUG')
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
        create_account(username=username, password=password, email=email)
        user_instance = authenticate(request, username=email, password=password)
        if user_instance == None:
            return JsonResponse({"details":"Could not authenticate new user"}, status=404)
        login(request, user_instance, backend=None)
        return JsonResponse({"details" : "Account created"}, status=201)
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
        account_instance = Profile.objects.get(user=request.user)
        request.user.delete()
        account_instance.delete()
        logout(request)
        return JsonResponse({"details":"Account successfully deleted"}, status=204)
    except Exception as e:
        return JsonResponse({"details": f"{e}"}, status=500)

@csrf_exempt
def sign_in_view(request):
    logger.debug('DEBUG')
    if not request.method == "POST":
        return JsonResponse({"details":"Wrong HTTP method"}, status=405)
    try:
        if request.user.is_authenticated:
            return JsonResponse({"details":"Already signed in"}, status=200)
        json_data = json.loads(request.body)
        email = json_data.get('email')
        password = json_data.get('password')
        user_instance = authenticate(request, username=email, password=password)
        if user_instance == None:
            return JsonResponse({f"details":"Could not authenticate user"}, status=404)
        login(request, user_instance, backend=None)
        return JsonResponse({"details" : "you are authenticated"}, status=200)
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
