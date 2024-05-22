from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from .models import Tournament, Match
from .utils import generate_match_pairs, generate_next_round_match_pairs

def start_tournament(request, tournament_id):
    try:
        tournament = Tournament.objects.get(id=tournament_id)
        if tournament.organizer != request.user.accounts:
            return JsonResponse({'error': 'You are not authorized to start this tournament.'}, status=403)

        if tournament.subscriptions.count() < 4 or tournament.subscriptions.count() > 32 or tournament.subscriptions.count() % 4 != 0:
            return JsonResponse({'error': 'Invalid number of participants for the tournament.'}, status=400)

        match_pairs = generate_match_pairs(tournament)

        for pair in match_pairs:
            match = Match.objects.create(tournament=tournament, player_a=pair[0], player_b=pair[1])

        return JsonResponse({'message': 'Tournament started successfully.'}, status=200)
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Tournament not found.'}, status=404)

def tournament_matches(request, tournament_id):
    try:
        tournament = Tournament.objects.get(id=tournament_id)
        matches = tournament.match_set.all()
        match_list = [{'id': match.id, 'player_a': match.player_a, 'player_b': match.player_b} for match in matches]
        return JsonResponse({'tournament': tournament.id, 'matches': match_list}, status=200)
    except ObjectDoesNotExist:
        return JsonResponse({'error': 'Tournament not found.'}, status=404)

def update_match_result(request, tournament_id, match_id):
    if request.method == 'POST':
        try:
            match = Match.objects.get(id=match_id)
            if match.tournament.organizer != request.user.accounts:
                return JsonResponse({'error': 'You are not authorized to update this match result.'}, status=403)

            winner_id = request.POST.get('winner')
            if winner_id:
                winner = match.tournament.subscriptions.get(id=winner_id)
                match.winner = winner
                match.save()

            return JsonResponse({'message': 'Match result updated successfully.'}, status=200)
        except ObjectDoesNotExist:
            return JsonResponse({'error': 'Match not found.'}, status=404)
