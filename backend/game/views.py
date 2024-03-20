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
        player1, player2 = None
        game = json.loads(request.body).get("game")
        id1 = json.loads(request.body).get("id1")
        id2 = json.loads(request.body).get("id2")
        if (game == None):
            return JsonResponse(status=404)
        if (id1 != None):
            player1 = user.objects.get(id=id1)
        if (id2 != None):
            player2 = user.objects.get(id=id2)
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
        newRoom = Room(game=newGame, player1=player1, player2=player2)
        newRoom.save()
        serial = RoomSerializer(newRoom)
        data = serial.data()
        return JsonResponse(data, status=201, safe=False)

class RoomDetail(View):
    def get(self, request, id, *args, **kwargs):
        data = json.loads(request.body)
        roomId = data.get('roomid')
        if (roomId == None):
             return HttpResponse('Room does not exist', status=404)
        room = Room.objects.get(id=roomId)
        serializer = RoomSerializer(room)
        data = serializer.data()
        return JsonResponse(data, status=201, safe=False)
@method_decorator(csrf_exempt, name='dispatch')
class AddPlayer(View):
    def post(self, request, id, *args, **kwargs):
        roomId = json.loads(request.body).get("roomid")
        playerId = json.loads(request.body).get("playerid")
        if (id != None):
            newPlayer = user.objects.get(id=playerId)
        else:
             return JsonResponse(status=404)
        if (roomId == None):
             return HttpResponse('Room does not exist', status=404)
        room = Room.objects.get(id=roomId)
        if (room.player1 == None):
            room.player1 = newPlayer
        elif (room.player2 == None):
            room.player2 = newPlayer
        else:
            return HttpResponse('Room is full', status=404)
        return HttpResponse('Player added successfully', status=200)
@csrf_exempt
def PostChessMove(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        roomId = data.get('roomid')
        isAI = data.get('AI')
        move = data.get('move')
        depth = data.get('depth')
        room = Room.objects.get(id=roomId)
        if (roomId == None):
             return HttpResponse('Room does not exist', status=404)
        if (isAI == True):
            stockfish = Stockfish(path='/usr/local/lib/python3.12/site-packages')
            stockfish.set_depth(depth)
            stockfish.set_fen_position(room.objects.game.state.fen)
            newMove= stockfish.get_best_move()
            return HttpResponse(newMove, status=200)
            
        return HttpResponse('Data received successfully', status=200)
    else:
        return HttpResponse('Only POST requests are allowed', status=405)
    
def GetBalance(request):
    if request.method == 'GET':
        data = json.loads(request.body)
        roomId = data.get('roomid')
        if (roomId == None):
            return HttpResponse('Room does not exist', status=404)
        stockfish = Stockfish(path='/usr/local/lib/python3.12/site-packages')
        stockfish.set_fen_position(room.objects.game.state.fen)
        evalu = stockfish.get_evaluation()
        return JsonResponse(evalu, 200)
         
        
        

