from django.shortcuts import render

# Create your views here.
from api.models import Accounts, Tournament
import json
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging
# from tournaments.forms import FileFieldForm
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
            title = json_data.get("title")
            maxContenders = json_data.get("maxContenders")
            selfContender = json_data.get("selfContender")
            selfContender = int(selfContender)
            newTournament = Tournament(game=game, 
                                       organizerId=organizerId, 
                                       organizerName=organizerName,
                                       title=title,
                                       maxContenders=maxContenders)
            newTournament.save()
            if selfContender > 0:
                me = Accounts.objects.get(id=selfContender)
                newTournament.allContenders.add(me)
                newTournament.save()
            return JsonResponse({"id" : newTournament.id}, status=201, safe=False)
        except Exception as e:
            return JsonResponse({"details": f"{e}"}, status=404)
        
@method_decorator(csrf_exempt, name='dispatch')
class SetTournamentImages(View):
#     form_class = FileFieldForm

#     def post(self, request, id):
#         form_class = self.get_form_class()
#         form = self.get_form(form_class)
#         files = request.FILES.getlist('file_field')
#         for f in files:
#             logger.debug(f)
#         return JsonResponse(status=200, safe=False)
    def post(self, request, id):
        try:
            # data = request.FILES
            # logger.debug(data)
            # tournament = Tournament.objects.get(id=int(id))
            # tournament.picture = data
            # tournament.save()
            return JsonResponse(status=200, safe=False)
        except Exception as e: logger.debug(e)
    
# def tournament_details(request, id):
#     try:
#         tournament = Tournament.objects.get(id=id)
#         serial = TournamentSerializer(tournament)
#         data = serial.data()
#         return JsonResponse(data, status=200, safe=False)
#     except Exception as e:
#         JsonResponse({"details": f"{e}"}, status=404)
