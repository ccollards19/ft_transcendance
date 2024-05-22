from django.shortcuts import render

# Create your views here.
from tournaments.models import Tournament
import json
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging
# from serializer import TournamentSerializer

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class TournamentCreate(View):
    def post(self, request, *args, **kwargs):
        try:
            json_data = json.loads(request.body)
            logger.debug(json_data)
            background = None
            bg = json_data("background")
            if bg:
                background = bg
            newTournament = Tournament(game=json_data.get("game"), 
                                       organizerId=json_data.get("organizerId"), 
                                       organizerName=json_data.get("organizerName"), 
                                       picture=json_data.get("picture"), 
                                       title=json_data.get("title"), 
                                       background=background, 
                                       maxContenders=json_data.get("maxContenders"), 
                                       selfContender=json_data.get("selfContender"))
            newTournament.save()
            return JsonResponse({"id" : newTournament.id}, status=201, safe=False)
        except Exception as e:
            return JsonResponse({"details": f"{e}"}, status=404)
    
# def tournament_details(request, id):
#     try:
#         tournament = Tournament.objects.get(id=id)
#         serial = TournamentSerializer(tournament)
#         data = serial.data()
#         return JsonResponse(data, status=200, safe=False)
#     except Exception as e:
#         JsonResponse({"details": f"{e}"}, status=404)
