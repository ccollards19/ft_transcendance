import React from 'react'
import { useState } from "react"
import NavBar from './NavBar.jsx'
import Chat from './Chat.jsx'
import MainFrame from './mainFrame.jsx'
import { useMediaQuery } from 'react-responsive'

var mySource
var socket
var xhr

export function setMySource(source) {
	mySource = source
}

function WebSite() {

	const [page, setPage] = useState('Home')
	const [game, setGame] = useState('pong')
	const [myProfile, setMyProfile] = useState(undefined)
	const [opponent, setOpponent] = useState(undefined)
	const [profileId, setProfileId] = useState(0)
	const [tournamentId, setTournamentId] = useState(0)
	const [initialSet, setInitialSet] = useState(false)
	const [chanTag, setChanTag] = useState('lobby')
	const [chanName, setChanName] = useState('general')
	const [chats, setChats] = useState([{tag : 'lobby', name : 'general', autoScroll : true, messages : [
		{
			type : "whisp",
			target : 1,
			name : "Roronoa Zoro",
			id : 3,
			text : "Yo ! Ca boume?"
		},
		{
			type : "message",
			target : 'lobby',
			name : "Trafalgar Law",
			id : 2,
			text : "Salut..."
		}
	]}])
	const [creds, setCreds] = useState(undefined)
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

	let props = {
		page,
		setPage,
		game, 
		setGame,
		settings,
		setSettings,
		myProfile,
		setMyProfile,
		opponent,
		setOpponent,
		profileId,
		setProfileId,
		tournamentId,
		setTournamentId,
		chanTag,
		setChanTag,
		chanName,
		setChanName,
		chats,
		setChats,
		creds,
		setCreds,
		sm,
		md,
		xlg,
		xxlg,
		xxxlg,
		customwindow
	}

	if (!initialSet) {
		socket = new WebSocket('ws://chat/')
		// socket.onerror = () => setChats(chats.map(chat => { return {...chat, messages : [...chat.messages, {type : 'error'}]} }))
		socket.onmessage = (e) => {
			const receivedMessage = JSON.parse(e.data)
			setChats(chats.map(chat => {
				if (receivedMessage.type === 'whisp' || receivedMessage.type === 'admin' || (chats.find(chat => chat.name === receivedMessage.target) && receivedMessage.target === chat.name))
					return {
						...chat,
						messages : [...chat.messages, receivedMessage]
					}
					else
						return chat
				}))
			setChats(chats.forEach(chat => {
				if ((receivedMessage.type === 'whisp' || receivedMessage.type === 'admin' || (chats.find(chat => chat.name === receivedMessage.target) && receivedMessage.target === chat.name)) && chat.autoScroll)
					chats.forEach(chat => document.getElementById(chat.tag).scrollTop = document.getElementById(chat.tag).scrollHeight)
			}))
		}
		
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
					mySource = new EventSource('/api/user/' + response + '/')
					mySource.onmessage = (e) => setMyProfile(e.data)
					setMyProfile(response.profile)
				}
			}
			xhr.send()
		// }
		setInitialSet(true)
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