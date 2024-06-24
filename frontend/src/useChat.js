export default function useChat(props, set) {
    if (set.action === 'mute')
        props.setMuted([...props.muted, set.id])
    else if (set.action === 'unmute')
        props.setMuted(props.muted.filter(item => item !== id))
    else if (set.action === 'join_chat') {
        props.socket.send(JSON.stringify({action : "join_chat", item : {chat : set.tag}}))
        props.setChats([...props.chats, {tag : set.tag, name : set.name, autoScroll : true, messages : []}])
        props.setChanTag(set.tag)
        props.setChanName(set.name)
    }
    else if (set.action === 'leave_chat') {
        props.setChats(props.chats.filter(chat => chat.tag !== set.tag))
		if (props.chanTag === set.tag) {
			props.setChanTag('chat_general')
			props.setChanName('general')
		}
		props.socket.send(JSON.stringify({action : 'leave_chat', item :{chat : set.tag}}))
    }
    else if (set.action === 'send')
        props.socket.send()
}