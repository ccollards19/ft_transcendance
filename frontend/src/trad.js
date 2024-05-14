export function getLanguages() {
    return {en : English(), fr : French(), de : Deutsch()}
}

function English() {
    return {
        menu1 : 'Login',
        menu2 : 'Logout',
        menu3 : 'Settings',
        menu4 : 'Profile',
        menu5 : 'Play',
        menu6 : 'Leaderboard',
        menu7 : 'Tournaments',
        menu8 : 'About',
        chess : 'Chess',
        aboutTitle : 'About this project',
        about1 : 'This is ft_transcendence, the final project of 19\'s common core.',
        about2 : 'The goal is to make a Single Page Application (SPA) designed to let players confront each other in Pong !',
        about3 : 'Some modules were added to that basis :',
        module1 : 'Bootstrap and React were used to make the frontend',
        module2 : 'Django was used to make the backend',
        module3 : 'The games are handled by the server (API) (Except for local matches)',
        module4 : 'The website is linked to a database, so we don\'t lose anything when we shut it down (except for the chat, which is session dependant)',
        module5 : 'Another game is available (Chess)',
        module6 : 'The chat',
        module7 : 'You may play against a remote player, you don\'t HAVE to share a keyboard',
        module8 : 'You may visit the website on (nearly) any browser',
        module9 : 'You may visit the website on any screen size',
        module10 : 'You may create an account, manage your profile, add people as friends and some other social features',
        module11 : 'The website is available in English, French and Deutsch',
        about4 : 'The team is composed of :',
        question1 : 'What\'s the difference between muted and blocked users ?',
        answer1_1 : 'Mute will only prevent a specific user\'s messages to be displayed in your chat. It is session dependant, meaning if you reload the page, all muted users will be displayed again.',
        answer1_2 : 'Blocking a user also shuts him down in the chat but not only. He will leave your friendlist if he was in it and won\'t be allowed to send you another friend request or challenge you. And he will stay blocked over a logout / login or reaload on your part.',
        question2 : 'Why can\'t I challenge some of my friends ?',
        answer2 : 'They probably unchecked the \'Challengeable\' option in their settings, meaning they are here to chat or watch games but not to play themselves.',
        question3 : 'Why can\'t I watch some of my friend\'s matches ?',
        answer3 : 'At least one of the two contenders unchecked the \'Allow spectators ?\' option, making the match private.',
        question4 : 'Sometimes, I get a never-ending loading screen. Why?',
        answer4 : 'That means the server has encountered a problem and you are not connected. That means you cannot access most of the website\'s pages. Please try again later. The chat runs on the same service, so it is inaccessible as well.',
        question5 : 'I got the guy from Jurassic park telling me I didn\'t say the magic word. You think you\'re funny ?',
        answer5 : 'Yes, of course. And it happened because you tried to access an forbidden url. You think you\'re clever ?',
        question6 : 'A friend sent me that url...',
        answer6 : 'Choose better friends...',
        unknownCommand : 'Unknown command',
        wrongCommand : 'Wrong command. Use : ',
        wrongWhisp : 'Wrong command. Use : /w "[username]" [message]',
        delete1 : 'Are you sure ?',
        delete2 : 'Sure, sure, sure ?',
        deleted : 'Your account has been deleted',
        chatOut : 'Log in to chat',
        chatIn : 'Say something nice',
        seeProfile : 'See profile',
        addFriend : 'Add to friendlist',
        removeFriend : 'Remove from friendlist',
        block : 'Block',
        unblock : 'Unblock',
        mute : 'Mute',
        unMute : 'Unmute',
        dm : 'Direct message',
        challenge : 'Challenge to ',
        muteList1 : 'List of muted users :',
        muteList2 : 'You didn\'t mute anyone',
        blockList1 : 'List of blocked users :',
        blockList2 : 'You didn\'t block anyone',
        welcome1 : 'Welcome on the chan ',
        welcome2 : 'Type /h for help',
        blocked : 'This user blocked you',
        taken : 'This username is already taken',
        requested : 'You already sent a friend request to this user',
        helpWhisp : '/w "[username]" [message] to send a direct message',
        helpMute : '/m to display a list of muted users',
        helpBlock : '/b to display a list of blocked users',
        help : '/h to display this help again',
        home1 : 'Welcome !!!',
        home2 : 'Fancy a game of pong ?',
        home3 : 'How to use :',
        home4 : 'First, you need to',
        home5 : 'login',
        home6 : 'if you already have an account.',
        home7 : 'Or',
        home8 : 'create a new account',
        home9 : '(You may also visit the website, and even play locally, without an account.)',
        home10 : 'Once you\'re in, take all your sweet time to complete your profile.',
        home11 : 'That\'s also where you will find a list of the users you added as friends.',
        home12 : 'Then, take a look at the \'Settings\' page and adjust things to your liking.',
        home13 : 'Note : Uncheck \'Challengeable\' if you are here only to chat and watch other player\'s matches.',
        home14 : 'The game you choose to play today affects everything game-related everywhere on the website.',
        home15 : 'That includes the background, the profiles display, the leaderboard, the tournaments list and whatever is displayed on the \'Play\' page if you chose to play remotely.',
        home16 : 'You will find a chat, on the left or behind a button on the bottom right, depending on the width of your screen. You need to be connected to use it.',
        home17 : 'You may use it to speak with everyone who\'s connected to the website via the default \'General\' channel.',
        home18 : 'A unique channel is created for each match, for the exclusive use of contenders and potential viewers (if you allowed them in the settings).',
        home19 : 'Each tournament has its own chat too.',
        home20 : 'You may also click on any nickname (except yours) to display a small menu filled with self-explanatory options.',
        home21 : 'On the \'Leaderboard\' page, you will find the top [up to] 50 players, ranked by the ELO system, for the game you chose to display.',
        home22 : 'Finally, the \'About\' page will give you informations about this project.',
        home23 : 'At any time, you can display this manual by clicking on the \'Home\' button, top right of the screen.',
        tip : 'Tip : Click on an avatar to see the player\'s profile',
        name : 'Name',
        wins : 'Wins',
        losses : 'Losses',
        login : 'Please login',
        password : 'Password',
        wrongForm : 'Wrong address or password',
        log : 'Login',
        sub1 : 'If you don\'t have an account, you may',
        sub2 : 'subscribe here',
        noPage : 'This page does not exist. Please check url and try again.',
        letsPlay : 'Let\'s play',
        whatGame : 'What game will you play ?'
    }
}

function French() {
    return {
        menu1 : 'Connexion',
        menu2 : 'Déconnexion',
        menu3 : 'Paramètres',
        menu4 : 'Profil',
        menu5 : 'Jouer',
        menu6 : 'Top 50',
        menu7 : 'Tournois',
        menu8 : 'A propos',
        chess : 'Echecs',
        aboutTitle : 'A propos de ce projet',
        about1 : 'Ceci est ft_transcendence, le dernier projet du tronc commun de l\'école 19.',
        about2 : 'L\'objectif est de réaliser une Single Page Application (SPA) permettant aux visiteurs de s\'affronter dans des parties de Pong !',
        about3 : 'Quelques modules ont été ajoutés à cette base :',
        module1 : 'Bootstrap et React ont servi à réaliser l\'interface',
        module2 : 'Django a servi à réaliser le back-end',
        module3 : 'Les jeux sont gérés par le serveur (API) (Sauf les parties en mode \'local\')',
        module4 : 'Le site est lié à une base de données, ce qui nous permet de tout conserver lors d\'un éventuel redémarrage (sauf le chat, qui est lié à la session courante)',
        module5 : 'Un autre jeu est disponible (échecs)',
        module6 : 'Le chat',
        module7 : 'Vous pouvez jouer en ligne, vous n\'êtes pas obligé de partager le clavier',
        module8 : 'Vous pouvez visiter le site avec (presque) n\'importe quel navigateur',
        module9 : 'Le site s\'adapte à la taille de votre écran',
        module10 : 'Vous pouvez créer un compte, gérer votre profil, ajouter d\'autres joueurs à votre liste d\'amis et bien d\'autres options sociales',
        module11 : 'Le site est disponible en anglais, français et allemand',
        about4 : 'L\'équipe est composée de :',
        question1 : 'Quelle est la différence entre un \'bloquer\' et \'rendre muet\' ?',
        answer1_1 : '\'Rendre muet\' vous empêchera de voir les messages envoyés par l\'utilisateur dans votre chat. C\'est un statut lié à la session courante. Cela signifie que si vous rechargez la page, ses messages apparaîtront de nouveau.',
        answer1_2 : '\'Bloquer\' fait également disparaître l\'utilisateur de votre chat, mais pas seulement. Il quittera votre liste d\'amis s\'il en faisait partie et ne pourra plus vous envoyer de requêtes d\'amis ni d\'invitations à jouer. Il restera également bloqué à votre prochaine connexion ou si vous rechargez la page.',
        question2 : 'Pourquoi ne puis-je parfois pas inviter un de mes amis à jouer avec moi ?',
        answer2 : 'Il est possible qu\'il ait décoché la case \'Défiable\' dans ses paramètres. Cela signifie qu\'il n\'est probablement là que pour regarder les matches d\'autres joueurs ou pour chatter.',
        question3 : 'Pourquoi ne puis-je pas assister aux matches de certains de mes amis ?',
        answer3 : 'Si au moins un des deux adversaires d\'un match a décoché la case \'Autoriser les spectateurs\' dans ses paramètres, le match est privé.',
        question4 : 'Parfois, le site reste bloqué sur l\'image d\'un escargot qui me dit qu\'un chargement est en cours. Pourquoi ?',
        answer4 : 'Cela signifie que le serveur a rencontré un problème et que vous n\'êtes pas connecté. Vous n\'avez alors pas accès à la plupart des pages du site. Veuillez réessayer plus tard. Le chat est dépendant du même service et est donc inutilisable également.',
        question5 : 'Le mec de Jurassic Park m\'a dit que je n\'avais pas dit le mot magique. Vous vous croyez drôle ?',
        answer5 : 'Oui, évidemment. Et c\'est arrivé parce que vous avez tenté d\'accéder à une url non-autorisée. Vous vous croyez malin ?',
        question6 : 'Un ami m\'a envoyé cette url...',
        answer6 : 'Choisissez de meilleurs amis...',
        unknownCommand : 'Commande inconnue',
        wrongCommand : 'Commande incorrecte. Usage : ',
        wrongWhisp : 'Commande incorrecte. Usage : : /w "[nom]" [message]',
        delete1 : 'Vous êtes sûr ?',
        delete2 : 'Sûr, sûr, sûr ?',
        deleted : 'Votre compte a été supprimé',
        chatOut : 'Connectez-vous pour parler',
        chatIn : 'Dites un truc sympa',
        seeProfile : 'Voir le profil',
        addFriend : 'Ajouter à ma liste d\'amis',
        removeFriend : 'Retirer de ma liste d\'amis',
        block : 'Bloquer',
        unblock : 'Débloquer',
        mute : 'Rendre muet',
        unMute : 'Rendre visible',
        dm : 'Message privé',
        challenge : 'Inviter à jouer à ',
        muteList1 : 'Liste des utilisateurs rendus muets :',
        muteList2 : 'Vous n\'avez rendu personne muet',
        blockList1 : 'Liste des utilisateurs bloqués :',
        blockList2 : 'Vous n\'avez bloqué personne',
        welcome1 : 'Bienvenue sur le canal ',
        welcome2 : 'Saisissez /h pour obtenir de l\'aide',
        blocked : 'Cet utilisateur vous a bloqué',
        taken : 'Ce nom est déjà utilisé',
        requested : 'Vous avez déjà envoyé une requête à cet utilisateur',
        helpWhisp : '/w "[nom]" [message] pour envoyer un message privé',
        helpMute : '/m pour afficher une liste des utilisateurs rendus muets',
        helpBlock : '/b pour afficher une liste des utilisateurs bloqués',
        help : '/h pour afficher cette aide à nouveau',
        home1 : 'Bienvenue !!!',
        home2 : 'Une petite partie de Pong ?',
        home3 : 'Utilisation du site :',
        home4 : 'D\'abord il faut',
        home5 : 'vous connecter',
        home6 : 'si vous avez déjà un compte.',
        home7 : 'Ou',
        home8 : 'créer un nouveau compte',
        home9 : '(Vous pouvez aussi visiter le site, et mêne jouer localement, sans compte.)',
        home10 : 'Une fois inscrit et connecté, prenez le temps de compléter votre profil.',
        home11 : 'C\'est là que vous triouverez la liste de vos amis.',
        home12 : 'Ensuite, jeter un oeil à la page \'Paramètres\' et configurez les choses à votre convenance.',
        home13 : 'Note : Décochez \'Défiable\' si vous n\'êtes là que pour discuter et regarder les matches des autres.',
        home14 : 'Le jeu auquel vous choisissez de jouer aujourd\'hui a une influence sur l\'affichage un peu partout sur le site.',
        home15 : 'Cela inclut l\'arrière-plan, les profils, le Top 50, la liste des tournois et ce qui sera affiché sur la page \'Jouer\' si vous choisissez de jouer en ligne.',
        home16 : 'Vous trouverez un chat, sur la gauche ou affichable à l\'aide d\'un bouton en bas à droite, selon la taille de votre écran. Vous devez être connecté pour l\'utiliser.',
        home17 : 'Vous pouvez l\'utiliser pour discuter avec tous les utilisateurs connectés au site grâce au cana \'General\'.',
        home18 : 'Un canal unique est créé pour chaque match, pour l\'usage exclusif des joueurs et éventuels spectateurs (si vous les autorisez dans les paramètres).',
        home19 : 'Chaque tournoi a également son propre canal.',
        home20 : 'Vous pouvez aussi cliquer sur n\'importe quel nom (sauf le vôtre) pour afficher un petit menu contenant des options explicites.',
        home21 : 'Sur la page \'Top 50\', vous trouverez une liste des [jusqu\'à 50] meilleurs joueurs, classé selon le système ELO, pour le jeu que vous choisirez d\'afficher.',
        home22 : 'Enfin, la page \'A propos\' vous donnera des informations sur le projet.',
        home23 : 'A tout moment, vous pouvez afficher ce manuel en cliquant sur le bouton \'Home\' en haut à droite de l\'écran.',
        tip : 'Astuce : Cliquez sur un avatar pour voir le profil du joueur',
        name : 'Nom',
        wins : 'Victoires',
        losses : 'Défaites',
        login : 'Veuillez vous connecter',
        password : 'Mot de passe',
        wrongForm : 'Adresse ou mot de passe incorrect(e)',
        log : 'Connexion',
        sub1 : 'Si vous n\'avez pas de compte, vous pouvez',
        sub2 : 'en créer un ici',
        noPage : 'Cette page n\'existe pas. Vérifiez l\'adresse et réessayez.',
        letsPlay : 'Jouons',
        whatGame : 'A quel jeu allez-vous jouer ?'
    }
}

function Deutsch() {
    return {
        menu1 : 'Verbindung',
        menu2 : 'Trennung',
        menu3 : 'Einstellungen',
        menu4 : 'Profil',
        menu5 : 'Spielen',
        menu6 : 'Bestenliste',
        menu7 : 'Turniere',
        menu8 : 'Um',
        chess : 'Schach',
        aboutTitle : 'Über dieses Projekt',
        about1 : 'Das ist ft_transcendence, das neueste Projekt des gemeinsamen Kerns der Schule 19.',
        about2 : 'Das Ziel besteht darin, eine Single Page Application (SPA) zu erstellen, die es Besuchern ermöglicht, an Pong-Spielen teilzunehmen!',
        about3 : 'Einige Module wurden dieser Datenbank hinzugefügt :',
        module1 : 'Zur Erstellung der Schnittstelle wurden Bootstrap und React verwendet',
        module2 : 'Django wurde verwendet, um das Backend zu erstellen',
        module3 : 'Die Spiele werden vom Server (API) verwaltet (außer Spiele im „lokalen“ Modus)',
        module4 : 'Die Seite ist mit einer Datenbank verknüpft, die es uns ermöglicht, bei einem möglichen Neustart alles beizubehalten (mit Ausnahme des Chats, der mit der aktuellen Sitzung verknüpft ist).',
        module5 : 'Ein weiteres Spiel ist verfügbar (Schach)',
        module6 : 'Der Plausch',
        module7 : 'Sie können online spielen, Sie müssen die Tastatur nicht teilen',
        module8 : 'Sie können die Seite mit (fast) jedem Browser besuchen',
        module9 : 'Die Seite passt sich der Größe Ihres Bildschirms an',
        module10 : 'Sie können ein Konto erstellen, Ihr Profil verwalten, andere Spieler zu Ihrer Freundesliste hinzufügen und viele andere soziale Optionen nutzen',
        module11 : 'Die Website ist auf Englisch, Französisch und Deutsch verfügbar',
        about4 : 'Das Team besteht aus :',
        question1 : 'Was ist der Unterschied zwischen „blockieren“ und „stumm“?',
        answer1_1 : '„Rendew mute“ verhindert, dass Sie vom Benutzer gesendete Nachrichten in Ihrem Chat sehen. Dies ist ein Status, der mit der aktuellen Sitzung verknüpft ist. Das heißt, wenn Sie die Seite neu laden, werden deren Meldungen erneut angezeigt.',
        answer1_2 : '„Blockieren“ entfernt den Benutzer auch aus Ihrem Chat, aber nicht nur das. Er verlässt Ihre Freundesliste, wenn er dort war, und kann Ihnen keine Freundschaftsanfragen oder Spieleinladungen mehr senden. Es bleibt auch beim nächsten Anmelden oder Neuladen der Seite gesperrt.',
        question2 : 'Warum kann ich manchmal einen meiner Freunde nicht einladen, mit mir zu spielen ?',
        answer2 : 'Es ist möglich, dass er in seinen Einstellungen das Kontrollkästchen „Herausfordernd“ deaktiviert hat. Das bedeutet, dass er wahrscheinlich nur da ist, um sich die Spiele anderer Spieler anzusehen oder um zu chatten.',
        question3 : 'Warum kann ich einigen Spielen meiner Freunde nicht beiwohnen ?',
        answer3 : 'Wenn mindestens einer der beiden Gegner in einem Match in seinen Einstellungen das Kontrollkästchen „Zuschauer zulassen“ deaktiviert hat, ist das Match privat.',
        question4 : 'Manchmal bleibt die Seite beim Bild einer Schnecke hängen, was mir anzeigt, dass der Ladevorgang läuft. Wofür ?',
        answer4 : 'Das bedeutet, dass beim Server ein Problem aufgetreten ist und Sie nicht verbunden sind. Dies bedeutet, dass Sie auf die meisten Seiten der Website keinen Zugriff haben. Bitte versuchen Sie es später noch einmal. Der Chat ist auf denselben Dienst angewiesen und daher ebenfalls unbrauchbar.',
        question5 : 'Der Typ aus Jurassic Park sagte mir, ich hätte das Zauberwort nicht gesagt. Findest du dich lustig?',
        answer5 : 'Ja natürlich. Und es geschah, weil Sie versucht haben, auf eine nicht autorisierte URL zuzugreifen. Glaubst du, du bist schlau?',
        question6 : 'Ein Freund hat mir diese URL geschickt...',
        answer6 : 'Wähle bessere Freunde ...',
        unknownCommand : 'Unbekannter Befehl',
        wrongCommand : 'Falsche Reihenfolge. Verwenden : ',
        wrongWhisp : 'Falsche Reihenfolge. Verwenden : /w "[name]" [nachricht]',
        delete1 : 'Bist du sicher ?',
        delete2 : 'Sicher, sicher, sicher ?',
        deleted : 'Dein Account wurde gelöscht',
        chatOut : 'Melden Sie sich an, um zu sprechen',
        chatIn : 'Sag etwas Nettes',
        seeProfile : 'Profil anzeigen',
        addFriend : 'Befreunde dich',
        removeFriend : 'Unfreundlich',
        block : 'Blockieren',
        unblock : 'Entsperren',
        mute : 'Stumm',
        unMute : 'sichtbar machen',
        dm : 'Private Nachricht',
        challenge : 'Zum Spielen einladen ',
        muteList1 : 'Liste der zum Schweigen gebrachten Benutzer :',
        muteList2 : 'Du hast niemanden stumm gemacht',
        blockList1 : 'Liste der blockierten Benutzer :',
        blockList2 : 'Sie haben niemanden blockiert',
        welcome1 : 'Willkommen auf dem Kanal ',
        welcome2 : 'Geben Sie /h ein, um Hilfe zu erhalten',
        blocked : 'Dieser Benutzer hat Sie blockiert',
        taken : 'Dieser Name wird bereits verwendet',
        requested : 'Sie haben bereits eine Anfrage an diesen Benutzer gesendet',
        helpWhisp : '/w „[Name]“ [Nachricht] um eine private Nachricht zu senden',
        helpMute : '/m um eine Liste der stummgeschalteten Benutzer anzuzeigen',
        helpBlock : '/b um eine Liste der blockierten Benutzer anzuzeigen',
        help : '/h um diese Hilfe erneut anzuzeigen',
        home1 : 'Willkommen !!!',
        home2 : 'Eine kleine Partie Pong?',
        home3 : 'Nutzung der Website :',
        home4 : 'Zuerst müssen Sie',
        home5 : 'Anmeldung',
        home6 : 'wenn Sie bereits ein Konto haben.',
        home7 : 'Oder',
        home8 : 'ein neues Konto erstellen',
        home9 : '(Sie können die Website auch besuchen und sogar lokal spielen, ohne ein Konto zu benötigen.)',
        home10 : 'Nehmen Sie sich nach der Registrierung und Anmeldung die Zeit, Ihr Profil zu vervollständigen.',
        home11 : 'Hier finden Sie die Liste Ihrer Freunde.',
        home12 : 'Schauen Sie sich als Nächstes die Seite „Einstellungen“ an und konfigurieren Sie die Dinge nach Ihren Wünschen.',
        home13 : 'Hinweis: Deaktivieren Sie „Herausfordernd“, wenn Sie nur dort sind, um zu chatten und die Spiele anderer Leute anzusehen.',
        home14 : 'Das Spiel, das Sie heute spielen, beeinflusst die Anzeige auf der Website.',
        home15 : 'Dazu gehören Hintergrund, Profile, Top 50, Turnierliste und was auf der Seite „Spielen“ angezeigt wird, wenn Sie sich für das Online-Spielen entscheiden.',
        home16 : 'Abhängig von der Größe Ihres Bildschirms finden Sie links einen Chat oder können diesen über einen Button unten rechts anzeigen. Sie müssen angemeldet sein, um es nutzen zu können.',
        home17 : 'Sie können damit mit allen Benutzern chatten, die über den Kanal „Allgemein“ mit der Site verbunden sind. ',
        home18 : 'Für jedes Spiel wird ein einzigartiger Kanal erstellt, der ausschließlich den Spielern und Zuschauern zur Verfügung steht (sofern Sie dies in den Einstellungen zulassen)..',
        home19 : 'Jedes Turnier hat auch einen eigenen Kanal.',
        home20 : 'Sie können auch auf einen beliebigen Namen (außer Ihren) klicken, um ein kleines Menü mit expliziten Optionen anzuzeigen.',
        home21 : 'Auf der Seite „Top 50“ finden Sie eine Liste der [bis zu 50] Top-Spieler, sortiert nach dem ELO-System, für das Spiel, das Sie ansehen möchten.',
        home22 : 'Abschließend finden Sie auf der Seite „Über“ Informationen zum Projekt.',
        home23 : 'Sie können dieses Handbuch jederzeit anzeigen, indem Sie oben rechts auf dem Bildschirm auf die Schaltfläche „Home“ klicken.',
        tip : 'Tipp : Klicken Sie auf einen Avatar, um das Spielerprofil anzuzeigen',
        name : 'Name',
        wins : 'Siege',
        losses : 'Niederlagen',
        login : 'Bitte loggen Sie sich ein',
        password : 'Passwort',
        wrongForm : 'Falsche Adresse oder falsches Passwort',
        log : 'Verbindung',
        sub1 : 'Wenn Sie noch kein Konto haben, können Sie dies tun',
        sub2 : 'Erstellen Sie hier eines',
        noPage : 'Diese Seite existiert nicht. Überprüfen Sie die Adresse und versuchen Sie es erneut.',
        letsPlay : 'Lass uns spielen',
        whatGame : 'Welches Spiel wirst du spielen ?'
    }
}