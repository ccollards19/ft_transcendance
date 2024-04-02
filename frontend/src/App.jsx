import React from 'react'
import { useState } from "react"
import NavBar from './NavBar.jsx'
import Chat from './Chat.jsx'
import MainFrame from './mainFrame.jsx'
import { useMediaQuery } from 'react-responsive'

var mySource

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
	const [chan, setChan] = useState('general')
	const [chanList, setChanList] = useState(['general'])
	const [sockets, setSockets] = useState([])
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
		chan,
		setChan,
		chanList,
		setChanList,
		sockets,
		setSockets,
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
		var tmp = {
			name : localStorage.getItem('ft_transcendenceLogin'),
			password : localStorage.getItem('ft_transcendencePassword')
		}
		// if (tmp.name) {
			var xhr = new XMLHttpRequest()
			// xhr.open('GET', '/authenticate/sign_in/', true, tmp.name, tmp.password)
			xhr.open('GET', '/api/user/' + 1 + '.json')
			xhr.send()
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 3) {
					setCreds({name : tmp.name, password : tmp.password})
					let response = JSON.parse(xhr.response)
					// mySource = new EventSource('/api/user/' + response + '/')
					// mySource.onmessage = (e) => setMyProfile(JSON.parse(e.data))
					setMyProfile(response)
				}
			}
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