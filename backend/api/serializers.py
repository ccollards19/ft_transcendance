from rest_framework import serializers
from api.models import user, match, tournament


class user_serializer(serializers.ModelSerializer):
    class Meta:
        model = user
        fields = ['username']

class match_serializer(serializers.ModelSerializer):
    class Meta:
        model = match
        fields = ['game']

class tournament_serializer(serializers.ModelSerializer):
    class Meta:
        model = tournament
        fields = ['title']

