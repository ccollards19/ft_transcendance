def generate_match_pairs(tournament):
    # Récupérer les participants inscrits au tournoi
    participants = list(tournament.subscriptions.all())

    # Tirage aléatoire des paires de joueurs pour les premiers matchs
    shuffle(participants)

    # Générer les paires pour les matchs initiaux
    match_pairs = []
    for i in range(0, len(participants), 2):
        match_pairs.append((participants[i], participants[i+1]))

    return match_pairs

def generate_next_round_match_pairs(tournament):
    #check si tous les rounds sont finis avant
    
    # Récupérer les joueurs ayant remporté leur dernier match
    winners = []
    matches = tournament.match_set.all()
    for match in matches:
        if match.winner is not None:
            winners.append(match.winner)

    # Générer les paires pour les matchs suivants
    match_pairs = []
    for i in range(0, len(winners), 2):
        match_pairs.append((winners[i], winners[i+1]))

    return match_pairs
