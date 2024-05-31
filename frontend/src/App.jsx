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
	const [language, setLanguage] = useState(getLanguage('en'))
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
		if (!socket)
			setSocket(new WebSocket('ws://localhost/ws/'))
		else {
			socket.onopen = () => setChats(chats.map(chat => { return {...chat, messages : chat.messages.filter(message => message.type !== 'error')} }))
			socket.onerror = () => {
				setChats(chats.map(chat => { return {...chat, messages : [...chat.messages, {type : 'error'}]} }))
    	   		socket.close()
			}
			socket.onclose = () => setChats(chats.map(chat => { return {...chat, messages : [...chat.messages, {type : 'error'}]} }))
			socket.onmessage = e => {
				let data = JSON.parse(e.data)
				// console.log(data)
				if (data.action === 'myProfile')
					setMyProfile(data.item)
				else if (data.action === 'system')
					setChats(chats.map(chat => { return {...chat, messages : [...chat.messages, {type : 'system', subType : data.type, name : data.name}]} }))
				else if (data.action === "chat") { 
					setChats(chats.map(chat => {
						if (data.type === 'whisp' || (chats.find(chat => chat.tag === data.target) && data.target === chat.tag))
							return {...chat, messages : [...chat.messages, data]}
						else
							return chat
						}))
					if (!xlg && document.getElementById('chat2').hidden) {
						var list = document.getElementById('chatButton').classList
						if (data.type === 'blocked' || data.type === 'requested' || data.type === 'taken' || data.type === 'unavailable') {
							list.contains('border-white') && list.remove('border-white')
							list.contains('border-primary') && list.remove('border-primary')
							!list.contains('border-danger') && list.add('border-danger')
						}
						else if (data.type === 'friendAccept' || data.type === 'invitation') {
							list.contains('border-white') && list.remove('border-white')
							list.contains('border-danger') && list.remove('border-danger')
							!list.contains('border-primary') && list.add('border-primary')
						}
					}
				}
			}
			if (socket.readyState === 3 ) {
				const interval = setInterval(() => {
					setSocket(new WebSocket('ws://localhost/ws/'))
				}, 3000)
				return () => clearInterval(interval)
			}
		}
		// if (myProfile) {
		// 	const interval = setInterval(() => {
		// 		fetch('/profiles/friendlist').then(response => {
		// 			if (response.status === 200) 
		// 				response.json().then(data => setMyProfile({...myProfile, friends : data}))
		// 		})
		// 	}, 5000)
		// 	return () => clearInterval(interval)
		// }
	}, [chats, socket, navigate, xlg])

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
