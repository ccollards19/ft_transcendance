import React, { useEffect, useState } from 'react'
import NavBar from './NavBar.jsx'
import Chat from './Chat.jsx'
import MainFrame from './mainFrame.jsx'
import { useMediaQuery } from 'react-responsive'
import { useNavigate } from 'react-router-dom'

function WebSite() {

	const navigate = useNavigate()
	const [hack, setHack] = useState(false)
	const [myProfile, setMyProfile] = useState(undefined)
	const [chanTag, setChanTag] = useState('chat_general')
	const [chanName, setChanName] = useState('general')
	const [chats, setChats] = useState([{tag : 'chat_general', name : 'general', autoScroll : true, messages : []}])
	const [muted, setMuted] = useState([])
	const [socket, setSocket] = useState(undefined)
	const [request, setRequest] = useState(undefined)
	const sm = useMediaQuery({query: '(min-width: 481px)'})
	const md = useMediaQuery({query: '(min-width: 769px)'})
	const xlg = useMediaQuery({query: '(min-width: 1201px)'})
	const xxlg = useMediaQuery({query: '(min-width: 1350px)'})
	const xxxlg = useMediaQuery({query: '(min-width: 1824px)'})
	const [settings, setSettings] = useState({
		game : 'pong',
		scope : 'remote',
		spectate : true,
		challengeable : true
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
		if (!request || (request && request.log === true)) {
			setSocket(new WebSocket('ws://localhost/ws/'))
			let xhr = new XMLHttpRequest()
			xhr.open('GET', '/api/profile/')
			xhr.onload = () => {
				if (xhr.status === 200) {
					let response = JSON.parse(xhr.response)
					setMyProfile(response)
					if (request && request.nav === true) {
						request.nav = false
						navigate('/profile/' + response.id)
					}
				}
			}
			xhr.send()
			if (!request)
				setRequest(xhr)
			else if (request && request.log === true) {
				request.log = false
				request.nav = true
			}
		}
		if (socket && !socket.error) {
			socket.onopen = () => setChats(chats.map(chat => { return {...chat, messages : chat.messages.filter(message => message.type !== 'error')} }))
			socket.onerror = () => {
				setChats(chats.map(chat => { return {...chat, messages : [...chat.messages, {type : 'error'}]} }))
				socket.error = true
       			socket.close()
			}
			socket.onclose = () => {
				setChats(chats.map(chat => { return {...chat, messages : [...chat.messages, {type : 'error'}]} }))
				socket.error = true
			}
			socket.onMyProfile = data => setMyProfile(data.item)
			socket.onChat = data => {
				setChats(chats.map(chat => {
					if (data.type === 'whisp' || data.type === 'admin' || (chats.find(chat => chat.tag === data.target) && data.target === chat.tag))
						return {...chat, messages : [...chat.messages, data]}
					else
						return chat
					}))
			}
		}
		else if (socket && socket.error) {
			let sock = new WebSocket('ws://localhost/ws/')
			sock.id = socket.id 
			setSocket(sock)
		}
	}, [chats, socket, request, navigate])

	let props = {
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
		request,
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
