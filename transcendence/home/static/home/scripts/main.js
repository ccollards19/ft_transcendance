let currentPage = "home";
let myId = 0;
let request = new XMLHttpRequest();

//Sample chat display (In a function so I can collapse it in the IDE)
displayChat();

function displayChat() {
    request.open("GET", "../static/home/data/chat.json");
    request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
    request.responseType = "json";
    request.send();
    request.onload = function() {
        var chat = document.getElementById("chat-content");
        var messageList = request.response.messages;
        var optionList = ["Challenge", "See profile", "Add to friendlist", "Whisper", "Mute"];
        for (item of messageList) {
        	var line = document.createElement('div');
        	var player = document.createElement('span');
        	var mess = document.createElement('span');
            player.innerHTML = item.name.concat(" :");
            if (item.id != myId) {
                var menu = document.createElement('ul');
        	    player.setAttribute("type", "button");
        	    player.setAttribute("data-bs-toggle", "dropdown");
        	    player.classList.add("text-primary");
        	    menu.classList.add("dropdown-menu");
                menu.style.backgroundColor = "#D8D8D8";
        	    for (let i = 0; i < 5; i++) {
        	    	var menuOption = document.createElement('li');
                    menuOption.setAttribute("type", "button");
                    menuOption.classList.add("nav-link");
                    menuOption.innerHTML = optionList[i];
                    if (i == 1)
                        menuOption.classList.add("linkToProfile");
                    menuOption.classList.add("ps-2", "dropdown-item");
        	    	menu.appendChild(menuOption);
        	    }
            }
            else
                player.classList.add("text-danger");
        	mess.innerHTML = item.message;
        	mess.classList.add("ms-1");
        	line.append(player, mess);
            if (item.id != myId)
                line.appendChild(menu);
        	chat.append(line);
        }
        var links = document.getElementsByClassName("linkToProfile");
        for (let i = 0; i < messageList.length; i++)
            links[i].addEventListener("click", function() { displayProfile(messageList[i].id); });
    }
}

//Those following variables are for testing only
let isLoggedIn1 = false;
let isLoggedIn2 = false;
let playOnline = false;

//==============================================
//Assign the customWindows to the corresponding links all over the website

let windowsList = ["home", "new_game", "leaderboard", "about", "log", "new_game", "leaderboard", "about", "settings", "log", "subscribe", "subscribe"];
let buttonsList = document.getElementsByClassName("linkToWindow");

for (let i = 0; i < 12; i++)
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
document.getElementById("modifyCPButton").addEventListener("click", modifyCatchPhrase);
document.getElementById("modifyBioButton").addEventListener("click", modifyBio);
document.getElementById("modifyCPCancel").addEventListener("click", cancelModifyCatchPhrase);
document.getElementById("modifyBioCancel").addEventListener("click", cancelModifyBio);
document.getElementById("modifyNameCancel").addEventListener("click", cancelModifyName);
document.getElementById("avatar-large").addEventListener("click", function() { document.getElementById("avatarUpload").click(); });
// document.getElementById("switch").addEventListener("click", switchPlayers);


//==============================================
//Media Queries (between brackets for the collapse in the IDE)

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

function addFriend(optionList, item, id) {
    var li = document.createElement('li');
    var pic = document.createElement('div');
    var avat = document.createElement('img');
    var info = document.createElement('div');
    var friendName = document.createElement('span');
    var friendStatus = document.createElement('span');
    li.classList.add("list-group-item", "d-flex", "ps-2", "friend");
    pic.style.width = "70px";
    pic.style.height = "70px";
    avat.src = item.avatar;
    avat.classList.add("rounded-circle");
    avat.style.height = "75px";
    avat.style.width = "75px";
    pic.appendChild(avat);
    info.classList.add("d-flex", "flex-wrap", "align-items-center", "ms-3");
    friendName.classList.add("w-100");
    friendName.innerHTML = item.name;
    info.append(friendName, friendStatus);
    if (item.online)
    {
        friendStatus.classList.add("text-success");
        friendStatus.innerHTML = "Online";
    }
    else
    {
        friendStatus.classList.add("text-danger");
        friendStatus.innerHTML = "Offline";
    }
    friendStatus.classList.add("fw-bold");
    var menuButton = document.createElement('button');
    menuButton.setAttribute("type", "button");
    menuButton.setAttribute("data-bs-toggle", "dropdown");
    menuButton.innerHTML = "Options";
    menuButton.classList.add("btn", "btn-secondary", "ms-3");
    var menu = document.createElement('ul');
    menu.classList.add("dropdown-menu");
    menu.style.backgroundColor = "#D8D8D8";
    for (let i = 0; i < 4; i++)
    {
        if (i < 2 && !item.online)
            continue;
        else if (i == 2 && id != myId)
            continue;
        else if (i < 3 && myId == "0")
            continue;
    	var menuOption = document.createElement('li');
        menuOption.setAttribute("type", "button");
        menuOption.classList.add("nav-link");
        menuOption.innerHTML = optionList[i];
        if (i == 3)
            menuOption.classList.add("linkToFriendProfile");
    	menuOption.classList.add("ps-2", "dropdown-item");
    	menu.appendChild(menuOption);
    }
    info.append(menuButton, menu);
    li.append(pic, info);
    document.getElementById("friendListContainer").appendChild(li);
}

/*Displays the friendList inside the 'Profile' page
If a friend is connected, the status is displayed in green, in red if he's not
The 'options' buttons displays a little menu
'See profile' is always available
'Challenge' and 'direct message' are available if the friend is connected
'Unfriend' is available only if the displayed list is the one of the connected player*/
function displayFriendList(id) 
{
    request.open("GET", "../static/home/data/profiles.json");
    request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
    request.responseType = "json";
    request.send();
    request.onload = function() 
    {
        var fl = document.getElementById("friendList");
        fl.setAttribute("class", "w-25 d-flex rounded");
        var friends = request.response[id].friends;
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
            fl.appendChild(list);
            var optionList = ["Challenge", "Direct message", "Unfriend", "See profile"];
            for (item of friends)
                addFriend(optionList, item, id);
            var links = document.getElementsByClassName("linkToFriendProfile");
            for (let i = 0; i < friends.length; i++)
                links[i].addEventListener("click", function() { displayProfile(friends[i].id); });
        }
    }
}

function myProfile() {
    var nick = document.getElementById("playerName").children[0];
    nick.addEventListener("click", modifyName);
    nick.addEventListener("mouseover", function() { 
        nick.classList.replace("text-black", "text-warning-emphasis");
        nick.style.cursor = "pointer";
        nick.setAttribute("title", "Modify Name");
    });
    nick.addEventListener("mouseleave", function() { 
        nick.classList.replace("text-warning-emphasis", "text-black");
        nick.style.cursor = "unset";
        nick.setAttribute("title", "");
    });
    var avat = document.getElementById("avatar-large");
    avat.children[1].disabled = false;
    // avat.addEventListener("click", modifyAvatar);
    avat.addEventListener("mouseover", function() { 
        avat.children[2].classList.remove("d-none");
        avat.children[0].style.filter = "brightness(50%)";
        avat.style.cursor = "pointer";
    });
    avat.addEventListener("mouseleave", function() { 
        avat.children[2].classList.add("d-none");
        avat.children[0].style.filter = "brightness(100%)";
        avat.style.cursor = "unset";
    });
    for (item of document.getElementsByClassName("modifyProfileButton"))
        item.classList.remove("d-none");
}

function otherProfile() {
    var avat = document.getElementById("avatar-large");
    avat.children[1].disabled = true;
    avat.addEventListener("mouseover", function() { 
        avat.children[2].classList.add("d-none");
        avat.children[0].style.filter = "brightness(100%)";
        avat.style.cursor = "unset";
    });
    var nick = document.getElementById("playerName").children[0];
    nick.removeEventListener("click", modifyName);
    nick.addEventListener("mouseover", function() { 
        nick.classList.replace("text-warning-emphasis", "text-black");
        nick.style.cursor = "unset";
        nick.setAttribute("title", "");
    });
}

/*Displays the profile of the player 'name'
If 'name' is the currently connected player, buttons will be displayed to modify the catchphrase, the bio, the avatar and the name
A refresh button is displayed besides the 'FriendList' title
That button is useful to check if there was a change in the connection status of a friend*/
function displayProfile(id) {
    document.getElementById(currentPage).classList.add("d-none");
    currentPage = "profile";
    for (item of document.getElementsByClassName("modifyProfileButton"))
        item.classList.add("d-none");
    request.open("GET", "../static/home/data/profiles.json");
    request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
    request.responseType = "json";
    request.send();
    request.onload = function() {
        var profile = request.response[id]; 
        document.getElementById("avatar-large").children[0].src = profile.avatar;
        document.getElementById("rankIcon").children[0].src = profile.pong.rank;
        document.getElementById("playerName").children[0].innerHTML = profile.name;
        document.getElementById("totalWins").innerHTML = profile.pong.wins;
        document.getElementById("totalMatches").innerHTML = profile.pong.matches;
        document.getElementById("totalLoses").innerHTML = profile.pong.loses;
        document.getElementById("catchphrase").innerHTML = profile.catchprase;
        document.getElementById("bio").innerHTML = profile.bio;
        document.getElementById("profile").classList.remove("d-none");
        var refresh = document.getElementById("refreshFriendList");
        refresh.removeEventListener("click", displayFriendList);
        refresh.addEventListener("click", function() { displayFriendList(id); });
        displayFriendList(id);
        if (id == myId)
            myProfile();
        else
            otherProfile();
    }
}

/*Fetches the top [up to] 50 players in the database
Displays the top profiles in a table*/
function displayLeaderboard() {
    request.open("GET", "../static/home/data/leaderboard.json");
    request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
    request.responseType = "json";
    request.send();
    request.onload = function() {
        var topFifty = request.response.Joueurs;
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
    }
    document.getElementById("leaderboard").classList.remove("d-none");

}

/*Displays the 'New Game" window
Depending on whether the player is connected or not, the display will change
If noone's connected or if the connected player chose to play offline, 2 frames will be displayed, one for each potential local contender
If the player is connected and chose to play online, one frame will be displayed*/
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
    if (name == "leaderboard")
        displayLeaderboard();
    else if (name == "new_game")
        displayNewGame();
    else
        document.getElementById(name).classList.remove("d-none");
    currentPage = name;
}

/*Changes value of 'myName' and avatars
Hides the "login" button
Displays "Profile", "Settings" and "Logout" buttons
Disables the links on the home page
Displays 'profile' page*/
function login() { 
    myId = 1;
    document.getElementById("chatPrompt").setAttribute("title", "");
    request.open("GET", "../static/home/data/profiles.json");
    request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0');
    request.responseType = "json";
    request.send();
    request.onload = function() {
        var avatars = document.getElementsByClassName("avatar");
        var avat = request.response[myId].avatar;
        for (item of avatars)
            item.src = avat;
        document.getElementById("menu").children[0].classList.add("d-none");
        var logBtns = document.getElementsByClassName("loggedInButton");
        for (item of logBtns)
            item.classList.remove("d-none");
        var links = document.getElementsByClassName("loginLink");
        for (item of links)
        {
            item.style.pointerEvents = "none";
            item.style.color = "grey";
        }
        document.getElementById("chatPrompt").disabled = false;
        document.getElementById("linkToMyProfile").addEventListener("click", function() { displayProfile(myId); });
        displayProfile(myId);
    }
}

/*Change value of 'myName' to "" and avatars
Displays the "login" button
Hides "Profile", "Settings" and "Logout" buttons
Enables the links on the home page
Displays 'home' page*/
function logout() {
    myId = 0;
    document.getElementById("chatPrompt").setAttribute("title", "You need to be logged in to use the chat");
    let avatars = document.getElementsByClassName("avatar");
    for (item of avatars)
        item.src = "../static/home/images/base_profile_picture.png";
    document.getElementById("menu").children[0].classList.remove("d-none");
    let logBtns = document.getElementsByClassName("loggedInButton");
    for (item of logBtns)
        item.classList.add("d-none");
    let linkList = document.getElementsByClassName("loginLink");
    for (link of linkList)
    {
        link.style.pointerEvents = "auto";
        link.style.color = "";
    }
    document.getElementById("chatPrompt").disabled = true;
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

function modifyAvatar() {

}

function modifyName() {
    var div = document.getElementById("playerName");
    var text = div.children[0].innerHTML;
    div.classList.add("flex-column");
    div.children[1].children[1].setAttribute("value", text);
    div.children[0].classList.add("d-none");
    div.children[1].classList.remove("d-none");
}

function cancelModifyName() {
    var div = document.getElementById("playerName");
    div.classList.remove("flex-column");
    div.children[0].classList.remove("d-none");
    div.children[1].classList.add("d-none");
}

function modifyCatchPhrase() {
    var div = document.getElementById("CPDiv");
    var text = div.children[2].innerHTML;
    div.classList.add("flex-column");
    div.children[3].children[1].setAttribute("value", text);
    div.children[1].classList.add("d-none");
    div.children[2].classList.add("d-none");
    div.children[3].classList.remove("d-none");
    document.getElementById("bioDiv").classList.add("d-none");
}

function cancelModifyCatchPhrase() {
    var div = document.getElementById("CPDiv");
    div.classList.remove("flex-column");
    div.children[1].classList.remove("d-none");
    div.children[2].classList.remove("d-none");
    div.children[3].classList.add("d-none");
    document.getElementById("bioDiv").classList.remove("d-none");
}

function modifyBio() {
    var div = document.getElementById("bioDiv");
    var text = div.children[2].innerHTML;
    div.classList.add("flex-column");
    div.children[3].children[0].innerHTML = text;
    div.children[1].classList.add("d-none");
    div.children[2].classList.add("d-none");
    div.children[3].classList.remove("d-none");
    document.getElementById("CPDiv").classList.add("d-none");
}

function cancelModifyBio() {
    var div = document.getElementById("bioDiv");
    div.classList.remove("flex-column");
    div.children[1].classList.remove("d-none");
    div.children[2].classList.remove("d-none");
    div.children[3].classList.add("d-none");
    document.getElementById("CPDiv").classList.remove("d-none");
}