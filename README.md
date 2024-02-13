PROPOSITION : COMMENT FONCTIONNE LE SITE

Données nécessaires dans chaque profil :

- Un id
- Un nom à afficher chaque fois que c'est pertinent (profil, chat, match, liste d'amis)
- Une url vers un fichier image qui sert d'avatar (Il va falloir choisir si on stocke les fichiers envoyés par les joueurs ou si on propose une liste d'avatars prédéfinis)
- Une catchphrase et une bio pour la page profil
- Une sous-section par jeu proposé par le site, chacune comprenant :
    - Un rank (soit un nombre, soit un nom, soit une url vers l'icône correspondante) - Voir système ELO
    - Le nombre de parties jouées/gagnées/perdues en mode ranked
- Une liste d'id correspondant aux amis
- Une liste de défis lancés par d'autres joueurs pour le jeu auquel le joueur connecté a choisi de jouer dans les settings
    - Cette liste reprend le nom et l'avatar de chaque joueur souhaitant affronter le joueur connecté
- Une liste des tournois auxquels le joueur est inscrit, pour tous les jeux

Fonctionnement des défis :

- Il est possible de défier un joueur via les menus dans le chat ou la liste d'amis
- Si un joueur ayant lancé un défi s'est déconnecté entre temps, son défi est annulé et retiré de la liste
- Un bouton permet de répondre au défi
- Si le joueur ayant lancé le défi est occupé à jouer un match contre quelqu'un d'autre, le bouton est modifié :
    - Si les deux joueurs qui s'affrontent ont permis les spectateurs, le bouton permet d'assister au match
    - Si au moins un des deux joueurs a refusé les spectateurs, le bouton est désactivé
    - Dans les 2 cas, le texte du bouton est modifié
- Un autre bouton permet de refuser le défi. Dans ce cas le défi est annulé et retiré de la liste
- La liste des défis en attente est affichée sur la page 'Play', si le joueur est connecté et a choisi de jouer en ligne
- Si un joueur a choisi de jouer offline ou a décoché la case 'challenged' dans les settings, il n'est pas possible de lui lancer un défi
- Si au moins un défi est disponible, une pastille rouge est affichée à côté du bouton play dans la barre de navigation principale du site (et aussi à côté du menu burger sur plus petit écran)

Les tournois : 

- A tout moment, un joueur peut organiser un tournoi
- Il devra choisir le nom du tournoi, le nombre maximum de participants, le jeu concerné, le temps d'attente éventuel avant un forfait
- Son tournoi viendra alors grossir la liste des tournois en cours, accessible via un bouton dans la barre de navigation principale du site
- Pour participer à un tournoi, un joueur doit être connecté. S'il ne l'est pas, il peut tout de même assister à un match en tant que spectateur (les spectateurs sont autorisés d'office pour les tournois)
- Un tournoi commence lorsqu'il est complet
- Les joueurs sont avertis lorsqu'ils sont censés jouer un match par une pastille verte à côté du bouton 'play' dans la barre de navigation principale du site (et aussi à côté du menu burger sur plus petit écran)
- Si l'organisateur du tournoi a établi une limite de temps avant un forfait, un joueur censé jouer un match et qui ne se présente pas avant cette limite de temps est éliminé du tournoi
- Si deux joueurs devant s'affronter perdent par forfait, le forfait est reporté sur le match suivant s'il y en a un. Il est donc possible de gagner un tournoi en ne disputant aucun match
- Les tournois ont leur propre classement interne, qui n'influe pas sur le score général des participants (afin d'éviter la triche)

Règles particulières : 

- Si le visiteur du site n'est pas connecté ou s'il est connecté et a choisi de jouer offline, l'affichage de la page 'play' est modifié
    - La page permet alors à 2 joueurs de s'affronter sur le même écran, en partageant le clavier
    - Chaque moitié de la page permet à un joueur de se connecter pour la partie à venir (il ne s'agit donc pas d'une connection au site) ou de jouer en tant qu'invité
    - Un match contre un joueur invité n'est pas comptabilisé dans le score du joueur connecté (afin d'éviter qu'un joueur ne puisse tricher en jouant seul)