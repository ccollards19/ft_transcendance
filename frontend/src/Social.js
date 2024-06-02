export function directMessage(xlg, name) {
    console.log(xlg)
    if (!xlg && document.getElementById('chat2').hidden) 
		document.getElementById('chat2').hidden = false
    let prompt = document.getElementById('chatPrompt')
    prompt.value = '/w '.concat('"', name, '" ')
    prompt.focus()
}

export function unblock(id, myProfile, setMyProfile, users, setUsers) {
    fetch('/profiles/unblock/' + id + '/', {method : 'POST'}).then(response => {
        if (response.status === 200) {
            setMyProfile({...myProfile, blocked : myProfile.blocked.filter(item => item !== id)})
            setUsers(users.filter(item => item.id !== id))
        }
    })
}

export function block(id, socket, myProfile, setMyProfile, profile, setProfile, message) {
    if (window.confirm(message)) {
        socket.send(JSON.stringify({
            action : 'friend',
            item : {type : 'block', id : id}
        }))
        setMyProfile({
            ...myProfile,
            friends : myProfile.friends.filter(item => item !== id),
            blocked : [...myProfile.blocked, id]
        })
        if (profile && profile.id === myProfile.id)
            setProfile({...profile, friends : profile.friends.filter(item => item.id !== id)})
    }
}

export function unfriend(id, socket, myProfile, setMyProfile, profile, setProfile, message) {
    if (window.confirm(message)) {
        socket.send(JSON.stringify({
            action : 'friend',
            item : {type : 'unfriend', id : id}
        }))
        setMyProfile({...myProfile, friends : myProfile.friends.filter(item => item !== id)})
        if (profile && profile.id === myProfile.id)
            setProfile({...profile, friends : profile.friends.filter(item => item.id !== id)})
    }
}

export function addFriend(id, socket) {
    socket.send(JSON.stringify({
        action : 'friend',
        item : {type : 'request', id : id}
    }))
}

export function challenge(id, game, myProfile, setMyProfile, socket) {
    socket.send(JSON.stringify({
        action : 'challenge',
        item : {game : game, id : id}
    }))
    game === 'pong' && setMyProfile({...myProfile, pongChallengers : [...myProfile.pongChallengers, id]})
    game === 'chess' && setMyProfile({...myProfile, chessChallengers : [...myProfile.chessChallengers, id]})
}

export function leaveAllChats(socket, chats, setChats, setChanName, setChanTag) {
    chats.map(chat => socket.send(JSON.stringify({
        component : 'chat',
        action : 'leave_chat',
        item : {tag : chat.tag}
    })))
    setChats([{tag : 'chat_general', name : 'general', autoScroll : true, messages : []}])
    setChanName('general')
    setChanTag('chat_general')
}