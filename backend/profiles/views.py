from django.contrib.auth.models import User
from django.views import View
from profiles.models import Profile, Chess_stats, Pong_stats
from profiles.serializers import ProfileSerializer, MyProfileSerializer, ChatProfileSerializer, ChampionSerializer, ChatListSerializer
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import json
import logging

logger = logging.getLogger(__name__)

class GetProfile(View):
    def get(self, request, id, game):
        try:
            is_my_profile = False
            if request.user.id == id:
                is_my_profile = True
            instance = Profile.objects.get(id=id)
            data = ProfileSerializer(instance).data(game, is_my_profile)
            return JsonResponse(data, status=200, safe=False)
        except Exception as e: return JsonResponse(f"{e}", status=404, safe=False)

class GetProfileChat(View):
    def get(self, request, id):
        try:
            instance = Profile.objects.get(id=id)
            data = ChatProfileSerializer(instance).data()
            return JsonResponse(data, status=200, safe=False)
        except Exception as e: return JsonResponse(f"{e}", status=404, safe=False)
        
class GetMyProfile(View):
    def get(self, request):
        if not request.user.is_authenticated:
            return JsonResponse({"details": "not authenticated"}, status=401)
        try:
            account_instance = Profile.objects.get(user=request.user)
            account_ser = MyProfileSerializer(account_instance)
            return JsonResponse(account_ser.data(), status=200)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)

class GetChatList(View):
    def get(self, request, id):
        if not request.user.is_authenticated:
            return JsonResponse({"details": "not authenticated"}, status=401)
        try:
            user = Profile.objects.get(id=id)
            data = ChatListSerializer(user).data()
            logger.debug('here')
            return JsonResponse(data, status=200, safe=False)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)

class Leaderboard(View):
    def get(self, request, game):
        try:
            champions = Profile.objects.all()
            list = []
            for item in champions:
                stats = None
                if game == 'pong':
                    stats = Pong_stats.objects.get(id=item.id)
                else:
                    stats = Chess_stats.objects.get(id=item.id)
                list.append(ChampionSerializer(item).data(stats))
            return JsonResponse(list, status=200, safe=False)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)
        
@method_decorator(csrf_exempt, name='dispatch')
class AddFriend(View):
    def post(self, request, id):
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"details": "not authenticated"}, status=401)
            asker = Profile.objects.get(id=request.user.id)
            receiver = Profile.objects.get(id=id)
            if receiver.friend_requests.contains(asker):
                JsonResponse({"details" : "request already sent"}, status=417)
            receiver.friend_requests.add(asker)
            receiver.save()
            return JsonResponse({"details" : "request send"}, status=200)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class AcceptRequest(View):
    def post(self, request, id):
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"details": "not authenticated"}, status=401)
            me = Profile.objects.get(id=request.user.id)
            newFriend = Profile.objects.get(id=id)
            me.friends.add(newFriend)
            me.friend_requests.remove(newFriend)
            me.save()
            newFriend.friends.add(me)
            newFriend.save()
            return JsonResponse({"details" : "friend added"}, status=200)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class BlockUser(View):
    def post(self, request, id):
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"details": "not authenticated"}, status=401)
            json_data = json.loads(request.body)
            isFriend = json_data.get("isFriend")
            me = Profile.objects.get(id=request.user.id)
            otherUser = Profile.objects.get(id=id)
            me.blocked.add(otherUser)
            if isFriend:
                me.friends.remove(otherUser)
                otherUser.friends.remove(me)
                otherUser.save()
            me.save()
            return JsonResponse({"details" : "user blocked"}, status=200)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class Unfriend(View):
    def post(self, request, id):
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"details": "not authenticated"}, status=401)
            me = Profile.objects.get(id=request.user.id)
            otherUser = Profile.objects.get(id=id)
            me.friends.remove(otherUser)
            me.save()
            return JsonResponse({"details" : "friend removed"}, status=200)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class Unblock(View):
    def post(self, request, id):
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"details": "not authenticated"}, status=401)
            me = Profile.objects.get(id=request.user.id)
            otherUser = Profile.objects.get(id=id)
            me.blocked.remove(otherUser)
            me.save()
            return JsonResponse({"details" : "user unblocked"}, status=200)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class Challenge(View):
    def post(self, request, id, game):
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"details": "not authenticated"}, status=401)
            me = Profile.objects.get(id=request.user.id)
            otherUser = Profile.objects.get(id=id)
            if game != 'pong' and game != 'chess':
                return JsonResponse({"details" : "not a game"}, status=400)
            elif game == 'pong':
                otherUserGameData = Pong_stats.objects.get(id=id)
                if otherUserGameData.challenged.contains(me) or otherUserGameData.challengers.contains(me):
                    return JsonResponse({"details" : "already challenged"}, status=417)
                otherUserGameData.challengers.add(me)
                myGameData = Pong_stats.objects.get(id=request.user.id)
                myGameData.challenged.add(otherUser)
            elif game == 'chess':
                otherUserGameData = Chess_stats.objects.get(id=id)
                if otherUserGameData.challenged.contains(me) or otherUserGameData.challengers.contains(me):
                    return JsonResponse({"details" : "already challenged"}, status=417)
                otherUserGameData.challengers.add(me)
                myGameData = Chess_stats.objects.get(id=request.user.id)
                myGameData.challenged.add(otherUser)
            me.save()
            otherUser.save()
            return JsonResponse({"details" : "challenge sent"}, status=200)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)
        

@method_decorator(csrf_exempt, name='dispatch')
class ModifyProfile(View):
    def post(self, request):
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"details": "not authenticated"}, status=401)
            me = Profile.objects.get(id=request.user.id)
            json_data = json.loads(request.body)
            key = json_data.get('key')
            value = json_data.get('value')
            if key == 'name':
                user = User.objects.get(id=request.user.id)
                user.username = value
                user.save()
            else:
                if key == 'catchphrase':
                    me.catchphrase = value
                elif key == 'bio':
                    me.bio = value
                me.save()
            return JsonResponse({"details" : "profile modified"}, status=200)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class UpdateAvatar(View):
    def post(self, request):
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"details": "not authenticated"}, status=401)
            me = Profile.objects.get(id=request.user.id)
            data = request.FILES
            avatar = data.get('avatar')
            if avatar:
                me.avatar = avatar
                me.save()
            logger.debug(me.avatar.url)
            return JsonResponse(me.avatar.url, status=200, safe=False)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)

@method_decorator(csrf_exempt, name='dispatch')
class UpdateSettings(View):
    def post(self, request):
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"details": "not authenticated"}, status=401)
            me = Profile.objects.get(id=request.user.id)
            json_data = json.loads(request.body)
            game = json_data.get('game')
            language = json_data.get('language')
            challengeable = json_data.get('challengeable')
            spectate = json_data.get('spectate')
            me.defaultGame = game
            me.language = language
            me.challengeable = challengeable
            me.spectate = spectate
            me.save()
            return JsonResponse({"details" : "settings updated"}, status=200)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)

class GetFriendlist(View):
    def get(self, request):
        try:
            if not request.user.is_authenticated:
                return JsonResponse({"details": "not authenticated"}, status=401)
            me = Profile.objects.get(id=request.user.id)
            data = list(me.friends.all().values_list("id", flat=True))
            return JsonResponse(data, status=200, safe=False)
        except Exception as e: return JsonResponse({"details": f"{e}"}, status=404)
