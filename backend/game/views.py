from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.http import JsonResponse, HttpResponse
from .models import *
from .serializer import RoomSerializer
from stockfish import *
import json
import math

@method_decorator(csrf_exempt, name='dispatch')
class RoomCreate(View):
    def post(self, request, *args, **kwargs):
        player1 = None
        player2 = None
        game = json.loads(request.body).get("game")
        id1 = json.loads(request.body).get("id1")
        id2 = json.loads(request.body).get("id2")
        if (game == None):
            return JsonResponse(status=404)
        if (id1 != None):
            player1 = user.objects.get(id=id1)
        if (id2 != None):
            player2 = user.objects.get(id=id2)
        #print("DEBUG:", game)
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
    def get(self, request, room_id):
        try:
            # Retrieve the room with the specified ID
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            return JsonResponse({'error': 'Room does not exist'}, status=404)
        
        # Serialize the room data
        serializer = RoomSerializer(room)
        data = serializer.data()
        
        # Return JSON response with room data
        return JsonResponse(data, safe=False)
@method_decorator(csrf_exempt, name='dispatch')
class AddPlayer(View):
    def post(self, request, room_id, player_id):
        try:
            ##print(f"----DEBUG----\nroomid = {room_id}, playerid = {player_id}")
            room = Room.objects.get(id=room_id)
            player = user.objects.get(username='user1')
            if (room.player1 == None):
                
                room.player1 = player
                ##print("DEBUG 1", room.player1.to_dict())
                room.save()
            elif (room.player2 == None):
                ##print("DEBUG 2")
                room.player2 = player
                room.save()
            else:
                return HttpResponse('Room is full', status=404)
            return HttpResponse('Player added successfully', status=200)
        except Exception as e:
            return JsonResponse({"details": f"{e}"}, status=404)
        
def isKingPin(moves):
    #print("DEBUG 9")
    row = ["a", "b", "c", "d", "e", "f", "g", "h"]
    x = 1
    for lines in fen:
        y = 1
        for piece in lines:
            if ((isWhite and piece == "k") or (not isWhite and piece == "K")):
                pos = row[x] + str(y)
                for i in moves:
                    for move in i:
                        if (pos == move):
                            return True
            y+=1
        x+=1
    return False
def outOfBound(x, y):
    try:
        fen[x][y]
        return (x < 0 or y < 0)
    except:
        return (True)
def friendly_fire(x, y):
    ##print(f"1 x={x} y={y} fen={fen}")
    return (isWhite and fen[x][y].islower()) or (not isWhite and fen[x][y].isupper())

def empty(x, y):
    #print(f"2{outOfBound(x, y)} value={fen[x][y]}")
    return (fen[x][y] == 'X')

def blocked(x, y, aimx, aimy):
    
    direction = 0
    diffx = aimx - x
    diffy = aimy - y
    #print(f"DEBUG 8 {fen[x][y]} x:{x} y:{y} aX: {aimx} aY: {aimy}\ndiffx: {diffx} diffy: {diffy}")
    if fen[x][y] in ('n', 'N', 'p', 'P'):
        return (friendly_fire(aimx, aimy))
    if (not diffx):
        #print("case 1")
        direction = 1 if (y < aimy) else -1
        for i in range(y + direction, aimy, direction):
            if (not empty(x, i)):
                return True
    elif (not diffy):
        direction = 1 if (x < aimx) else -1
        #print(f"case 2: i in range({x + direction}, {aimx}, {direction})")
        for i in range(x + direction, aimx, direction):
            #print(f"not empty({i}, {y})")
            if (not empty(i, y)):
                return True
    elif (abs(diffx) == abs(diffy)):
        directionx = diffx / abs(diffx)
        directiony = diffy / abs(diffy)
        #print("case 3(bishop/queen)")
        for i in range(1, abs(aimx - x)):
            if (not empty(x + (i * math.floor(directionx)), y + (i * math.floor(directiony)))):
                return True
    return (friendly_fire(aimx, aimy))
    
def addPosition(moves, x, y, bypass, fromX, fromY):
    if (outOfBound(x, y) or friendly_fire(x, y)):
        return
    #print("DEBUG 7")
    chess_positions = [
    "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",
    "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
    "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
    "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
    "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
    "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
    "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
    "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"]
    
    #print(f"piece: {fen[fromX][fromY]} x: {x} y: {y}\n")
    if (not blocked(fromX, fromY, x, y)  and (fen[x][y] == "X" or bypass)):
        moves.append(chess_positions[x * 8 + y])
    
def getPawnMoves(x, y):
    print(f"DEBUG 6 piece: {fen[x][y]} [{x},{y}]")
    direction = 0
    isBlack = fen[x][y].islower()
    print(f"pos = {x * 8 + y}color = {isBlack} blackrange {x * 8 + y in range(8, 16)} whiterange {x * 8 + y in range(48, 56)}")
    doublestep = (x * 8 + y in range(8, 16) and isBlack) or (x * 8 + y in range(48, 56) and not isBlack)
    direction = 1 if isBlack else -1
    #print("DEBUG 6.1")
    moves = []
    addPosition(moves, x + direction, y, 0, x, y)
    #print("DEBUG 6.2")
    if (doublestep):
        addPosition(moves, x + (direction * 2), y, 0, x, y)
    #print("DEBUG 6.3")
    if (not outOfBound(x + direction, y + direction) and not empty(x + direction, y + direction)):
        addPosition(moves, x + direction, y, 1, x, y)
    #print("DEBUG 6.4")
    if (not outOfBound(x + direction, y - direction) and not empty(x + direction, y - direction)):
        addPosition(moves, x + direction, y, 1, x, y)
    #print("DEBUG 6.5")
    return moves

def getRookMoves(x, y):
    #print("DEBUG 5")
    moves = []
    for i in range(-7, 7):
        addPosition(moves, x + i, y, 1, x, y)
        addPosition(moves, x, y + i, 1, x, y)
    return moves
def getBishopMoves(x, y):
    #print("DEBUG 4")
    moves = []
    for i in range(-7, 7):
        addPosition(moves, x + i, y + i, 1, x, y)
        addPosition(moves, x + i, y - i, 1, x, y)
    return moves
def getKingMoves(x, y):
    #print("DEBUG 3")
    moves = []
    addPosition(moves, x + 1, y + 1, 1, x, y)
    addPosition(moves, x + 1, y - 1, 1, x, y)
    addPosition(moves, x - 1, y + 1, 1, x, y)
    addPosition(moves, x + 1, y - 1, 1, x, y)
    addPosition(moves, x, y + 1, 1, x, y)
    addPosition(moves, x, y - 1, 1, x, y)
    addPosition(moves, x + 1, y, 1, x, y)
    addPosition(moves, x - 1, y, 1, x, y)
    return moves
def getKnightMoves(x, y):
    #print("DEBUG 2")
    moves = []
    addPosition(moves, x + 1, y + 2, 1, x, y)
    addPosition(moves, x + 2, y + 1, 1, x, y)
    addPosition(moves, x + 1, y - 2, 1, x, y)
    addPosition(moves, x + 2, y - 1, 1, x, y)
    addPosition(moves, x - 1, y + 2, 1, x, y)
    addPosition(moves, x - 2, y + 1, 1, x, y)
    addPosition(moves, x - 1, y - 2, 1, x, y)
    addPosition(moves, x - 2, y - 1, 1, x, y)
    return moves
def getFenX(basefen):
    #print("DEBUG 1")
    modified_fen_data = []
    new_row = ""
    ##print(f"base: {basefen}")
    i = 0
    for row in basefen:
        ##print(f"row: {row}\n")
        for char in row:
            ##print(f"char={char}")
            if char.isdigit():
                new_row += "X" * int(char)
            else:
                new_row += char
        modified_fen_data.append(new_row)
        new_row = ""
        i+=1
    ##print(f"fen: {modified_fen_data}")  
    return (modified_fen_data)
class ChessMoves(View):
    def get(self, request, room_id):
        try:
            room = Room.objects.get(id=room_id)
            basefen = room.game.state.fen
            elems = basefen.split(" ")
            global fen
            fen = getFenX(elems[0].split("/"))
            ##print(f"{outOfBound(-5, 7)}\n")
            #return JsonResponse({"details": "lol"}, status=404)
            moves = []
            global isWhite
            isWhite = elems[1] == "w"
            x = 0
            for line in fen:
                y = 0
                for piece in line:
                    array = []
                    print(f"piece = {piece}")
                    if (piece == 'p' or piece == 'P'):
                        array = getPawnMoves(x, y)
                    elif (piece == 'n' or piece == 'N'):
                        array = getKnightMoves(x, y)
                    elif (piece == 'K' or piece == 'k'):
                        array = getKingMoves(x, y)
                    elif (piece == 'b' or piece == 'B'):
                        array = getBishopMoves(x, y)
                    elif (piece == 'Q' or piece == 'q'):
                        marray = getBishopMoves(x, y) + getRookMoves(x, y)
                    elif (piece == 'r' or piece == 'R'):
                        array = getRookMoves(x, y) 
                    moves.append(list(dict.fromkeys(array)))
                    y+=1
                x+=1
            print(f"succes {moves}")
            room.game.state.moves = (moves)
            room.game.state.kingpin = isKingPin(moves)
            room.game.state.save()
            return (RoomDetail.get(self, request, room_id))   
        except Exception as e:
            return JsonResponse({"details": f"{e}"}, status=404)
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
        
        

