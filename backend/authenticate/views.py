from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.http import HttpResponseNotAllowed
from django.http import JsonResponse
from api.models import user
from django.core import serializers
import json
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required

# Create your views here.
@csrf_exempt
def sign_up_view(request):
    if request.method == "POST":
        try:
            json_data = json.loads(request.body)
            username = json_data.get('name')
            password = json_data.get('password')
            email =  json_data.get('address')
            new_user = user(username=username, password=password, email=email);
            new_user.save();
            return JsonResponse({"details":"successful"}, status=200)
        except Exception as e:
            return JsonResponse({"details": f"{e}"}, status=404)
    else :
        return JsonResponse({"details":"Wrong"}, status=404)


def resign_view(request):
    if request.method == "DELETE":
        return JsonResponse({"details":"successful"}, status=200)
    else :
        return JsonResponse({"details":"Wrong"}, status=404)


def sign_in_view(request):
    if request.method == "GET":
        if request.user.is_authenticated:
            return JsonResponse({"details":"Already signed in"}, status=200)
        try:
            json_data = json.loads(request.body)
            username = json_data.get('name')
            password = json_data.get('password')

            connard = user.objects.get(username="user1")
            #print("USER IS", user.to_dict())
            #user_instance = authenticate(username=username, password=password)
            #if user_instance is not None:
                #login(request, user_instance, backend=None)
            data = connard.to_dict()
            return JsonResponse(data, status=200)
        except Exception as e:
            return JsonResponse({"details": f"{e}"}, status=404)
    return JsonResponse({"details":"Wrong"}, status=404)

# def update_view(request):

def sign_out_view(request):
    if request.method == "UPDATE":
        return JsonResponse({"details":"successful"}, status=200)
    else :
        return JsonResponse({"details":"Wrong"}, status=404)
