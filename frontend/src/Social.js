export function directMessage(xlg, hidden, name) {
    if (!xlg && hidden) 
			document.getElementById('chat2').hidden = false
    let prompt = document.getElementById('chatPrompt')
    prompt.value = '/w '.concat('"', name, '" ')
    prompt.focus()
}

export function block(socket, id) {
    socket.send(JSON.stringify({
        component : 'app',
        action : 'block',
        item : {id : id}
    }))
}

export function unblock(socket, id) {
    socket.send(JSON.stringify({
        component : 'app',
        action : 'unblock',
        item : {id : id}
    }))
}

export function addFriend(socket, id) {
    socket.send(JSON.stringify({
        component : 'app',
        action : 'addfriend',
        item : {id : id}
    }))
}

export function unfriend(socket, id) {
    socket.send(JSON.stringify({
        component : 'app',
        action : 'unfriend',
        item : {id : id}
    }))
}

export function challenge(socket, id, game) {
    socket.send(JSON.stringify({
        component : 'app',
        action : 'challenge',
        item : {id : id, game : game}
    }))
}

export function leaveAllChats(socket, chats, setChats, setChanName, setChanTag) {
    chats.map(chat => socket.send({
        component : 'chat',
        action : 'leave_chat',
        item : {tag : chat.tag}
    }))
    setChats([{tag : 'chat_general', name : 'general', autoScroll : true, messages : []}])
    setChanName('general')
    setChanTag('chat_general')
}