import json
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import MatchmakingQueue, Match

@login_required
@csrf_exempt
def join_queue(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        game = data.get('game')

        MatchmakingQueue.objects.filter(user=request.user, game=game).delete()

        queue_entry = MatchmakingQueue.objects.create(user=request.user, game=game)
        return JsonResponse({'message': 'You have joined the queue for ' + game}, status=200)

@login_required
def matchmake(request):
    now = timezone.now()
    response_data = []

    for game, game_name in GAME.items():
        queue_entries = MatchmakingQueue.objects.filter(game=game).order_by('timestamp')

        while len(queue_entries) >= 2:
            player_a = queue_entries[0]
            player_b = queue_entries[1]

            # Create a match, necessary ?
            match = Match.objects.create(game=game, player_a=player_a.user, player_b=player_b.user)
            response_data.append({
                'match_id': match.id,
                'game': game_name,
                'player_a': player_a.user.username,
                'player_b': player_b.user.username,
            })

            player_a.delete()
            player_b.delete()

            queue_entries = MatchmakingQueue.objects.filter(game=game).order_by('timestamp')

    return JsonResponse(response_data, safe=False, status=200)
