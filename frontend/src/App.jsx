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

	useEffect(() => {
		if (!socket) {
			setLanguage(getLanguage('en'))
			setSocket(new WebSocket('ws://' + window.location.host + '/ws/'))
		}
		else {
			if (!socket.danger) {
				socket.danger = ['blocked', 'requested', 'noUser', 'dismissedFriend', 'pongDismissed', 'chessDismissed', 'unfriended', 'isOffline', 'playing', 'cancelled', 'joinedMatch', 'loggedOut']
				socket.primary = ['acceptedFriend', 'pongChallenge', 'chessChallenge', 'friendRequest', 'startTournament']
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
					else if (data.type === 'pongChallenge' || data.type === 'chessChallenge')
						setMyProfile({...myProfile, [data.game + 'Challengers'] : [...myProfile[data.game + 'Challengers'], data.id]})
					else if (data.type === 'pongDismissed' || data.type === 'chessDismissed')
						setMyProfile({
							...myProfile, 
							[data.game + 'Challengers'] : myProfile[data.game + 'Challengers'].filter(item => item !== data.id),
							room : data.reset ? undefined : myProfile.room
						})
					else if (data.type === 'joinedMatch' || data.type === 'loggedOut')
						setMyProfile({...myProfile, room : undefined})
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
		xlg,
		xxlg,
		xxxlg,
		customwindow
	}

	if (hack)
		return <img src="/images/magicWord.gif" alt="" />

	if (!socket)
		return undefined

	const chat = <Chat props={props} />

	// console.log(myProfile)

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
