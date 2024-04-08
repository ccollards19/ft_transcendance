from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.http import JsonResponse, HttpResponse
from .models import *
from .serializer import RoomSerializer
import json
import math
from stockfish import Stockfish
@method_decorator(csrf_exempt, name='dispatch')
class RoomCreate(View):
    def post(self, request, *args, **kwargs):
        try:
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
            ###print(f"DEBUG {data}")
            return JsonResponse(data, status=201, safe=False)
        except Exception as e:
            return JsonResponse({"details": f"{e}"}, status=404)

class RoomDetail(View):
    def get(self, request, room_id):
        try:
            room = Room.objects.get(id=room_id)
            serializer = RoomSerializer(room)
            data = serializer.data()
            return JsonResponse(data, safe=False)
        except Room.DoesNotExist:
            return JsonResponse({'error': 'Room does not exist'}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class AddPlayer(View):
    def post(self, request, room_id, player_id):
        try:
            ##print(f"DEBUG room_id={room_id} player_id={player_id}")
            room = Room.objects.get(id=room_id)
            player = Accounts.objects.get(id=player_id)
            if (room.player1 == None):
                room.player1 = player
                room.save()
            elif (room.player2 == None and room.player1 != player):
                room.player2 = player
                room.save()
            else:
                return HttpResponse('Room is full', status=404)
            return HttpResponse('Player added successfully', status=200)
        except Exception as e:
            return JsonResponse({"details": f"{e}"}, status=404)
        
def isKingPin(moves, color):
    #PIRE CODE DE TOUT LES TEMPS
    ##print("DEBUG 9")
    if (color == None):
        color = isWhite
    row = ["a", "b", "c", "d", "e", "f", "g", "h"]
    x = 0
    for lines in fen:
        y = 0
        for piece in lines:
            if ((color and piece == "k") or (not color and piece == "K")):
                pos = row[x] + str(y)
                for i in moves:
                    for move in i:
                        if (pos == move):
                            return True
            y+=1
        x+=1
    ##print("out of 9")
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
    ##print(f"DEBUG 8 {fen[x][y]} x:{x} y:{y} aX: {aimx} aY: {aimy}\ndiffx: {diffx} diffy: {diffy}")
    if fen[x][y] in ('n', 'N', 'p', 'P'):
        return (friendly_fire(aimx, aimy))
    if (not diffx):
        direction = 1 if (y < aimy) else -1
        for i in range(y + direction, aimy, direction):
            if (not empty(x, i)):
                ##print("out of 8 not diffx")
                return True
    elif (not diffy):
        direction = 1 if (x < aimx) else -1
        for i in range(x + direction, aimx, direction):
            if (not empty(i, y)):
                ##print("out of 8 not diffy")
                return True
    elif (abs(diffx) == abs(diffy)):
        directionx = diffx / abs(diffx)
        directiony = diffy / abs(diffy)
        for i in range(1, abs(aimx - x)):
            if (not empty(x + (i * math.floor(directionx)), y + (i * math.floor(directiony)))):
                ##print("out of 8 same diff")
                return True
    ##print("out of 8")
    return (friendly_fire(aimx, aimy))

def discoverCheck(moves, x, y, aimx, aimy, isBlack):
    #print(f"1 x {x} y {y} aimx {aimx} aimy {aimy}")
    fenShCpy = list(fen)
    #print("2")
    line1 = list(fenShCpy[aimx])
    #print("3")
    if (y != aimy):
        #print("4")
        line2 = list(fenShCpy[x])
        #print("5")
        line1[int(aimy)] = line2[int(y)]
        #print("6")
        fenShCpy[int(x)] = line2
        #print("7")
        fenShCpy[int(aimx)] = line1
    else:
        #print("8")
        line1[int(aimx)] = line1[int(x)]
        #print("9")
        line1[int(x)] = 'X'
        #print("10")
        fenShCpy[x] = line1
    #print("end")
    
    #print("isKingpinned ?")
    return (isKingPin(moves, isBlack))

def addPosition(moves, x, y, bypass, fromX, fromY):
    ##print(f"DEBUG 7 moves = {moves}\naimx = {x}\naimy = {y}\nx = {fromX}\ny = {fromY}")
    if (outOfBound(x, y) or friendly_fire(x, y) or (x == fromX and y == fromY)):
        ##print("not valid, out of 7")
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
        ##print("trying to get postion", x * 8 + y)
        moves.append(chess_positions[x * 8 + y])
    ##print("out of 7")
    
def getPawnMoves(x, y):
    ##print(f"DEBUG 6 ")
    ##print(f"piece: {fen[x][y]} [{x},{y}]")
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
    ##print("out of 6")
    return moves

def getRookMoves(x, y):
    ##print("DEBUG 5")
    moves = []
    for i in range(-7, 7):
        addPosition(moves, x + i, y, 1, x, y)
        addPosition(moves, x, y + i, 1, x, y)
    ##print("out of 5")
    return moves
def getBishopMoves(x, y):
    ##print("DEBUG 4")
    moves = []
    for i in range(-7, 7):
        ##print(f"{i + 8}e iteration")
        addPosition(moves, x + i, y + i, 1, x, y)
        addPosition(moves, x + i, y - i, 1, x, y)
    ##print("out of 4")
    return moves
def getKingMoves(x, y):
    ##print("DEBUG 3")
    moves = []
    addPosition(moves, x + 1, y + 1, 1, x, y)
    addPosition(moves, x + 1, y - 1, 1, x, y)
    addPosition(moves, x - 1, y + 1, 1, x, y)
    addPosition(moves, x + 1, y - 1, 1, x, y)
    addPosition(moves, x, y + 1, 1, x, y)
    addPosition(moves, x, y - 1, 1, x, y)
    addPosition(moves, x + 1, y, 1, x, y)
    addPosition(moves, x - 1, y, 1, x, y)
    ##print("out of 3")
    return moves
def getKnightMoves(x, y):
    ##print("DEBUG 2")
    moves = []
    addPosition(moves, x + 1, y + 2, 1, x, y)
    addPosition(moves, x + 2, y + 1, 1, x, y)
    addPosition(moves, x + 1, y - 2, 1, x, y)
    addPosition(moves, x + 2, y - 1, 1, x, y)
    addPosition(moves, x - 1, y + 2, 1, x, y)
    addPosition(moves, x - 2, y + 1, 1, x, y)
    addPosition(moves, x - 1, y - 2, 1, x, y)
    addPosition(moves, x - 2, y - 1, 1, x, y)
    ##print("out of 2")
    return moves
def getFenX(basefen):
    ##print("DEBUG 1")
    modified_fen_data = []
    new_row = ""
    ####print(f"base: {basefen}")
    i = 0
    for row in basefen:
        ####print(f"row: {row}\n")
        for char in row:
            ####print(f"char={char}")
            if char.isdigit():
                new_row += "X" * int(char)
            else:
                new_row += char
        modified_fen_data.append(new_row)
        new_row = ""
        i+=1
    ####print(f"fen: {modified_fen_data}")  
    ##print("out of 1")
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
            moves = []
            global isWhite
            isWhite = elems[1] == "w"
            x = 0
            for line in fen:
                y = 0
                for piece in line:
                    array = []
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
                    if (len(moves[pos]) == 0):
                        y+=1
                        continue
                    for move in moves[pos]:
                        aimx = chessdict[move[0]]
                        aimy = move[1]

                        if (discoverCheck(moves, x, y, aimx, aimy, piece.islower())):
                            moves[pos].remove(move)
                    y+=1
                x+=1
            room.game.state.moves = (moves)
            room.game.state.kingpin = isKingPin(moves, None)
            room.game.state.save()
            return (RoomDetail.get(self, request, room_id))   
        except Exception as e:
            return JsonResponse({"details": f"{e}"}, status=500)
def arrayToFen(array):
    res = ""
    for line in array:
        cpt = 0
        for char in line:
            if char == 'X':
                cpt += 1
            else:
                if cpt > 0:
                    res += str(cpt)
                    cpt = 0
                res += char
        if cpt > 0:
            res += str(cpt)
        res += '/'
    return res[:-1]

def playMove(move, room):
    ispawn = False
    chessdict = {'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7}
    chessrow = [0,7,6,5,4,3,2,1,0]
    fen = room.game.state.fen
    elems = fen.split(" ")
    pieces = getFenX(elems[0].split("/"))
    color = elems[1] == "w"
    if move in ['0-0', '0-0-0']:
        if color == 'w':
            if move == '0-0':
                elems[2] = elems[2].replace('K', '')
                pieces[7] = pieces[7][:4] + ' ' + pieces[7][6:]
                pieces[7] = pieces[7][:7] + 'R' + pieces[7][5:]
            else:
                elems[2] = elems[2].replace('Q', '')
                pieces[7] = pieces[7][:4] + ' ' + pieces[7][1:]
                pieces[7] = 'R' + pieces[7][2:5] + ' ' + pieces[7][0] + pieces[7][6:]
        else:
            if move == '0-0':
                elems[2] = elems[2].replace('k', '')
                pieces[0] = pieces[0][:4] + ' ' + pieces[0][6:]
                pieces[0] = pieces[0][:7] + 'r' + pieces[0][5:]
            else:
                elems[2] = elems[2].replace('q', '')
                pieces[0] = pieces[0][:4] + ' ' + pieces[0][1:]
                pieces[0] = 'r' + pieces[0][2:5] + ' ' + pieces[0][0] + pieces[0][6:]
    else:
        aimy = int(chessdict[move[2]])
        aimx = chessrow[int(move[3])]
        y = int(chessdict[move[0]])
        x = chessrow[int(move[1])]
        ispawn = pieces[x][y] in ['p', 'P']
        pieces[aimx] = pieces[aimx][:aimy] + pieces[x][y] + pieces[aimx][aimy + 1:]
        pieces[x] = pieces[x][:y] + 'X' + pieces[x][y + 1:]
    elems[0] = arrayToFen(pieces)
    elems[1] = 'b' if color == 'w' else 'w'
    newfen = ""
    for elem in elems:
        newfen += elem + " "
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
                if (isAI == True):
                    stockfish = Stockfish()
                    stockfish.set_depth(depth)
                    stockfish.set_fen_position(room.objects.game.state.fen)
                    move = stockfish.get_best_move()
                playMove(move, room)
                return RoomDetail.get(self, request, room_id)
            except Exception as e:
                return JsonResponse({"details": f"{e}"}, status=404)
        else:
            return HttpResponse('Only POST requests are allowed', status=405)
@method_decorator(csrf_exempt, name='dispatch')
class Promote(View):
    def post(self, request, room_id, grade):
        try:
            ##print("DEBUG IN")
            chessdict = {'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7}
            chessrow = [0,7,6,5,4,3,2,1,0]
            room = Room.objects.get(id=room_id)
            fen = room.game.state.fen
            elems = fen.split(" ")
            pieces = getFenX(elems[0].split("/"))
            toPromote = room.game.state.promotion
            isWhite = elems[1] == "w"
            if (grade not in ['N','Q','R','B']):
                raise Exception("Not a valid grade.")
            if (toPromote == None):
                raise Exception("Nothing to promote ! You sly looser...")
            y = int(chessdict[toPromote[0]])
            x = chessrow[int(toPromote[1])]
            grade = grade if isWhite else grade.tolower()
            pieces[x] = pieces[:y] + grade + pieces[y+1:]
            elems[0] = arrayToFen(pieces)
            for elem in elems:
                newfen += elem + " "
            room.game.state.fen = newfen
            room.game.state.promotion = None
            room.game.state.save()
        except Exception as e:
                return JsonResponse({"details": f"{e}"}, status=404)
def GetBalance(request):
    if request.method == 'GET':
        data = json.loads(request.body)
        roomId = data.get('roomid')
        if (roomId == None):
            return HttpResponse('Room does not exist', status=404)
        stockfish = Stockfish()
        stockfish.set_fen_position(room.objects.game.state.fen)
        evalu = stockfish.get_evaluation()
        return JsonResponse(evalu, 200)
    else:
        return HttpResponse("Support only GET requests", 404)        
        
        

