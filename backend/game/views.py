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
def isKingPin(fen, isWhite, moves):
    row = ["a", "b", "c", "d", "e", "f", "g", "h"]
    x = 1
    for lines in fen:
        y = 1
        for piece in lines:
            if ((isWhite and piece == "k") or (not isWhite and piece == "K")):
                pos = row[x] + y
                for i in moves:
                    for move in i:
                        if (pos == move):
                            return True
            y+=1
        x+=1
    return False
def blocked(fen, x, y, aimx, aimy):
    if (aimx == x):
        direction = 1 if (y < aimy) else -1
        for i in range(y, aimy + direction, direction):
            if (fen[x][i] != 'X'):
                return True
    elif (aimy == y):
        direction = 1 if (x < aimx + direction) else -1
        for i in range(x, aimx, direction):
            if (fen[i][y] != 'X'):
                return True
    return False
    
def addPosition(moves, x, y, fen, condition, fromX, fromY):
    chess_positions = [
    "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",
    "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
    "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
    "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
    "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
    "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
    "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
    "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"]
    if (0 < x < 7 and 0 < y < 7 and not blocked(fen, fromX, fromY, x, y)  and (fen[x][y] == "X" or bypass)):
        moves.append(chess_positions[x * 8 + y])
    
def getPawnMoves(fen, x, y, isWhite):  
    doublestep = (x * 8 + y in range(8, 15) and not isWhite ) or (x * 8 + y in range(48, 55) and isWhite)
    direction = -1 if isWhite else 1
    moves = []
    addPosition(moves, x + direction, y, fen, 0, x, y)
    if (doublestep):
        addPosition(moves, x + direction, y, fen, 0, x, y)
    if (fen[x + direction][y + direction] != 'X'):
        addPosition(moves, x + direction, y, fen, 1, x, y)
    if (fen[x + direction][y - direction] != 'X'):
        addPosition(moves, x + direction, y, fen, 1, x, y)
    return pawnMoves

def getRookMoves(fen, x, y, isWhite):
    moves = []
    for i in range(-7, 8):
        addPosition(moves, x + i, y, fen, 1, x, y)
        addPosition(moves, x, y + i, fen, 1, x, y)
    return pawnMoves
def getBishopMoves(fen, x, y, isWhite):
    moves = []
    for i in range(-7, 8):
        addPosition(moves, x + i, y + i, fen, 1, x, y)
        addPosition(moves, x + i, y - i, fen, 1, x, y)
    return pawnMoves
def getKingMoves(fen, x, y, isWhite):
    addPosition(moves, x + 1, y + 1, fen, 1, x, y)
    addPosition(moves, x + 1, y - 1, fen, 1, x, y)
    addPosition(moves, x - 1, y + 1, fen, 1, x, y)
    addPosition(moves, x + 1, y - 1, fen, 1, x, y)
    addPosition(moves, x, y + 1, fen, 1, x, y)
    addPosition(moves, x, y - 1, fen, 1, x, y)
    addPosition(moves, x + 1, y, fen, 1, x, y)
    addPosition(moves, x - 1, y, fen, 1, x, y)
    moves = []
    return pawnMoves
def getKnightMoves(fen, x, y, isWhite):
    addPosition(moves, x + 1, y + 2, fen, 1, x, y)
    addPosition(moves, x + 2, y + 1, fen, 1, x, y)
    addPosition(moves, x + 1, y - 2, fen, 1, x, y)
    addPosition(moves, x + 2, y - 1, fen, 1, x, y)
    addPosition(moves, x - 1, y + 2, fen, 1, x, y)
    addPosition(moves, x - 2, y + 1, fen, 1, x, y)
    addPosition(moves, x - 1, y - 2, fen, 1, x, y)
    addPosition(moves, x - 2, y - 1, fen, 1, x, y)
    moves = []
    return pawnMoves
def getFenX(fen):
    new_row = "" 
    for row in fen:
        for char in row:
            if char.isdigit():
                new_row += "X" * int(char)
            else:
                new_row += char
    modified_fen_data.append(new_row)
    return modified_fen_data    
def getChessMoves(request):
    data = json.loads(request.body)
    roomId = data.get('roomid')
    if (roomId == None):
        return HttpResponse('Room does not exist', status=404)
    room = Room.objects.get(id=roomId)
    fen = room.game.state.fen
    elems = fen.split(" ")
    pieces = elems[0].split("/")
    pieces = getFenX(pieces)
    moves = []
    isWhite = elems[1] == "w"
    x = 0
    for line in pieces:
        y = 0
        for piece in line:
            if (piece == 'p' or piece == 'P'):
                moves.append(getPawnMoves(pieces, x, y, isWhite))
            elif (piece == 'n' or piece == 'N'):
                moves.append(getKnightMoves(pieces, x, y, isWhite))
            elif (piece == 'K' or piece == 'k'):
                moves.append(getKingMoves(pieces, x, y, isWhite))
            elif (piece == 'b' or piece == 'B'):
                moves.append(getBishopMoves(pieces, x, y, isWhite))
            elif (piece == 'Q' or piece == 'q'):
                moves.append(getBishopMoves(pieces, x, y, isWhite) + getRookMoves(pieces, i + y,isWhite))
            elif (piece == 'r' or piece == 'R'):
                moves.append(getRookMoves(pieces, x, y, isWhite)) 
            y+=1
        x+=1
    room.game.state.moves = (moves)
    room.game.sate.kingpin = isKingPin(fen, isWhite, moves)
    room.save()
    return (RoomDetail(request))   
     
def playMove(move, room):
    fen = room.game.state.fen
    elems = fen.split(" ")
    pieces = elems[0].split("/")
    turn = elems[1] == "w"
    return (1)

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
            stockfish = Stockfish(path='/usr/local/lib/python3.12/site-packages/stockfish')
            stockfish.set_depth(depth)
            stockfish.set_fen_position(room.objects.game.state.fen)
            newMove= stockfish.get_best_move()
            return HttpResponse(newMove, status=200)
        else:
            playMove(move, room)
        return HttpResponse('Data received successfully', status=200)
    else:
        return HttpResponse('Only POST requests are allowed', status=405)
    
def GetBalance(request):
    if request.method == 'GET':
        data = json.loads(request.body)
        roomId = data.get('roomid')
        if (roomId == None):
            return HttpResponse('Room does not exist', status=404)
        stockfish = Stockfish(path='/usr/local/lib/python3.12/site-packages/stockfish')
        stockfish.set_fen_position(room.objects.game.state.fen)
        evalu = stockfish.get_evaluation()
        return JsonResponse(evalu, 200)
    else:
        return HttpResponse("Support only GET requests", 404)

        
        
        

