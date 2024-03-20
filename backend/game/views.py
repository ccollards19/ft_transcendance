from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.http import JsonResponse, HttpResponse
from .models import *
from .serializer import RoomSerializer
from stockfish import *
import json

@method_decorator(csrf_exempt, name='dispatch')
class RoomCreate(View):
    def post(self, request, *args, **kwargs):
        game = json.loads(request.body).get("game")
        if (game == None):
            return JsonResponse(status=404)
        print("DEBUG:", game)
        newBall = Ball()
        newBall.save()
        newPaddle = Paddle()
        newPaddle.save()
        newScore = Score()
        newScore.save()
        newState = GameState(ball=newBall, paddle=newPaddle, score=newScore)
        newState.save()
        newGame = Game(state=newState, name=game)
        newGame.save()
        newRoom = Room(game=newGame)
        newRoom.save()
        serial = RoomSerializer(newRoom)
        data = serial.data()
        return JsonResponse(data, status=201, safe=False)

class RoomDetail(View):
    def get(self, request, id, *args, **kwargs):
        room = Room.objects.get(id=id)
        serializer = RoomSerializer(room)
        return JsonResponse(serializer.data)

    def put(self, request, id, *args, **kwargs):
        room = Room.objects.get(id=id)
        serializer = RoomSerializer(room, data=request.POST)
        return JsonResponse(serializer.data)
@method_decorator(csrf_exempt, name='dispatch')
class AddPlayer(View):
    def post(self, request, id, *args, **kwargs):
        room = Room.objects.get(id=id)
        # Your logic to add a player to the room
        return JsonResponse({'message': 'Player added successfully'})
@csrf_exempt
def handle_post_data(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        move = data.get('move')
        depth = data.get('depth')
        print('Received data:', move, depth)
        return HttpResponse('Data received successfully', status=200)
    else:
        return HttpResponse('Only POST requests are allowed', status=405)

