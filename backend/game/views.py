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
            room = Room.objects.get(id=room_id)
        except Room.DoesNotExist:
            return JsonResponse({'error': 'Room does not exist'}, status=404)
        serializer = RoomSerializer(room)
        data = serializer.data()
        return JsonResponse(data, safe=False)

@method_decorator(csrf_exempt, name='dispatch')
class AddPlayer(View):
    def post(self, request, room_id, player_id):
        try:
            room = Room.objects.get(id=room_id)
            player = user.objects.get(username='user1')
            if (room.player1 == None):
                
                room.player1 = player
                room.save()
            elif (room.player2 == None):
                room.player2 = player
                room.save()
            else:
                return HttpResponse('Room is full', status=404)
            return HttpResponse('Player added successfully', status=200)
        except Exception as e:
            return JsonResponse({"details": f"{e}"}, status=404)
        
def isKingPin(moves, color):
    #PIRE CODE DE TOUT LES TEMPS
    #print("DEBUG 9")
    if (color == None):
        color = isWhite
    row = ["a", "b", "c", "d", "e", "f", "g", "h"]
    x = 1
    for lines in fen:
        y = 1
        for piece in lines:
            if ((color and piece == "K") or (not color and piece == "k")):
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
    if (empty(x,y)):
        return False
    color = "black" if fen[x][y].islower() else "white"
    return (color == "white" and fen[x][y].isupper()) or (color == "black" and fen[x][y].islower())

def empty(x, y):
    return (fen[x][y] == 'X')

def blocked(x, y, aimx, aimy):
    direction = 0
    diffx = aimx - x
    diffy = aimy - y
    #print(f"DEBUG 8 {fen[x][y]} x:{x} y:{y} aX: {aimx} aY: {aimy}\ndiffx: {diffx} diffy: {diffy}")
    if fen[x][y] in ('n', 'N', 'p', 'P'):
        return (friendly_fire(aimx, aimy))
    if (not diffx):
        direction = 1 if (y < aimy) else -1
        for i in range(y + direction, aimy, direction):
            if (not empty(x, i)):
                return True
    elif (not diffy):
        direction = 1 if (x < aimx) else -1
        for i in range(x + direction, aimx, direction):
            if (not empty(i, y)):
                return True
    elif (abs(diffx) == abs(diffy)):
        directionx = diffx / abs(diffx)
        directiony = diffy / abs(diffy)
        for i in range(1, abs(aimx - x)):
            if (not empty(x + (i * math.floor(directionx)), y + (i * math.floor(directiony)))):
                return True
    return (friendly_fire(aimx, aimy))
def discoverCheck(moves, x, y, aimx, aimy, isBlack):
    fenShCpy = list(fen)
    fenShCpy[aimx][aimy] = fenShCpy[x][y]
    fenShCpy[x][y] = 'X'
    return (isKingPin(moves, isBlack))
def addPosition(moves, x, y, bypass, fromX, fromY):
    if (outOfBound(x, y) or friendly_fire(x, y) or (x == fromX and y == fromY)):
        return
    chess_positions = [
    "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",
    "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
    "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
    "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
    "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
    "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
    "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
    "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"]
    
    if (not blocked(fromX, fromY, x, y) and (empty(x, y) or bypass)):
        moves.append(chess_positions[x * 8 + y])
    
def getPawnMoves(x, y):
    #print(f"DEBUG 6 piece: {fen[x][y]} [{x},{y}]")
    direction = 0
    isBlack = fen[x][y].islower()
    doublestep = (x * 8 + y in range(8, 16) and isBlack) or (x * 8 + y in range(48, 56) and not isBlack)
    direction = 1 if isBlack else -1
    moves = []
    addPosition(moves, x + direction, y, 0, x, y)
    if (doublestep):
        addPosition(moves, x + (direction * 2), y, 0, x, y)
    if (not outOfBound(x + direction, y + direction) and not empty(x + direction, y + direction)):
        addPosition(moves, x + direction, y, 1, x, y)
    if (not outOfBound(x + direction, y - direction) and not empty(x + direction, y - direction)):
        addPosition(moves, x + direction, y, 1, x, y)
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
            chessdict = {'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7}
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
            x = 0
            for line in fen:
                y = 0
                for piece in line:
                    pos = x * 8 + y
                    for move in moves[pos]:
                        for i in move:
                            aimx = chessdict[i[0]]
                            aimy = i[1]
                            if (discoverCheck(moves, x, y, aimx, aimy, piece.islower())):
                                move.remove(i)
                    y+=1
                x+=1
            print(f"succes {moves}")
            room.game.state.moves = (moves)
            room.game.state.kingpin = isKingPin(moves, None)
            room.game.state.save()
            return (RoomDetail.get(self, request, room_id))   
        except Exception as e:
            return JsonResponse({"details": f"{e}"}, status=404)
def arrayToFen(array):
    res = ""
    for line in array:
        newline = ""
        for char in line:
            cpt = 0
            while (char == 'X'):
                cpt+=1
            newline += char if not cpt else cpt
        res += newline
    return res

def playMove(move, room):
    #get data
    chessdict = {'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7}
    fen = room.game.state.fen
    elems = fen.split(" ")
    pieces = getFenX(elems[0].split("/"))
    color = elems[1] == "w"
    if (move in ['0-0', '0-0-0']):
        if (color == 'w'):
            if (move == '0-0'):
                elems[2].replace('K', '')
                pieces[7][4], pieces[7][6] = pieces[7][6], pieces[7][4]
                pieces[7][7], pieces[7][5] = pieces[7][5], pieces[7][7]
            else:
                elems[2].replace('Q', '')
                pieces[7][4], pieces[7][1] = pieces[7][1], pieces[7][4]
                pieces[7][0], pieces[7][3] = pieces[7][3], pieces[7][0]
        else:
            if (move == '0-0'):
                elems[2].replace('K', '')
                pieces[0][4], pieces[0][6] = pieces[0][6], pieces[0][4]
                pieces[0][7], pieces[0][5] = pieces[0][5], pieces[0][7]
            else:
                elems[2].replace('Q', '')
                pieces[0][4], pieces[0][1] = pieces[0][1], pieces[0][4]
                pieces[0][0], pieces[0][3] = pieces[0][3], pieces[0][0]
    else:
        #set positions
        aimx = chessdict[move[2]]
        aimy = move[3]
        x = chessdict[move[0]]
        y = move[1]
        #modify data
        ispawn = pieces[x][y] in ['p', 'P'] 
        pieces[aimx][aimy] = pieces[x][y]
        pieces[x][y] = 'X'
    elems[0] = arrayToFen(pieces)
    elems[1] = 'b' if color == 'w' else 'w'
    #translate data
    newfen = ""
    for elem in elems:
        newfen += elem
    #update data
    if (ispawn and ((aimx == 0 and color == 'w') or (aimx == 7 and color == 'b'))):
        room.game.state.promotion = move[2:]
    else:
        room.game.state.promotion = None
    room.game.state.fen = newfen
    room.game.state.save()

@method_decorator(csrf_exempt, name='dispatch')
class PostChessMove(View):
    def post(self, request, room_id):
        if request.method == 'POST':
            try:
                data = json.loads(request.body)
                isAI = data.get('AI')
                move = data.get('move')
                depth = data.get('depth')
                room = Room.objects.get(id=room_id)
                if (room == None):
                    return HttpResponse('Room does not exist', status=404)
                if (isAI == True):
                    stockfish = Stockfish(path='/usr/local/lib/python3.12/site-packages/stockfish')
                    stockfish.set_depth(depth)
                    stockfish.set_fen_position(room.objects.game.state.fen)
                    move = stockfish.get_best_move()
                playMove(move, room)
                return RoomDetail.get(self, request, room_id)
            except Exception as e:
                return JsonResponse({"details": f"{e}"}, status=404)
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
        
        

