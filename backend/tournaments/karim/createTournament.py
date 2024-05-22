from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Tournament

@csrf_exempt
def create_tournament(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            tournament = Tournament.objects.create(
                game=data['game'],
                organizer_id=data['organizerId'],
                title=data['title'],
                picture=data['picture'],
                background=data.get('background', None),
                max_contenders=data['maxContenders']
            )
            return JsonResponse({'id': tournament.id}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)