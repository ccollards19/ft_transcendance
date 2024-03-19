from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.http import HttpResponseNotAllowed
from django.http import JsonResponse
from api.models import user
from django.core import serializers
import json
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
        return JsonResponse({"details":"Wrong"}, status=404),

def sign_in_view(request):
    if request.method == "GET":
        try:
            json_data = json.loads(request.body)
            username = json_data.get('name')
            password = json_data.get('password')
            user_instance = user.objects.get(username=username, password=password)
            data = user_instance.to_dict()
            return JsonResponse(data, status=200)
        except Exception as e:
            return JsonResponse({"details": f"{e}"}, status=404)
    else :
        return JsonResponse({"details":"Wrong"}, status=404)

# def update_view(request):

def sign_out_view(request):
    if request.method == "UPDATE":
        return JsonResponse({"details":"successful"}, status=200)
    else :
        return JsonResponse({"details":"Wrong"}, status=404)
