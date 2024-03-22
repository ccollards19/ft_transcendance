from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.http import HttpResponseNotAllowed
from django.http import JsonResponse
from api.models import user
from django.core import serializers
import json

def init_view(request):
    if request.method == "GET":
        try:
            json_data = json.loads(request.body)
            username = json_data.get('')
            password = json_data.get('password')
            email =  json_data.get('address')
            new_user = user(username=username, password=password, email=email);
            new_user.save();
            return JsonResponse({"details":"successful"}, status=200)
        except Exception as e:
            return JsonResponse({"details": f"{e}"}, status=404)
    else :
        return JsonResponse({"details":"Wrong"}, status=404)
    
