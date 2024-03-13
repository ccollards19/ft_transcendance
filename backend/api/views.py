from rest_framework import permissions, viewsets
from api.models import user, match, tournament
from api.serializers import user_serializer, match_serializer, tournament_serializer
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET"])
def initial_json(request):
    data = { 
            "myProfile" : {
                "avatar" : "luffy.jpeg",
                "id" : 1,
                "name" :"Monkey D. Luffy",
                "status" : "online",
                "match" : 0,
                "game" : "pong",
                "pong" : {
                    "rank" : "pirate-symbol-mark-svgrepo-com.svg",
                    "matches" : 258,
                    "wins" : 0,
                    "loses" : 258,
                    "challengers" : [2, 3, 4],
                    "challenged" : [5, 6, 7, 8, 9],
                    "tournaments" : [0],
                    "subscriptions" : [0]
                    },
                "chess" : {
                    "rank" : "pirate-symbol-mark-svgrepo-com.svg",
                    "matches" : 258,
                    "wins" : 0,
                    "loses" : 258,
                    "challengers" : [10, 11, 12],
                    "challenged" : [13, 14, 15],
                    "tournaments" : [0],
                    "subscriptions" : [0]
                    },    
                "queue" : 10,
                "device" : "keyboard",
                "scope" : "remote",
                "gameType" : "ranked",
                "challengeable" : True,
                "spectate" : True,
                "friends" : [3, 4, 5, 6, 7, 8, 9, 10, 11],
                "catchphrase" : "Le Roi des Pirates, ce sera moi !",
                "bio" : "Monkey D. Luffy est un pirate et le principal protagoniste du manga et anime One Piece. Luffy est le fils du chef de l'Armée Révolutionnaire, Monkey D. Dragon, le petit-fils du célèbre héros de la Marine, Monkey D. Garp, le fils adoptif d'une bandit des montagnes, Curly Dadan ainsi que le frère adoptif du défunt Portgas D. Ace et de Sabo."
                },
            "challengers" : [
                {
                    "avatar" : "law.jpg",
                    "id" : 2,
                    "name" : "Trafalgar Law",
                    "match" : 1
                    },
                {
                    "avatar" : "zoro.jpeg",
                    "id" : 3,
                    "name" : "Roronoa Zoro",
                    "match" : 0
                    },
                {
                    "avatar" : "sanji.jpg",
                    "id" : 4,
                    "name" : "Vinsmoke Sanji",
                    "match" : 0
                    }
                ],
    "challenged" : [
            {
                "avatar" : "nami.jpeg",
                "id" : 5,
                "name" : "Nami",
                "status" : "online"
                },
            {
                "avatar" : "chopper.png",
                "id" : 6,
                "name" : "Tony Tony Chopper",
                "status" : "offline"
                },
            {
                "avatar" : "usopp.jpeg",
                "id" : 7,
                "name" : "Usopp",
                "status" : "offline"
                }
            ],
    "ladder" : [
            {
                "avatar" : "nojiko.jpeg",
                "id" : 16,
                "name" : "Nojiko",
                "pong" : 
                {
                    "matches" : 511,
                    "wins" : 299,
                    "loses" : 212,
                    "level" : 12
                    },
                "chess" : 
                {
                    "matches" : 511,
                    "wins" : 299,
                    "loses" : 212,
                    "level" : 12
                    }
                },
            {
                "avatar" : "kureha.jpg",
                "id" : 17,
                "name" : "Kureha",
                "pong" : 
                {
                    "matches" : 511,
                    "wins" : 299,
                    "loses" : 212,
                    "level" : 12
                    },
                "chess" : 
                {
                    "matches" : 511,
                    "wins" : 299,
                    "loses" : 212,
                    "level" : 12
                    }
                },
            {
                "avatar" : "gaimon.jpeg",
                "id" : 18,
                "name" : "Gaimon",
                "pong" :
                {
                    "matches" : 511,
                    "wins" : 299,
                    "loses" : 212,
                    "level" : 12
                    },
                "chess" : 
                {
                    "matches" : 511,
                    "wins" : 299,
                    "loses" : 212,
                    "level" : 12
                    }
                }
    ],
    "tournaments" : [
            {
                "id" : 0,
                "organizerId" : 1,
                "picture" : "davy_back_fight.jpeg",
                "title" : "Davy back fight",
                "winnerId" : 0,
                "reasonForNoWinner" : ""
                },
            {
                "id" : 0,
                "organizerId" : 1,
                "picture" : "davy_back_fight.jpeg",
                "title" : "Davy back fight",
                "winnerId" : 1,
                "reasonForNoWinner" : ""
                },
            {
                "id" : 0,
                "organizerId" : 1,
                "picture" : "davy_back_fight.jpeg",
                "title" : "Davy back fight",
                "winnerId" : 1,
                "reasonForNoWinner" : ""
                },
            {
                "id" : 0,
                "organizerId" : 1,
                "picture" : "davy_back_fight.jpeg",
                "title" : "Davy back fight",
                "winnerId" : 1,
                "reasonForNoWinner" : ""
                },
            {
                "id" : 0,
                "organizerId" : 1,
                "picture" : "davy_back_fight.jpeg",
                "title" : "Davy back fight",
                "winnerId" : 1,
                "reasonForNoWinner" : ""
                },
            {
                "id" : 0,
                "organizerId" : 1,
                "picture" : "davy_back_fight.jpeg",
                "title" : "Davy back fight",
                "winnerId" : 1,
                "reasonForNoWinner" : ""
                },
            {
                "id" : 0,
                "organizerId" : 1,
                "picture" : "davy_back_fight.jpeg",
                "title" : "Davy back fight",
                "winnerId" : 0,
                "reasonForNoWinner" : ""
                },
        {
                "id" : 0,
                "organizerId" : 1,
                "picture" : "davy_back_fight.jpeg",
                "title" : "Davy back fight",
                "winnerId" : 0,
                "reasonForNoWinner" : ""
                }
    ]
    }
    return JsonResponse(data)

class user_viewset(viewsets.ModelViewSet):
    queryset = user.objects.all()
    serializer_class = user_serializer
    # permission_classes = [permissions.IsAuthenticated]

class match_viewset(viewsets.ModelViewSet):
    queryset = match.objects.all()
    serializer_class = match_serializer
    # permission_classes = [permissions.IsAuthenticAted]

class tournament_viewset(viewsets.ModelViewSet):
    queryset = tournament.objects.all()
    serializer_class = tournament_serializer
    # permission_classes = [permissions.IsAuthenticated]

