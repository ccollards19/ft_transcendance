from django.shortcuts import render

# Create your views here.
=======
from models import Tournament
import json
from django.http import JsonResponse
from django.views import View
# from serializer import TournamentSerializer

class TournamentCreate(View):
    def post(self, request):
        try:
            json_data = json.loads(request.body)
            game = json_data.get("game")
            organizerId = json_data.get("organizerId")
            organizerName = json_data.get("organizerName")
            picture = json_data.get("picture")
            title = json_data.get("title")
            background = None
            bg = json_data("background")
            if bg:
                background = bg
            maxContenders = json_data.get("maxContenders")
            selfContender = json_data.get("selfContender")
            newTournament = Tournament(game=game, organizerId=organizerId, organizerName=organizerName, picture=picture, title=title, background=background, maxContenders=maxContenders, selfContender=selfContender)
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
