import React, { useEffect, useState } from 'react'
import NavBar from './NavBar.jsx'
import Chat from './Chat.jsx'
import MainFrame from './mainFrame.jsx'
import { useMediaQuery } from 'react-responsive'
import { useNavigate } from 'react-router-dom'
import { getLanguage } from './trad.js'

function WebSite() {

	const navigate = useNavigate()
	const [hack, setHack] = useState(false)
	const [language, setLanguage] = useState(undefined)
	const [myProfile, setMyProfile] = useState(undefined)
	const [chanTag, setChanTag] = useState('chat_general')
	const [chanName, setChanName] = useState('general')
	const [chats, setChats] = useState([{tag : 'chat_general', name : 'general', autoScroll : true, messages : []}])
	const [muted, setMuted] = useState([])
	const [socket, setSocket] = useState(undefined)
	const sm = useMediaQuery({query: '(min-width: 481px)'})
	const md = useMediaQuery({query: '(min-width: 769px)'})
	const lg = useMediaQuery({query: '(min-width: 900px)'})
	const xlg = useMediaQuery({query: '(min-width: 1201px)'})
	const xxlg = useMediaQuery({query: '(min-width: 1350px)'})
	const xxxlg = useMediaQuery({query: '(min-width: 1824px)'})
	const [settings, setSettings] = useState({
		game : 'pong',
		scope : 'remote',
		spectate : true,
		challengeable : true,
		language : 'en'
	})
	const customwindow =  {
        backgroundColor: '#ced4da',
        overflow: 'auto',
        height: xlg ? '75%' : '95%',
        width: xlg ? '75%' : '95%',
        padding: '10px 20px',
		borderRadius: '10px',
		border: '2px solid black'
    }

	// const myChat = useCallback((set) => {
	// 	if (set.action === 'mute')
	// 		setMuted([...muted, set.id])
	// 	else if (set.action === 'unmute')
	// 		setMuted(muted.filter(item => item !== set.id))
	// 	else if (set.action === 'join_chat') {
	// 		socket.send(JSON.stringify({action : "join_chat", item : {chat : set.tag}}))
	// 		setChats([...chats, {tag : set.tag, name : set.name, autoScroll : true, messages : []}])
	// 		setChanTag(set.tag)
	// 		setChanName(set.name)
	// 	}
	// 	else if (set.action === 'leave_chat') {
	// 		setChats(chats.filter(chat => chat.tag !== set.tag))
	// 		if (chanTag === set.tag) {
	// 			setChanTag('chat_general')
	// 			setChanName('general')
	// 		}
	// 		socket.send(JSON.stringify({action : 'leave_chat', item :{chat : set.tag}}))
	// 	}
	// 	else if (set.action === 'getMuted')
	// 		return muted
	// 	else if (set.action === 'getChats')
	// 		return chats
	// }, [chats, chanTag, muted, socket])

	useEffect(() => {
		if (!socket) {
			setLanguage(getLanguage('en'))
			setSocket(new WebSocket('ws://' + window.location.host + '/ws/'))
		}
		else {
			if (!socket.danger) {
				socket.danger = ['blocked', 'requested', 'noUser', 'dismissedFriend', 'pongDismissed', 'tictactoeDismissed', 'unfriended', 'isOffline', 'playing', 'cancelled', 'joinedMatch', 'loggedOut', 'notChallengeable', 'chatError']
				socket.primary = ['acceptedFriend', 'pongChallenge', 'tictactoeChallenge', 'friendRequest', 'startTournament']
			}
			socket.onopen = () => setChats(chats.map(chat => { return {...chat, messages : chat.messages.filter(message => message.type !== 'error')} }))
			socket.onerror = () => {
				setChats(chats.map(chat => { return {...chat, messages : [...chat.messages, {type : 'error'}]} }))
    	   		socket.close()
				setSocket(new WebSocket('ws://' + window.location.host + '/ws/'))
			}
			socket.onmessage = e => {
				let data = JSON.parse(e.data)
				if (data.action === 'myProfile') {
					setMyProfile(data.item)
					setLanguage(getLanguage(data.item.language))
					setSettings({...settings, language : data.item.language, game : data.item.game})
				}
				else if (data.action === 'system') {
					setChats(chats.map(chat => { return {...chat, messages : [...chat.messages, {type : 'system', subType : data.type, name : data.name}]} }))
					if (data.type === 'acceptedFriend')
						setMyProfile({...myProfile, friends : [...myProfile.friends, data.id]})
					else if (data.type === 'unfriended' || data.type === 'blocked')
						setMyProfile({...myProfile, friends : myProfile.friends.filter(item => item !== data.id)})
					else if (data.type === 'pongChallenge' || data.type === 'tictactoeChallenge')
						setMyProfile({...myProfile, [data.game + 'Challengers'] : [...myProfile[data.game + 'Challengers'], data.id]})
					else if (data.type === 'pongDismissed' || data.type === 'tictactoeDismissed')
						setMyProfile({
							...myProfile, 
							[data.game + 'Challengers'] : myProfile[data.game + 'Challengers'].filter(item => item !== data.id),
							room : data.reset ? undefined : myProfile.room
						})
					else if (data.type === 'joinedMatch' || data.type === 'loggedOut' || data.type === 'notChallengeable')
						setMyProfile({...myProfile, room : undefined, playing : false})
					if (!xlg && document.getElementById('chat2').hidden) {
						var list = document.getElementById('chatButton').classList
						if (socket.danger.includes(data.type)) {
							list.contains('border-white') && list.remove('border-white')
							list.contains('border-primary') && list.remove('border-primary')
							!list.contains('border-danger') && list.add('border-danger')
						}
						else if (socket.primary.includes(data.type)) {
							list.contains('border-white') && list.remove('border-white')
							list.contains('border-danger') && list.remove('border-danger')
							!list.contains('border-primary') && list.add('border-primary')
						}
					}
				}
				else if (data.action === "chat") {
					setChats(chats.map(chat => {
						if (data.type === 'whisp' || (chats.find(chat => chat.tag === data.target) && data.target === chat.tag))
							return {...chat, messages : [...chat.messages, data]}
						else
							return chat
						}))
				}
			}
			if (socket.readyState === 3 ) {
				const interval = setInterval(() => {
					setSocket(new WebSocket('ws://' + window.location.host + '/ws/'))
				}, 3000)
				return () => clearInterval(interval)
			}
		}
	}, [chats, socket, navigate, xlg, myProfile, settings])

	let props = {
		language,
		setLanguage,
		setHack,
		settings,
		setSettings,
		myProfile,
		setMyProfile,
		chanTag,
		setChanTag,
		chanName,
		setChanName,
		chats,
		setChats,
		muted,
		setMuted,
		socket,
		setSocket,
		sm,
		md,
		lg,
		xlg,
		xxlg,
		xxxlg,
		customwindow
	}

	if (hack)
		return <img src="/images/magicWord.gif" alt="" />

	if (!socket)
		return undefined

	// const props = {chats, setChats, chanTag, setChanTag, chanName, setChanName, muted, setMuted}
	const chat = <Chat props={props}  />

	// console.log(myProfile)
	// console.log(settings)

  	return (
	  	<>
  			<NavBar props={props} />
  			<div className="d-flex flex-grow-1" style={{maxHeight: 'calc(100vh - 50px)'}}>
  			  	{xlg && chat}
  			  	<MainFrame props={props} chat={chat} />
  			</div>
		</>
  	)
}

export default WebSite
