from django.shortcuts import render

# Create your views here.
from tournaments.models import SpecificTournament
from api.models import Accounts
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
            game = json_data.get("game")
            organizerId = json_data.get("organizerId")
            organizerName = json_data.get("organizerName")
            picture = json_data.get("picture")
            title = json_data.get("title")
            background = json_data.get("background")
            maxContenders = json_data.get("maxContenders")
            selfContender = json_data.get("selfContender")
            selfContender = int(selfContender)
            newTournament = SpecificTournament(game=game, 
                                       organizerId=organizerId, 
                                       organizerName=organizerName, 
                                       picture=picture, 
                                       title=title, 
                                       background=background, 
                                       maxContenders=maxContenders)
            if selfContender > 0:
                me = Accounts.objects.get(id=selfContender)
                newTournament.allContenders.add(me)
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
