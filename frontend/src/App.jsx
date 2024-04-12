import React, { useEffect, useState } from 'react'
import NavBar from './NavBar.jsx'
import Chat from './Chat.jsx'
import MainFrame from './mainFrame.jsx'
import { useMediaQuery } from 'react-responsive'

function WebSite() {

	const [myProfile, setMyProfile] = useState(undefined)
	const [chanTag, setChanTag] = useState('lobby')
	const [chanName, setChanName] = useState('general')
	const [chats, setChats] = useState([{tag : 'lobby', name : 'general', autoScroll : true, messages : []}])
	const [muted, setMuted] = useState([])
	const [init, setInit] = useState(false)
	const [socket, setSocket] = useState(new WebSocket('ws://localhost:5001'))
	const sm = useMediaQuery({query: '(min-width: 481px)'})
	const md = useMediaQuery({query: '(min-width: 769px)'})
	const xlg = useMediaQuery({query: '(min-width: 1201px)'})
	const xxlg = useMediaQuery({query: '(min-width: 1350px)'})
	const xxxlg = useMediaQuery({query: '(min-width: 1824px)'})
	const [settings, setSettings] = useState({
		game : 'pong',
		scope : 'remote',
		device : 'keyboard',
		queue : 0,
		spectate : true,
		challengeable : true
	})
	const customwindow =  {
        backgroundColor: '#ced4da',
        overflow: 'auto',
        height: xlg ? '75%' : '95%',
        width: xlg ? '75%' : '95%',
        padding: '10px 20px'
    }

	useEffect(() => {
		socket.onopen = () => setChats(chats.map(chat => { return {...chat, messages : chat.messages.filter(message => message.type !== 'error')} }))
		socket.onerror = () => setChats(chats.map(chat => { return {...chat, messages : [...chat.messages, {type : 'error'}]} }))
		socket.onMyProfile = data => setMyProfile(data)
		socket.onChat = data => {
			setChats(chats.map(chat => {
				if (data.type === 'whisp' || data.type === 'admin' || (chats.find(chat => chat.tag === data.target) && data.target === chat.tag))
					return {...chat, messages : [...chat.messages, data]}
				else
					return chat
				}))
		}
		// const interval = setInterval(() => {
		// 	if (socket.readyState === 3 || socket.readyState === 0)
		// 		setSocket(new WebSocket('ws://localhost:5001'))
		// }, 5000)
		// return () => clearInterval(interval)
	}, [chats, socket])

	let props = {
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

	if (!init) {
		// if (localStorage.getItem('ft_transcendenceLogin')) {
			let xhr = new XMLHttpRequest()
			xhr.logForm = {
				name : localStorage.getItem('ft_transcendenceLogin'),
				password : localStorage.getItem('ft_transcendencePassword')
			}
			// xhr.open('GET', '/authenticate/sign_in/', true, xhr.logForm.name, xhr.logForm.password)
			xhr.open('GET', '/aapi/user/' + 1 + '.json')
			xhr.onload = () => setMyProfile(JSON.parse(xhr.response))
			xhr.send()
		// }
		setInit(true)
	}

	const chat = <Chat props={props} />

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