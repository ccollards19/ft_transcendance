//Sample JSon for the 'profile' page
let myProfile = {
    "Joueur" : 
    {
        "avatar" : "www/images/luffy.jpeg",
        "name" :"Monkey D. Luffy",
        "pong" : {
            "rank" : "www/images/pirate-symbol-mark-svgrepo-com.svg",
            "matches" : 258,
            "wins" : 0,
            "loses" : 258
        },  
        "friends" : [
            {
                "avatar" : "www/images/zoro.jpeg",
                "name" : "Roronoa Zoro",
                "online" : true
            },

            {
                "avatar" : "www/images/sanji.jpg",
                "name" : "Vinsmoke Sanji",
                "online" : true
            },

            {
                "avatar" : "www/images/nami.jpeg",
                "name" : "Nami",
                "online" : false
            },

            {
                "avatar" : "www/images/usopp.jpeg",
                "name" : "Usopp",
                "online" : false
            },

            {
                "avatar" : "www/images/chopper.png",
                "name" : "Tony Tony Chopper",
                "online" : false
            },

            {
                "avatar" : "www/images/robin.png",
                "name" : "Nico Robin",
                "online" : false
            },

            {
                "avatar" : "www/images/franky.jpg",
                "name" : "Franky",
                "online" : false
            },

            {
                "avatar" : "www/images/brook.jpg",
                "name" : "Soul King Brook",
                "online" : false
            },

            {
                "avatar" : "www/images/jinbe.jpg",
                "name" : "Jinbe",
                "online" : false
            }
        ],
        "catchprase" : "Kaizoku ou ni ore wa naru !!!",
        "bio" : "Monkey D. Luffy (モンキー・Ｄ・ルフィ, Monkī Dī Rufi?), surnommé de manière récurrente Luffy au chapeau de paille (麦わらのルフィ, Mugiwara no Rufi?), est un personnage de fiction et principal protagoniste de la franchise japonaise One Piece créée par Eiichirō Oda. "
    }
};

let otherProfile = {
	"Joueur" : 
    {
        "avatar" : "www/images/law.jpg",
        "name" :"Trafalgar Law",
        "pong" : {
            "rank" : "www/images/pirate-symbol-mark-svgrepo-com.svg",
            "matches" : 258,
            "wins" : 258,
            "loses" : 0
        },  
        "friends" : [
            {
                "avatar" : "www/images/zoro.jpeg",
                "name" : "Roronoa Zoro",
                "online" : true
            },

            {
                "avatar" : "www/images/sanji.jpg",
                "name" : "Vinsmoke Sanji",
                "online" : true
            },

            {
                "avatar" : "www/images/nami.jpeg",
                "name" : "Nami",
                "online" : false
            },

            {
                "avatar" : "www/images/usopp.jpeg",
                "name" : "Usopp",
                "online" : false
            },

            {
                "avatar" : "www/images/chopper.png",
                "name" : "Tony Tony Chopper",
                "online" : false
            },

            {
                "avatar" : "www/images/robin.png",
                "name" : "Nico Robin",
                "online" : false
            },

            {
                "avatar" : "www/images/franky.jpg",
                "name" : "Franky",
                "online" : false
            },

            {
                "avatar" : "www/images/brook.jpg",
                "name" : "Soul King Brook",
                "online" : false
            },

            {
                "avatar" : "www/images/jinbe.jpg",
                "name" : "Jinbe",
                "online" : false
            }
        ],
        "catchprase" : "Kaizoku ou ni ore wa naru !!!",
        "bio" : "Monkey D. Luffy (モンキー・Ｄ・ルフィ, Monkī Dī Rufi?), surnommé de manière récurrente Luffy au chapeau de paille (麦わらのルフィ, Mugiwara no Rufi?), est un personnage de fiction et principal protagoniste de la franchise japonaise One Piece créée par Eiichirō Oda. "
    }
};

//Sample JSon for the 'leaderboard' page
let ldb = {
    "Joueurs" : [
        {
            "avatar" : "www/images/gaimon.jpeg",
            "name" : "Gaimon",
            "matches" : 549,
            "wins" : 369,
            "loses" : 180,
            "level" : 12
        },

        {
            "avatar" : "www/images/nojiko.jpg",
            "name" : "Nojiko",
            "matches" : 511,
            "wins" : 299,
            "loses" : 212,
            "level" : 12
        },

        {
            "avatar" : "www/images/croco.jpg",
            "name" : "Sir Crocodile",
            "matches" : 497,
            "wins" : 282,
            "loses" : 215,
            "level" : 11
        },

        {
            "avatar" : "www/images/teach.jpg",
            "name" : "Marshall D. Teach",
            "matches" : 471,
            "wins" : 368,
            "loses" : 103,
            "level" : 10
        },

        {
            "avatar" : "www/images/law.jpg",
            "name" : "Trafalgar Law",
            "matches" : 412,
            "wins" : 291,
            "loses" : 121,
            "level" : 10
        },

        {
            "avatar" : "www/images/panda.jpg",
            "name" : "Pandaman",
            "matches" : 411,
            "wins" : 290,
            "loses" : 121,
            "level" : 9
        },

        {
            "avatar" : "www/images/tonjit.jpeg",
            "name" : "Tonjit",
            "matches" : 395,
            "wins" : 269,
            "loses" : 126,
            "level" : 9
        },

        {
            "avatar" : "www/images/dadan.jpg",
            "name" : "Dadan",
            "matches" : 390,
            "wins" : 300,
            "loses" : 90,
            "level" : 9
        },

        {
            "avatar" : "www/images/kizaru.jpg",
            "name" : "Borsalino Kizaru",
            "matches" : 384,
            "wins" : 258,
            "loses" : 126,
            "level" : 8
        },

        {
            "avatar" : "www/images/duval.jpg",
            "name" : "Duval",
            "matches" : 375,
            "wins" : 301,
            "loses" : 74,
            "level" : 8
        },

        {
            "avatar" : "www/images/caribou.jpeg",
            "name" : "Caribou",
            "matches" : 368,
            "wins" : 298,
            "loses" : 70,
            "level" : 8
        },

        {
            "avatar" : "www/images/brulee.jpeg",
            "name" : "Charlotte Brulee",
            "matches" : 341,
            "wins" : 251,
            "loses" : 90,
            "level" : 8
        },

        {
            "avatar" : "www/images/spandam.jpeg",
            "name" : "Spandam",
            "matches" : 342,
            "wins" : 250,
            "loses" : 92,
            "level" : 8
        },

        {
            "avatar" : "www/images/carrot.jpeg",
            "name" : "Carrot",
            "matches" : 340,
            "wins" : 242,
            "loses" : 98,
            "level" : 8
        },

        {
            "avatar" : "www/images/apoo.jpg",
            "name" : "Scratchman Apoo",
            "matches" : 327,
            "wins" : 201,
            "loses" : 128,
            "level" : 7
        }
    ]
};


//Sample chat content
let messages = {
	"messages" : [
		{
			"name" : "Roronoa Zoro",
			"message" : "Lost again ?"
		},

		{
			"name" : "Vinsmoke Sanji",
			"message" : "Look who's talking !"
		},

		{
			"name" : "Nami",
			"message" : "Boys..."
		},

		{
			"name" : "Monkey D. Luffy",
			"message" : "Ah ah ah ! You're so funny !"
		},

		{
			"name" : "Tony Tony Chopper",
			"message" : "Oh no ! Zoro got lost again ?!"		
		},

		{
			"name" : "Trafalgar Law",
			"message" : "I cannot believe you are an emperor and not me..."
		}
	]
};

//Sample chat display (In a function so I can collapse it in the IDE)
displayChat();

function displayChat() {
    var chat = document.getElementById("chat-content");
    var messageList = messages.messages;
    for (item of messageList) {
    	var optionList = ["Challenge", "See profile", "Add to friendlist", "Whisper", "Mute"];
    	var line = document.createElement('div');
    	var player = document.createElement('span');
    	var mess = document.createElement('span');
    	var menu = document.createElement('ul');
    	var menuOption;
    	player.setAttribute("type", "button");
    	player.setAttribute("data-bs-toggle", "dropdown");
    	player.classList.add("text-primary");
    	player.innerHTML = item.name.concat(" : ");
    	menu.classList.add("dropdown-menu");
    	for (let i = 0; i < 5; i++)
    	{
    		menuOption = document.createElement('li');
    		menuOption.classList.add("ps-2", "dropdown-item");
    		menuOption.innerHTML = optionList[i];
    		menu.appendChild(menuOption);
    	}
    	mess.innerHTML = item.message;
    	mess.classList.add("ms-2");
    	line.append(player, menu, mess);
    	chat.append(line);
    }
}

let currentPage = "home";

//Those following variables are for testing only
let generalLogin = false;
let isLoggedIn1 = false;
let isLoggedIn2 = false;
let playOnline = false;

//==============================================
//Assign the customWindows to the corresponding links all over the website

let windowsList = ["home", "new_game", "leaderboard", "about", "log", "new_game", "leaderboard", "about", "profile", "settings", "log", "subscribe", "subscribe"];
let buttonsList = document.getElementsByClassName("linkToWindow");

for (let i = 0; i < 13; i++)
    buttonsList[i].addEventListener("click", function() { displayNewWindow(windowsList[i]); });

//===========================================
//Add all the common attributes to the custom pages containing forms

let attributeList = ["d-flex", "align-items-center", "justify-content-center"];
let winList = document.getElementsByClassName("customForm");

for (win of winList)
{
    for (attribute of attributeList)
        win.classList.add(attribute);
}

//============================================
//Add all the common attributes to the customWindows + 2 exceptions

attributeList = ["bg-dark-subtle", "py-3", "px-2", "border", "border-2", "border-dark-subtle", "rounded", "overflow-auto"];
winList = document.getElementsByClassName("customWindow");

for (win of winList)
{
    for (attribute of attributeList)
        win.classList.add(attribute);
}

document.getElementById("leaderboard").classList.remove("overflow-auto");
document.getElementById("profile").classList.add("d-flex", "flex-column");

//===============================================
//Some other buttons

document.getElementById("loginButton").addEventListener("click", login);
document.getElementById("logoutButton").addEventListener("click", logout);
// document.getElementById("switch").addEventListener("click", switchPlayers);



//==============================================
//Media Queries

{
    function displayxSm(xsm) {
        if (xsm.matches) {
            document.getElementById("profile-header").classList.add("flex-column", "align-items-center");
            document.getElementById("stats").classList.add("flex-column", "align-items-center");
            document.getElementById("profile-body").classList.add("flex-column", "align-items-center");
            document.getElementById("friendListTitle").classList.add("text-center");
            document.getElementById("friendList").classList.add("w-50");
            document.getElementById("profile-info").style.maxHeight = "";
			for (item of document.getElementById("leaderhead").childNodes)
			{
				if (item.nodeName != "#text")
					item.classList.add("d-none");
			}
			for (item of document.getElementsByClassName("ld-avatar"))
				item.classList.add("me-3");
        }
    }

    function displaySm(sm) {
        if (sm.matches) {
            for (win of winList)
            {
                win.style.height = "80%";
                win.style.width = "90%";
            }
            var forms = document.getElementsByClassName("customForm");
            for (item of forms)
            {
                item.childNodes[1].classList.replace("w-50", "w-100");
                item.childNodes[1].classList.add("h-100");
            }
            document.getElementById("profile-header").classList.add("flex-column", "align-items-center");
            document.getElementById("stats").classList.add("flex-column", "align-items-center");
            document.getElementById("profile-body").classList.add("flex-column", "align-items-center");
            document.getElementById("friendListTitle").classList.add("text-center");
            document.getElementById("friendList").classList.add("w-50");
            document.getElementById("profile-info").style.maxHeight = "";
            document.getElementById("profile-info").classList.add("mt-2");
            document.getElementById("menu-large").classList.add("d-none");
            document.getElementById("avatar-small").classList.add("d-none");
            document.getElementById("burger-menu").classList.remove("d-none");
            var btns = document.getElementsByClassName("header-btn-large");
            for (item of btns)
                item.classList.add("d-none");
            btns = document.getElementsByClassName("header-btn-sm");
            for (item of btns)
                item.classList.remove("d-none");
        }
    }

    function displayMd(md) {
        if (md.matches) {
            for (win of winList)
            {
                win.style.height = "75%";
                win.style.width = "75%";
            }
            document.getElementById("menu-large").classList.remove("d-none");
            var btns = document.getElementsByClassName("header-btn-large");
            for (item of btns)
                item.classList.remove("d-none");
            btns = document.getElementsByClassName("header-btn-sm");
            for (item of btns)
                item.classList.add("d-none");
            var forms = document.getElementsByClassName("customForm");
            for (item of forms)
            {
                item.childNodes[1].classList.replace("w-100", "w-50");
                item.childNodes[1].classList.remove("h-100");
            }
            document.getElementById("burger-menu").classList.add("d-none");
            document.getElementById("avatar-small").classList.remove("d-none");
            document.getElementById("stats").classList.remove("flex-column", "align-items-center");
            document.getElementById("friendListTitle").classList.remove("text-center");
            document.getElementById("profile-body").classList.remove("flex-column", "align-items-center");
            document.getElementById("friendList").style.maxHeight = "300px";
            document.getElementById("profile-header").classList.remove("flex-column", "align-items-center");
        }
    }

    function displayLg(lg) {
        if (lg.matches) {
            for (win of winList)
            {
                win.style.height = "75%";
                win.style.width = "75%";
            }
            document.getElementById("menu-large").classList.remove("d-none");
            var btns = document.getElementsByClassName("header-btn-large");
            for (item of btns)
                item.classList.remove("d-none");
            btns = document.getElementsByClassName("header-btn-sm");
            for (item of btns)
                item.classList.add("d-none");
            var friends = document.getElementsByClassName("friend");
            for (item of friends) {
                item.classList.remove("flex-column", "align-items-center");
                item.classList.replace("ps-3", "ps-1");
            }
        }
        else
        {
            var friends = document.getElementsByClassName("friend");
            for (item of friends) {
                item.classList.add("flex-column", "align-items-center");
                item.classList.replace("ps-1", "ps-3");
            }
        }
    }

    function hideChat(noChat) {
        if (noChat.matches)
            document.getElementById("chat").classList.add("d-none");
        else
            document.getElementById("chat").classList.remove("d-none");
    }

    let xsm = window.matchMedia("(max-width: 550px)");
    let sm = window.matchMedia("(max-width: 768px)");
    let md = window.matchMedia("(min-width: 768px) and (max-width: 992px)");
    let lg = window.matchMedia("(min-width: 992px)");
    let noChat = window.matchMedia("(max-width: 1180px)");
    displayxSm(xsm);
    displaySm(sm);
    displayLg(md);
    displayMd(lg);
    hideChat(noChat);
    xsm.addEventListener("change", function() { displayxSm(xsm);});
    sm.addEventListener("change", function() { displaySm(sm); });
    md.addEventListener("change", function() { displayMd(md); });
    lg.addEventListener("change", function() { displayLg(lg); });
    noChat.addEventListener("change", function() { hideChat(noChat); });
}

//==============================================
//Functions

function displayProfile() {
    if (generalLogin)
    {
        //var myProfile = fetch profile dans la BDD > BackEnd
        document.getElementById("avatar-large").src = myProfile.Joueur.avatar;
        document.getElementById("playerName").innerHTML = myProfile.Joueur.name;
        document.getElementById("totalWins").innerHTML = myProfile.Joueur.pong.wins;
        document.getElementById("totalMatches").innerHTML = myProfile.Joueur.pong.matches;
        document.getElementById("totalLoses").innerHTML = myProfile.Joueur.pong.loses;
        document.getElementById("catchphrase").innerHTML = myProfile.Joueur.catchprase;
        document.getElementById("bio").innerHTML = myProfile.Joueur.bio;
        document.getElementById("profile").classList.remove("d-none");
        var fl = document.getElementById("friendList");
        var friends = myProfile.Joueur.friends;
        if (!friends.length)
        {
            fl.innerHTML = "Nothing to display (yet ;) )";
            fl.classList.add("border", "border-black", "d-flex", "align-items-center", "justify-content-center");
        }
        else
        {
            fl.innerHTML = "";
            var list = document.createElement('ul');
            list.setAttribute("id", "friendListContainer");
            list.classList.add("w-100", "list-group", "overflow-auto");
            for (item of friends)
            {
                var li = document.createElement('li');
                var avat = document.createElement('img');
                var info = document.createElement('div');
                var friendName = document.createElement('span');
                var friendStatus = document.createElement('span');
                var optionList = ["Challenge", "Direct message", "Unfriend", "See profile"];
                li.classList.add("list-group-item", "d-flex", "ps-2", "friend");
                avat.src = item.avatar;
                avat.classList.add("rounded-circle");
                avat.style.height = "75px";
                avat.style.width = "75px";
                info.classList.add("d-flex", "flex-wrap", "align-items-center", "ms-3");
                friendName.classList.add("w-100");
                friendName.innerHTML = item.name;
                info.append(friendName, friendStatus);
                if (item.online)
                {
                    friendStatus.classList.add("text-success");
                    friendStatus.innerHTML = "Online";
                    var menuButton = document.createElement('button');
                    menuButton.setAttribute("type", "button");
                    menuButton.setAttribute("data-bs-toggle", "dropdown");
                    menuButton.innerHTML = "Options";
                    menuButton.classList.add("btn", "btn-secondary", "ms-3");
                    var menu = document.createElement('ul');
                    menu.classList.add("dropdown-menu");
                    for (let i = 0; i < 4; i++)
    	            {
    	            	menuOption = document.createElement('li');
    	            	menuOption.classList.add("ps-2", "dropdown-item");
    	            	menuOption.innerHTML = optionList[i];
    	            	menu.appendChild(menuOption);
    	            }
                    info.append(menuButton, menu);
                }
                else
                {
                    friendStatus.classList.add("text-danger");
                    friendStatus.innerHTML = "Offline";
                }
                li.append(avat, info);
                list.appendChild(li);
            }
            fl.appendChild(list);
        }
    }
    else
    {
        document.getElementById("profile").innerHTML = "You are not logged in, you shouldn't be here";
        document.getElementById("profile").classList.remove("d-none");
    }
}

function displayLeaderboard() {
    //var ldb = fetch leaderboard (top 50 selon une métrique à déterminer) dans la BDD > BackEnd
    var topFifty = ldb.Joueurs;
    var tab = document.getElementById("leaderList");
    var rank = 1;
    tab.innerHTML = "";
    for (item of topFifty)
    {
        var li = document.createElement('li');
        var plRank = document.createElement('span');
        var avat = document.createElement('img');
        var pic = document.createElement('span');
        var plName = document.createElement('span');
        var plMatches = document.createElement('span');
        var plWins = document.createElement('span');
        var plLoses = document.createElement('span');
        var plLevel = document.createElement('span');
        li.classList.add("list-group-item", "w-100", "d-flex", "align-items-center", "p-1");
        li.style.minHeight = "50px";
        plRank.classList.add("d-flex", "justify-content-center", "ld-sm");
        plRank.innerHTML = rank;
		pic.classList.add("ld-avatar");
        avat.src = item.avatar;
        avat.style.height = "45px";
        avat.style.width = "45px";
        pic.classList.add("ld-md", "h-100");
        pic.appendChild(avat);
        plName.classList.add("ld-lg");
        plName.innerHTML = item.name;
        plMatches.classList.add("d-flex", "justify-content-center", "ld-md", "ld-matches");
        plMatches.innerHTML = item.matches;
        plWins.classList.add("d-flex", "justify-content-center", "ld-md", "ld-wins");
        plWins.innerHTML = item.wins;
        plLoses.classList.add("d-flex", "justify-content-center", "ld-md", "ld-loses");
        plLoses.innerHTML = item.loses;
        plLevel.classList.add("d-flex", "justify-content-center", "ld-md");
        plLevel.innerHTML = item.level;
        li.append(plRank, pic, plName, plMatches, plWins, plLoses, plLevel);
        tab.appendChild(li);
        rank++;
    }
    document.getElementById("leaderboard").classList.remove("d-none");

}

function displayNewGame() {
    if (!playOnline || !generalLogin) {
        document.getElementById("logInOne").classList.add("d-none");
        document.getElementById("logOutOne").classList.add("d-none");
        document.getElementById("logInTwo").classList.add("d-none");
        document.getElementById("logOutTwo").classList.add("d-none");
        if (isLoggedIn1 || generalLogin) {
            // Fetch profile on the BDD > Backend
            document.getElementById("playerOneAvatar").src = myProfile.Joueur.avatar;
            document.getElementById("playerOneName").innerHTML = myProfile.Joueur.name;
            document.getElementById("playerOneRank").src = myProfile.Joueur.pong.rank;
            document.getElementById("logInOne").classList.remove("d-none");
            document.getElementById("guestWarning1").classList.add("d-none");
        }
        else {
            document.getElementById("guest1").checked = false;
            document.getElementById("guest1").addEventListener("change", setGuestButton1);
            document.getElementById("logOutOne").classList.remove("d-none");
        }
        if (isLoggedIn2) {
            document.getElementById("playerTwoAvatar").src = otherProfile.Joueur.avatar;
            document.getElementById("playerTwoName").innerHTML = otherProfile.Joueur.name;
            document.getElementById("playerTwoRank").src = otherProfile.Joueur.pong.rank;
            document.getElementById("logInTwo").classList.remove("d-none");
        }
        else {
            document.getElementById("guest2").checked = false;
            document.getElementById("guest2").addEventListener("change", setGuestButton2);
            document.getElementById("logOutTwo").classList.remove("d-none");
        }
        if (!isLoggedIn1 || !isLoggedIn2)
            document.getElementById("startButton").classList.add("disabled");
        document.getElementById("local").classList.remove("d-none");
    }
    document.getElementById("new_game").classList.remove("d-none");
}

//Hides current custom window and displays customWindow which id == name
function displayNewWindow(name) {
    document.getElementById(currentPage).classList.add("d-none");
    if (name == "profile")
        displayProfile();
    else if (name == "leaderboard")
        displayLeaderboard();
    else if (name == "new_game")
        displayNewGame();
    else
        document.getElementById(name).classList.remove("d-none");
    currentPage = name;
}

//Changes log status and avatars
//Hides the "login" button
//Displays "Play", "Profile", "Settings" and "Logout" buttons
//Disables the links on the home page
//Displays 'profile' page
function login() { 
    generalLogin = true;
    let avatars = document.getElementsByClassName("avatar");
    for (item of avatars)
        item.src = "www/images/luffy.jpeg";
    document.getElementById("menu").childNodes[1].classList.add("d-none");
    let logBtns = document.getElementsByClassName("loggedInButton");
    for (item of logBtns)
        item.classList.remove("d-none");
    let links = document.getElementsByClassName("loginLink");
    for (item of links)
    {
        item.style.pointerEvents = "none";
        item.style.color = "grey";
    }
    displayNewWindow("profile");
}

//Changes log status and avatars
//Displays the "login" button
//Hides "Play", "Profile", "Settings" and "Logout" buttons
//Enables the links on the home page
//Displays 'home' page
function logout() {
    generalLogin = false;
    let avatars = document.getElementsByClassName("avatar");
    for (item of avatars)
        item.src = "www/images/base_profile_picture.png";
    document.getElementById("menu").childNodes[1].classList.remove("d-none");
    let logBtns = document.getElementsByClassName("loggedInButton");
    for (item of logBtns)
        item.classList.add("d-none");
    let linkList = document.getElementsByClassName("loginLink");
    for (link of linkList)
    {
        link.style.pointerEvents = "auto";
        link.style.color = "";
    }
    displayNewWindow("home");
}

//Changes states of 'Let's play !!!' and 'login' buttons and the warning about playing against a guest on the 'Play' page
function setGuestButton1() {
    if (this.checked) {
        document.getElementById("guestWarning2").classList.remove("d-none");
        document.getElementById("versusLoginButton1").classList.add("disabled");
        if (document.getElementById("guest2").checked || isLoggedIn2)
            document.getElementById("startButton").classList.remove("disabled");
    }
    else {
        document.getElementById("versusLoginButton1").classList.remove("disabled");
        document.getElementById("startButton").classList.add("disabled");
        document.getElementById("guestWarning2").classList.add("d-none");
    }
}

function setGuestButton2() {
    if (this.checked) {
        document.getElementById("guestWarning1").classList.remove("d-none");
        document.getElementById("versusLoginButton2").classList.add("disabled");
        if (document.getElementById("guest1").checked || isLoggedIn1 || generalLogin)
            document.getElementById("startButton").classList.remove("disabled");
    }
    else {
        document.getElementById("versusLoginButton2").classList.remove("disabled");
        document.getElementById("startButton").classList.add("disabled");
        document.getElementById("guestWarning1").classList.add("d-none");
    }
}

//Switches sides and colors for the players in a local match
//Keeps the state of the 'Play as a guest' button and its consequences
// function switchPlayers() {
//     var check = document.getElementById("guest").checked ? true : false;
//     var left = document.getElementById("playerOne").innerHTML;
//     var right = document.getElementById("playerTwo").innerHTML;
//     var plOne = document.getElementById("playerOne");
//     var plTwo = document.getElementById("playerTwo");
//     plOne.innerHTML = right;
//     plOne.classList.replace("text-danger", "text-primary");
//     plTwo.innerHTML = left;
//     plTwo.classList.replace("text-primary", "text-danger");
//     if (check)
//         document.getElementById("guest").checked = true;
//     document.getElementById("guest").addEventListener("change", setGuestButton);
// }