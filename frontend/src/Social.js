export function directMessage(xlg, name) {
    if (!xlg && document.getElementById('chat2').hidden) 
			document.getElementById('chat2').hidden = false
    let prompt = document.getElementById('chatPrompt')
    prompt.value = '/w '.concat('"', name, '" ')
    prompt.focus()
}

export function unblock(id, myProfile, setMyProfile) {
    fetch('/profiles/unblock/' + id + '/', {method : 'POST'}).then(response => {
        if (response.status === 200)
            setMyProfile({...myProfile, blocked : myProfile.blocked.filter(item => item.id !== id)})
    })
}

export function block(id, myProfile, setMyProfile, message) {
    if (window.confirm(message)) {
        fetch('/profiles/block/' + id + '/', {
            method : 'POST',
            body : JSON.stringify({isFriend : myProfile.friends.includes(id)})
        }).then(response => {
            if (response.status === 200) {
                setMyProfile({
                    ...myProfile,
                    friends : myProfile.friends.filter(item => item !== id),
                    blocked : [...myProfile.blocked, id]
                })
            }
        })
    }
}

export function unfriend(id, myProfile, setMyProfile, message) {
    if (window.confirm(message)) {
        fetch('/profiles/unfriend/' + id + '/', {method : 'POST'}).then(response => {
            if (response.status === 200)
                setMyProfile({...myProfile, friends : myProfile.friends.filter(item => item !== id)})
        })
    }
}

export function addFriend(id, setChats, chats, requested) {
    fetch('/profiles/addFriend/' + id + '/', {method : 'POST'}).then(response => {
        if (response.status === 417)
            setChats(chats.map(chat => { return {...chat, messages : [...chat.messages, {type : 'system', text : requested}]} }))
    })
}

export function challenge(id, game, chats, setChats, myProfile, setMyProfile, challenged) {
    fetch('/profiles/challenge/' + id + '/' + game + '/', {method : 'POST'}).then(response => {
        if (response.status === 417)
            setChats(chats.map(chat => { return {...chat, messages : [...chat.messages, {type : 'system', text : challenged}]} }))
        else if (response.status === 200) {
            game === 'pong' && setMyProfile({...myProfile, pongChallengers : [myProfile.pongChallengers, id]})
            game === 'chess' && setMyProfile({...myProfile, chessChallengers : [myProfile.chessChallengers, id]})
        }
    })
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