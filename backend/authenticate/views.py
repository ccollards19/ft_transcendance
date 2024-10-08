from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.http import JsonResponse
from api.models import Accounts, Pong_stats, Chess_stats
from api.serializers import ProfileSerializer
import json
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required

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
    if request.method == "POST":
        try:
            json_data = json.loads(request.body)
            username = json_data.get('name')
            password = json_data.get('password')
            email =  json_data.get('address')
            new_account = create_account(username=username, password=password, email=email)
            
            return JsonResponse(ProfileSerializer(new_account).data(), status=200)
        except Exception as e:
            print(e)
            return JsonResponse({"details": f"{e}"}, status=404)
    else :
        return JsonResponse({"details":"Wrong"}, status=404)


def resign_view(request):
    if request.method == "DELETE":
        return JsonResponse({"details":"successful"}, status=200)
    else :
        return JsonResponse({"details":"Wrong"}, status=404)


@csrf_exempt
def sign_in_view(request):
    if request.method == "POST":
        if request.user.is_authenticated:
            return JsonResponse({"details":"Already signed in"}, status=200)
        try:
            json_data = json.loads(request.body)
            username = json_data.get('name')
            password = json_data.get('password')
            user_instance = authenticate(request, username=username, password=password)
            if user_instance is not None:
                # login(request, user_instance, backend=None)
                account_instance = Accounts.objects.get(user=user_instance)
                return JsonResponse(ProfileSerializer(account_instance).data(), status=200)
        except Exception as e:
            return JsonResponse({"details": f"{e}"}, status=404)
    return JsonResponse({"details":"Wrong"}, status=404)

# def update_view(request):

def sign_out_view(request):
    if request.method == "POST":
        return JsonResponse({"details":"successful"}, status=200)
    else :
        return JsonResponse({"details":"Wrong"}, status=404)
