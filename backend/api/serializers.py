from rest_framework import serializers
from api.models import user, match, tournament


class user_serializer(serializers.ModelSerializer):
    class Meta:
        model = user
        fields = '__all__'

class match_serializer(serializers.ModelSerializer):
    class Meta:
        model = match
        fields = '__all__'

class tournament_serializer(serializers.ModelSerializer):
    class Meta:
        model = tournament
        fields = '__all__'

def get_friends(pk):
    #get list of friends
    #serialized those friends
    return (friends_list)

class profile_serializer(serializers.ModelSerializer):
    friends_list = get_friends(pk)
    class Meta:
        model = user
        fields = ['__all__', 'friends_list']

