# class TournamentSerializer:
#     def __init__(self, instance):
#         self.instance = instance
#     def data(self):
#         try:
#             players_data1 = ProfileSerializer(self.instance.player1).data()
#             players_data2 = ProfileSerializer(self.instance.player2).data()
#         except:
#             players_data1 = None
#             players_data2 = None
#         game_data = GameSerializer(self.instance.game).data()
#         id = self.instance.id
#         spectate = self.instance.spectate

#         return {
#             'id': id,
#             'player1': players_data1,
#             'player2': players_data2,
#             'game': game_data,
#             'spectate' : spectate
#         }