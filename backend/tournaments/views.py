from django.shortcuts import render

# Create your views here.
from profiles.models import Profile
from tournaments.models import Tournament
from tournaments.serializers import TournamentSerializer, TournamentListSerializer
import json
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class TournamentCreate(View):
    def post(self, request):
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"details": "not authenticated"}, status=401)
            me = Profile.objects.get(id=request.user.id)
            json_data = json.loads(request.body)
            game = json_data.get("game")
            title = json_data.get("title")
            maxContenders = json_data.get("maxContenders")
            selfContender = json_data.get("selfContender")
            newTournament = Tournament(game=game, 
                                       title=title,
                                       organizer=me,
                                       maxContenders=maxContenders)
            newTournament.save()
            me.tournaments.add(newTournament)
            if selfContender:
                newTournament.allContenders.add(me)
                me.subscriptions.add(newTournament)
                newTournament.save()
            me.save()
            return JsonResponse(newTournament.id, status=201, safe=False)
        except Exception as e:
            return JsonResponse({"details": f"{e}"}, status=404)
        
@method_decorator(csrf_exempt, name='dispatch')
class SetTournamentImages(View):
    def post(self, request, id):
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"details": "not authenticated"}, status=401)
            data = request.FILES
            tournament = Tournament.objects.get(id=id)
            picture = data.get('picture')
            bg = data.get('bg')
            if picture:
                tournament.picture = picture
            if bg:
                tournament.background = bg
            tournament.save()
            return JsonResponse({'message' : 'success'}, status=200, safe=False)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)
        
    
@method_decorator(csrf_exempt, name='dispatch')
class GetTournament(View):
    def get(self, request, id):
        try:
            tournament = Tournament.objects.get(id=id)
            data = TournamentSerializer(tournament).data()
            return JsonResponse(data, status=200, safe=False)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class GetAllTournaments(View):
    def get(self, request, game):
        try:
            tournaments = Tournament.objects.all().filter(game=game)
            list = []
            for item in tournaments:
                list.append(TournamentListSerializer(item).data())
            return JsonResponse(list, status=200, safe=False)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class Subscribe(View):
    def post(self, request, id):
        try:
            if not request.user.is_authenticated:
                    return JsonResponse({"details": "not authenticated"}, status=401)
            me = Profile.objects.get(id=request.user.id)
            tournament = Tournament.objects.get(id=id)
            tournament.allContenders.add(me)
            me.subscriptions.add(tournament)
            me.save()
            tournament.save()
            return JsonResponse({"details" : "you seccessfully subscribed"}, status=200, safe=False)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class UpdateDescription(View):
    def post(self, request, id):
        try:
            if not request.user.is_authenticated:
                    return JsonResponse({"details": "not authenticated"}, status=401)
            tournament = Tournament.objects.get(id=id)
            json_data = json.loads(request.body)
            newDesc = json_data.get("newDesc")
            if newDesc is not None:
                tournament.description = newDesc
                tournament.save()
            return JsonResponse({"details" : "description updated"}, status=200, safe=False)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)
