import React, { useEffect } from 'react'
import { useState } from "react"
import NavBar from './NavBar.jsx'
import Chat from './Chat.jsx'
import MainFrame from './mainFrame.jsx'
import { useMediaQuery } from 'react-responsive'

var mySource
var xhr

export function setMySource(source) {
	mySource = source
}

// export function toChat(message) {
// 	socket.send(message)
// }

function WebSite() {

	const [game, setGame] = useState('pong')
	const [myProfile, setMyProfile] = useState(undefined)
	const [chanTag, setChanTag] = useState('lobby')
	const [chanName, setChanName] = useState('general')
	const [chats, setChats] = useState([{tag : 'lobby', name : 'general', autoScroll : true, messages : []}])
	const [creds, setCreds] = useState(undefined)
	const [muted, setMuted] = useState([])
	const [init, setInit] = useState(false)
	const socket = new WebSocket('ws://' + window.location.host + '/ws/chat/general/')
	const sm = useMediaQuery({query: '(min-width: 481px)'})
	const md = useMediaQuery({query: '(min-width: 769px)'})
	const xlg = useMediaQuery({query: '(min-width: 1201px)'})
	const xxlg = useMediaQuery({query: '(min-width: 1350px)'})
	const xxxlg = useMediaQuery({query: '(min-width: 1824px)'})
	const [settings, setSettings] = useState({
		game : '',
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
		socket.onerror = () => setChats(chats.map(chat => { return {...chat, messages : [...chat.messages, {type : 'error'}]} }))
		socket.onmessage = e => {
			const receivedMessage = JSON.parse(e.data)
			setChats(chats.map(chat => {
				if (receivedMessage.type === 'whisp' || receivedMessage.type === 'admin' || (chats.find(chat => chat.name === receivedMessage.target) && receivedMessage.target === chat.name))
					return {...chat, messages : [...chat.messages, receivedMessage]}
				else
					return chat
				}))
		}
	}, [chats])

	let props = {
		game, 
		setGame,
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
		creds,
		setCreds,
		muted,
		setMuted,
		sm,
		md,
		xlg,
		xxlg,
		xxxlg,
		customwindow
	}

	if (!init) {
		var tmp = {
			name : localStorage.getItem('ft_transcendenceLogin'),
			password : localStorage.getItem('ft_transcendencePassword')
		}
		// if (tmp.name) {
			xhr = new XMLHttpRequest()
			xhr.logForm = tmp
			// xhr.open('GET', '/authenticate/sign_in/', true, xhr.logForm.name, xhr.logForm.password)
			xhr.open('GET', '/aapi/user/' + 1 + '.json')
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 3) {
					setCreds(xhr.logForm)
					let response = JSON.parse(xhr.response)
					// mySource = new EventSource('/api/user/' + response + '/')
					// mySource.onmessage = (e) => setMyProfile(e.data)
					setMyProfile(response)
				}
			}
			xhr.send()
		// }
		setInit(true)
	}

	const chat = <Chat props={props} socket={socket} />

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