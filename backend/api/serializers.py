from api.models import user

def make_profile_payload(user_instance):
    data = {}
    data["id"] = user_instance.id 
    data["avatar"] = user_instance.avatar
    data["name"] = "Monkey D. Luffy"
    data["status"] = "online"
    data["tournaments"] = [1]
    data["subscriptions"] = [2]
    data["match"] = 0
    data["friends"] = [3, 4, 5, 6, 7, 8, 9, 10, 11],
    data["muted"] = []
    data["catchphrase"] = "Le Roi des Pirates, ce sera moi !"
    data["bio"] = "Monkey D. Luffy est un pirate et le principal protagoniste du manga et anime One Piece. Luffy est le fils du chef de l'Armée Révolutionnaire, Monkey D. Dragon, le petit-fils du célèbre héros de la Marine, Monkey D. Garp, le fils adoptif d'une bandit des montagnes, Curly Dadan ainsi que le frère adoptif du défunt Portgas D. Ace et de Sabo. "
    pong = {}
    pong["rank"] = "pirate-symbol-mark-svgrepo-com.svg"
    pong["matches"] = 258
    pong["wins"] = 0
    pong["loses"] = 258
    pong["challengers"] = [2, 3, 4]
    pong["challenged"] = [5, 6, 7, 8, 9]
    data["pong"] = pong
    chess = {}
    chess["rank"] = "pirate-symbol-mark-svgrepo-com.svg"
    chess["matches"] = 258
    chess["wins"] = 0
    chess["loses"] = 258
    chess["challengers"] = [10, 11, 12]
    chess["challenged"] = [2, 13, 14, 15]
    data["chess"] = chess
    payload = {}
    payload["profile"] = data
    return payload

# def make_profile_payload(user_instance):
#     data = {}
#     data["avatar"] = "luffy.jpeg"
#     data["id"] = 1
#     data["name"] = "Monkey D. Luffy"
#     data["status"] = "online"
#     data["tournaments"] = [1]
#     data["subscriptions"] = [2]
#     data["match"] = 0
#     data["friends"] = [3, 4, 5, 6, 7, 8, 9, 10, 11],
#     data["muted"] = []
#     data["catchphrase"] = "Le Roi des Pirates, ce sera moi !"
#     data["bio"] = "Monkey D. Luffy est un pirate et le principal protagoniste du manga et anime One Piece. Luffy est le fils du chef de l'Armée Révolutionnaire, Monkey D. Dragon, le petit-fils du célèbre héros de la Marine, Monkey D. Garp, le fils adoptif d'une bandit des montagnes, Curly Dadan ainsi que le frère adoptif du défunt Portgas D. Ace et de Sabo. "
#     pong = {}
#     pong["rank"] = "pirate-symbol-mark-svgrepo-com.svg"
#     pong["matches"] = 258
#     pong["wins"] = 0
#     pong["loses"] = 258
#     pong["challengers"] = [2, 3, 4]
#     pong["challenged"] = [5, 6, 7, 8, 9]
#     data["pong"] = pong
#     chess = {}
#     chess["rank"] = "pirate-symbol-mark-svgrepo-com.svg"
#     chess["matches"] = 258
#     chess["wins"] = 0
#     chess["loses"] = 258
#     chess["challengers"] = [10, 11, 12]
#     chess["challenged"] = [2, 13, 14, 15]
#     data["chess"] = chess
#     payload = {}
#     payload["profile"] = data
#     return payload
