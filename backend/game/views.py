from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.http import JsonResponse, HttpResponse
# from api.models import Accounts
from .models import *
from .serializers import RoomSerializer, DisPlaySerializer
import json
import math
import re
from stockfish import Stockfish
import logging
from profiles.models import Profile, Pong_stats, Chess_stats

logger = logging.getLogger(__name__)

class DisPlay(View):
    def get(self, request, game):
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"details": "not authenticated"}, status=401)
            me = Profile.objects.get(id=request.user.id)
            data = DisPlaySerializer(me).data(game)
            return JsonResponse(data, status=200, safe=False)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class DismissChallenge(View):
    def post(self, request, id, game, tab):
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"details": "not authenticated"}, status=401)
            me = Profile.objects.get(id=request.user.id)
            otherPlayer = Profile.objects.get(id=id)
            myGameData = None
            otherPlayerGameData = None
            if game == 'pong':
                myGameData = Pong_stats.objects.get(id=request.user.id)
                otherPlayerGameData = Pong_stats.objects.get(id=id)
            elif game == 'chess':
                myGameData = Chess_stats.objects.get(id=request.user.id)
                otherPlayerGameData = Chess_stats.objects.get(id=id)
            else:
                return JsonResponse({"details" : "No such game"}, status=401)
            if tab == 'challengers':
                myGameData.challengers.remove(otherPlayer)
                otherPlayerGameData.challenged.remove(me)
            elif tab == 'challenged':
                myGameData.challenged.remove(otherPlayer)
                otherPlayerGameData.challengers.remove(me)
            else:
                return JsonResponse({"details" : "No such tab"}, status=401)
            myGameData.save()
            otherPlayerGameData.save()
            return JsonResponse({"details" : "challenge dismissed"}, status=200, safe=False)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)


#
# ROOM CREATE
#
@method_decorator(csrf_exempt, name='dispatch')
class RoomCreate(View):
    def post(self, request):
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"details": "not authenticated"}, status=401)
            json_data = json.loads(request.body)
            player1 = Profile.objects.get(user=request.user)
            game = json_data.get("game")
            idPlayer2 = json_data.get("player2")
            player2 = Profile.objects.get(id=idPlayer2)
            if game == 'pong':
                player2gameStats = player2.pong_stats
            else:
                player2gameStats = player2.chess_stats 
            logger.debug('DEBUG1')
            if not player2gameStats.challengers.all().contains(player1) and not player2gameStats.challenged.all().contains(player1):
                return JsonResponse({"details" : "this user dismissed your challenge"}, status=407, safe=False)
            logger.debug('DEBUG2')
            spectate = True
            if not player1.spectate or not player2.spectate:
                spectate = False
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
            newRoom = Room(game=newGame, player1=player1, player2=player2, spectate=spectate)
            newRoom.save()
            player1.room = newRoom
            player1.save()
            return JsonResponse(newRoom.id, status=201, safe=False)
        except Exception as e:
            return JsonResponse({"details": f"{e}"}, status=404)
        
@method_decorator(csrf_exempt, name='dispatch')
class UpdateRoom(View):
    def post(self, request, id):
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"details": "not authenticated"}, status=401)
            me = Profile.objects.get(user=request.user)
            room = Room.objects.get(id=id)
            me.room = room
            me.save()
            return JsonResponse({"details" : "room updated"}, status=200, safe=False)
        except Exception as e:
            return JsonResponse({"details": f"{e}"}, status=404)
        
@method_decorator(csrf_exempt, name='dispatch')
class CancelGame(View):
    def post(self, request, id, otherPlayerId):
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"details": "not authenticated"}, status=401)
            me = Profile.objects.get(id=request.user.id)
            otherPlayer = Profile.objects.get(id=otherPlayerId)
            room = Room.objects.get(id=id)
            room.delete()
            me.room = None
            otherPlayer.room = None
            me.save()
            otherPlayer.save()
            return JsonResponse({"details" : "room updated"}, status=200, safe=False)
        except Exception as e:
            return JsonResponse({"details": f"{e}"}, status=404)

#
# ROOM DETAIL
#
class GetGame(View):
    def get(self, request):
        try:
            if not request.user.is_authenticated:
                    return JsonResponse({"details": "not authenticated"}, status=401)
            me = Profile.objects.get(user=request.user)
            room = Room.objects.get(id=me.room.id)
            return JsonResponse(room.game.name, status=200, safe=False)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)

class RoomDetail(View):
    def get(self, request, id):
        try:
            room = Room.objects.get(id=id)
            serializer = RoomSerializer(room)
            data = serializer.data()
            return JsonResponse(data, safe=False)
        except Room.DoesNotExist:
            return JsonResponse({'error': 'Room does not exist'}, status=404)
class RoomNumber(View):
    def get(self, request):
        try:
            i = 1
            while (true):
                room = Room.objects.get(id=room_id)
                i+=1
        except Room.DoesNotExist:
            return JsonResponse({'id': i}, status=404)
        
class RoomReset(View):
    def get(self, request, room_id):
        try:
            room = Room.objects.get(id=room_id)
            newBall = Ball()
            newBall.save()
            newPaddle = Paddle()
            newPaddle.save()
            newScore = Score()
            newScore.save()
            newState = GameState(ball=newBall, paddle=newPaddle, score=newScore)
            newState.save()
            newGame = Game(state=newState, name=room.game.name)
            newGame.save()
            room.game = newGame
            room.save()
            ##print(f"test => {RoomSerializer(room).data()}")
            return RoomDetail.get(self, request, room_id)
        except Room.DoesNotExist:
            return JsonResponse({'error': 'Room does not exist'}, status=404)
class RoomDelete(View):
    def get(self, request, room_id):
        try:
            ##print("DELETING")
            room = Room.objects.get(id=room_id)
            player1 = Accounts.objects.get(id=room.player1.id)
            player2 = Accounts.objects.get(id=room.player2.id)
            print(player1)
            player1.match = 0
            player1.save()
            player2.match = 0
            player2.save()
            ##print("HAS DELETED")
            room.delete()
            ##print ("RETURN ?")
            return JsonResponse({'succes': 'Deleted'}, status=200)
        except Exception as e:
            return JsonResponse({'error': 'Room does not exist'}, status=404)
#
# ADD PLAYER
#
@method_decorator(csrf_exempt, name='dispatch')
class AddPlayer(View):
    def post(self, request, room_id, player_id):
        try:
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

#
# IS KING PINNED
# 1. find the king of the color of the piece that moved
# 2. loop over the fen, check the pieces of opposite color and their moves
# 3. if the king position in in the move return True

def isKingPin(moves, color):
    if (color == None):
        color = isWhite
    row = ["a", "b", "c", "d", "e", "f", "g", "h", "?", "?"]
    column = ['8','7','6','5','4','3','2','1', '?', '?']
    x = 0
    kingPosition = ""
    for line in fen:
        y = 0
        for piece in line:
            if (color and piece == 'k' or not color and piece == 'K'):
                #find black king if is black and white king if not black
                kingPosition = row[y] + column[x]
                #print(f"found the corresponding king {kingPosition}")
            y+=1
        x+=1
    x = 0 
    for lines in fen:
        y = 0
        for piece in lines:
            if (empty(x, y)):
                y+=1
                continue
            pieceColor = piece.islower()
            #if opposite color
            if (color != pieceColor):
                ##print(f"x={x} y={y} piece {piece}")
                pos = row[y] + column[x]
                move = moves[x * 8 + y]
                #print(f"{pos}: {move}\n\tKing: {kingPosition}")
                #print(f"King attacked ? {kingPosition in move}")
                #if that piece can harm the king
                if kingPosition in move:
                    ##print(f"{kingPosition} in {move}")
                    return True
            y+=1
        x+=1
    return False


#
# DISCOVER CHECK, CREATE A SIMULATION OF A MOVE AND CHECK IF THE CURRENT PLAYER'S KING WOULD BE CHECKED IN THIS SIMULATION
#
def discoverCheck(x, y, aimx, aimy, isBlack):
    global fen
    #if (x == 0 and y == 0):
    if (x == 7 and y == 4):
        print(f"[{x}][{y}] => [{aimx}][{aimy}]")
    #print(f"before fen {fen}")
    fen = list(fen)
    fen[aimx] = list(fen[aimx])
    fen[x] = list(fen[x])
    fen[aimx][aimy] = fen[x][y]
    fen[x][y] = "X"
    #print(f"aftere fen {fen}\n")
    theoricalMoves = getMoves()
    j = 0
    for i in theoricalMoves:
        #print(f"{j}: {fen[int(j / 8)][int(j % 8)]}: {i}")
        j+=1
    return (isKingPin(theoricalMoves, isBlack))
    #return (False)

#
# BLOCKED, PATH IS HINDERED BY OTHER PIECES
#
def blocked(x, y, aimx, aimy):
    direction = 0
    diffx = aimx - x
    diffy = aimy - y
    if (fen[x][y] in ['n', 'N']):
        return False
    #deplacement en ligne de type row
    if (not diffx):
        direction = 1 if (y < aimy) else -1
        for i in range(y + direction, aimy, direction):
            if (not empty(x, i)):
                ###print(f"\tfen[{x}][{i}]: {fen[x][y]} is not empty !")
                return True
    #deplacement en ligne de type column
    elif (not diffy):
        direction = 1 if (x < aimx) else -1
        for i in range(x + direction, aimx, direction):
            if (not empty(i, y)):
                return True
    #deplacement en diago
    elif (abs(diffx) == abs(diffy)):
        directionx = diffx / abs(diffx)
        directiony = diffy / abs(diffy)
        for i in range(1, abs(aimx - x)):
            if (not empty(x + (i * math.floor(directionx)), y + (i * math.floor(directiony)))):
                return True
    return (False)

#
# OUT OF BOUND
#
def outOfBound(x, y):
    try:
        fen[x][y]
        return (x < 0 or y < 0)
    except:
        return (True)

#
# FRIENDLY FIRE
#
def friendly_fire(x, y, aimx, aimy):
    return (not empty(aimx, aimy) and fen[x][y].isupper() == fen[aimx][aimy].isupper())

#
# CELL IS EMPTY
#
def empty(x, y):
    return (fen[x][y] == 'X')


def itself(x, y, aimX, aimY):
    return (x == aimX and y == aimY)

#
# ADD POSITION IF NOT OUT OF BOUND OR HINDERED OR ATTACKING YOURSELF
#
def addPosition(moves, aimX, aimY, x, y):
    # if (not outOfBound(aimX, aimY) and fen[x][y] == 'R'):
    #     ##print(f"x: {x} y: {y} Ax: {aimX} Ay: {aimY}\n\
    #     FF ? {fen[x][y]} to {fen[aimX][aimY]}: {friendly_fire(x,y, aimX, aimY)}\n\
    #     Blocked ? {blocked(x,y, aimX, aimY)}\n")
    if (
    not outOfBound(aimX, aimY) and
    not friendly_fire(x, y, aimX, aimY) and
    not blocked(x, y, aimX, aimY)):
        ###print(f"adds fen[{aimX}][{aimY}]: {fen[aimX][aimY]}")
        moves.append(chess_positions[aimX * 8 + aimY])

def addPawnPosition(moves, x, y, aimX, aimY):
    if (not outOfBound(aimX, aimY) and empty(aimX, aimY) and not blocked(x, y, aimX, aimY)):
        moves.append(chess_positions[aimX * 8 + aimY])

#
# PAWN MOVES
#
def getPawnMoves(x, y):
    direction = 0
    isBlack = fen[x][y].islower()
    doublestep = (x * 8 + y in range(8, 16) and isBlack) or (x * 8 + y in range(48, 56) and not isBlack)
    direction = 1 if isBlack else -1
    moves = list()
    addPawnPosition(moves, x, y, x + direction, y)
    if (doublestep):
        addPawnPosition(moves, x, y, x + (direction * 2), y)
    if (not outOfBound(x + direction, y + 1) and not empty(x + direction, y + 1)):
        addPosition(moves, x + direction, y + 1, x, y)
    if (not outOfBound(x + direction, y + 1) and not empty(x + direction, y - 1)):
        addPosition(moves, x + direction, y - 1, x, y)
    return moves

#
# ROOK MOVES
#
def getRookMoves(x, y):
    moves = list()
    for i in range(-7, 8):
        addPosition(moves, 
        x + i,
        y,
        x, y)

        addPosition(moves,
        x,
        y + i, 
        x, y)

    return moves

#
# BISHOP MOVES
#
def getBishopMoves(x, y):
    moves = list()
    for i in range(-7, 8):
        addPosition(moves, x + i, y + i, x, y)
        addPosition(moves, x + i, y - i, x, y)
    return moves

#
# KING MOVES
#
def getKingMoves(x, y):
    moves = list()
    #diagonal moves
    addPosition(moves, x + 1, y + 1, x, y)
    addPosition(moves, x + 1, y - 1, x, y)
    addPosition(moves, x - 1, y + 1, x, y)
    addPosition(moves, x - 1, y - 1, x, y)
    #aligned moves
    addPosition(moves, x, y + 1, x, y)
    addPosition(moves, x, y - 1, x, y)
    addPosition(moves, x + 1, y, x, y)
    addPosition(moves, x - 1, y, x, y)
    return moves

#
# KNIGHT MOVES
#
def getKnightMoves(x, y):
    moves = list()
    addPosition(moves, x + 1, y + 2, x, y)
    addPosition(moves, x + 2, y + 1, x, y)
    addPosition(moves, x + 1, y - 2, x, y)
    addPosition(moves, x + 2, y - 1, x, y)
    addPosition(moves, x - 1, y + 2, x, y)
    addPosition(moves, x - 2, y + 1, x, y)
    addPosition(moves, x - 1, y - 2, x, y)
    addPosition(moves, x - 2, y - 1, x, y)
    return moves

#
# GET FEN WITH X IN PLACE OF DIGIT
#
def getFenX(basefen):
    modified_fen_data = []
    new_row = ""
    i = 0
    for row in basefen:
        for char in row:
            if char.isdigit():
                new_row += "X" * int(char)
            else:
                new_row += char
        modified_fen_data.append(new_row)
        new_row = ""
        i+=1
    return (modified_fen_data)

#
# GET MOVES OF ALL PIECES
#
def getMoves():
    moves = []
    ##print(f"fen in getMoves {fen}")
    x = 0
    for line in fen:
        ##print(f"current line => {line}")
        y = 0
        for piece in line:
            ##print(f"\tpiece => {piece}")
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
                array = getBishopMoves(x, y)
                array2 = getRookMoves(x, y)
                for i in list(array2):
                    ##print(f"pushing {i}")
                    array.append(i)
            elif (piece == 'r' or piece == 'R'):
                array = getRookMoves(x, y)
            movelist = list(dict.fromkeys(array))
            moves.append(movelist)
            y+=1
        x+=1
    return moves

class ChessMoves(View):
    def get(self, request, room_id):
        ##print("GET MOVES")
        try:
            chessdict = {'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7}
            room = Room.objects.get(id=room_id)
            basefen = room.game.state.fen
            elems = basefen.split(" ")
            global fen, chess_positions, isWhite
            chess_positions = [
                "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8",
                "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
                "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
                "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
                "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
                "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
                "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
                "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]
            fen = getFenX(elems[0].split("/"))
            ##print(f"fen = {fen}")
            isWhite = elems[1] == "w"
            x = 0
            moves = getMoves()
            j = 0
            for i in moves:
                print(f"{chess_positions[j]} ({j}): {i}")
                j+=1
            #print(f"moves Succes: {moves}\n\n\n")

            fencpy = fen
            for line in fencpy:
                y = 0
                for piece in line:
                    pos = x * 8 + y
                    if (len(moves[pos]) == 0):
                        y+=1
                        continue
                    print(f"piece = {fencpy[int(pos / 8)][int(pos % 8)]} =? {piece}\nmoves = {moves[pos]}")
                    print(f"total lenght: {len(moves[pos])}")
                    currentMoves = list(moves[pos])
                    for i in range(len(moves[pos])):
                        print(i)
                        try:
                            move = currentMoves[i]
                            print(move)
                            aimx = 8 - int(move[1])
                            aimy = chessdict[move[0]]
                            print(f"{i}: {move} => [{aimx}][{aimy}]")
                            if (discoverCheck(x, y, aimx, aimy, piece.islower())):
                                moves[pos].remove(move)
                        except Exception as e:
                            print(f"error: {e}")
                        
                        fen = fencpy
                    y+=1          
                x+=1

            room.game.state.moves = (moves)
            room.game.state.kingpin = isKingPin(moves, None)
            room.game.state.save()
            return (RoomDetail.get(self, request, room_id))   
        except Exception as e:
            print(f"error: {e}")
            return JsonResponse({"details": f"{e}"}, status=500)

#
# SWITCH MODIFIED FEN BACK TO NORMAL FEN
#
def arrayToFen(array):
    res = ""
    cpt = 0
    slashCounter = 0
    for char in array:
        ###print(f"DEBUG ARRAY_TO_FEN => {slashCounter} : {char} current {res}")
        slashCounter += 1
        if char == 'X' :
            cpt += 1
            if (cpt == 8 or slashCounter % 8 == 0):
                res += str(cpt)
                cpt = 0  
        else:
            if cpt > 0:
                res += str(cpt)
                cpt = 0
            res += char
        if (slashCounter % 8 == 0 and slashCounter < 63):
            res += "/"
    return res

def concat(array):
    res = ""
    for i in array:
        res += i
    return (res)
#
# PLAY THE GIVEN MOVE
#
def playMove(move, room):
    ispawn = False
    chessdict = {'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7}
    chessrow = [0,7,6,5,4,3,2,1,0]
    king, King, Krook, Qrook, krook, qrook = 4, 60, 63, 56, 7, 0
    fen = room.game.state.fen
    elems = fen.split(" ")
    pieces = getFenX(elems[0].split("/"))
    color = elems[1] == "w"
    pieces = list(concat(pieces))
    ##print(f"pieces: {pieces}")
    if move in ['0-0', '0-0-0']:
        if color:
            if move == '0-0':
                elems[2] = elems[2].replace('K', '')
                pieces[King] = "X"
                pieces[Krook - 1] = "K"
                pieces[Krook] = "X"
                pieces[King + 1] = "R"
            else:
                elems[2] = elems[2].replace('Q', '')
                pieces[King] = "X"
                pieces[Qrook + 2] = "K"
                pieces[Qrook] = "X"
                pieces[King - 1] = "R"
        else:
            if move == '0-0':
                elems[2] = elems[2].replace('k', '')
                pieces[king] = "X"
                pieces[krook - 1] = "k"
                pieces[krook] = "X"
                pieces[king + 1] = "r"
            else:
                elems[2] = elems[2].replace('q', '')
                pieces[king] = "X"
                pieces[qrook + 2] = "k"
                pieces[qrook] = "X"
                pieces[king - 1] = "r"
    if not (re.match(r'^[a-h][1-8][a-h][1-8]$', move)):
        raise Exception("Invalid move: format incorrect, expected [a-h][1-8][a-h][1-8]")
    aimIndex = (int(chessrow[int(move[3])]) * 8) + int(chessdict[move[2]])
    index = (int(chessrow[int(move[1])]) * 8) + int(chessdict[move[0]])
    if (pieces[index] == 'X'):
        raise Exception("Invalid move, tried to move a blank position")
    ispawn = pieces[index] in ['p', 'P']
    pieces[aimIndex] = pieces[index]
    pieces[index] = "X"
    elems[0] = arrayToFen(pieces)
    elems[1] = 'b' if color else 'w'
    newfen = ""
    for elem in elems:
        newfen += elem + " "
    if (ispawn and ((aimIndex in [0,8] and color == 'w') or (aimIndex in [56,64] and color == 'b'))):
        room.game.state.promotion = move[2:]
    else:
        room.game.state.promotion = None
    room.game.state.fen = newfen
    ##print(f"DB FEN {room.game.state.fen}\nMY FEN {pieces}")
    room.game.state.save()

#
# INTERCEPT MOVE THEN PLAY IT
#
@method_decorator(csrf_exempt, name='dispatch')
class PostChessMove(View):
    def post(self, request, room_id):
        if request.method == 'POST':
            ##print("VA ICI")
            try:
                ##print(f"{request.body}")
                data = json.loads(request.body)
                isAI = data.get('AI')
                move = data.get('move')
                depth = data.get('depth')
                ##print(f"MOVE ={move}")
                room = Room.objects.get(id=room_id)
                if (isAI == True):
                    stockfish = Stockfish()
                    stockfish.set_depth(depth)
                    stockfish.set_fen_position(room.objects.game.state.fen)
                    move = stockfish.get_best_move()
                playMove(move, room)
                return RoomDetail.get(self, request, room_id)
            except Exception as e:
                return JsonResponse({"details": f"{e}"}, status=500)
        else:
            return HttpResponse('Only POST requests are allowed', status=405)

#
# PROMOTE PAWN TO GIVEN PIECE
#
@method_decorator(csrf_exempt, name='dispatch')
class Promote(View):
    def post(self, request, room_id, grade):
        try:
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

#
# GET BALANCE, PLAYER ADVANTAGE 
#
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
        
        

