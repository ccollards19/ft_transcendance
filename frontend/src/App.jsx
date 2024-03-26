import React from 'react'
import { useState } from "react"
import NavBar from './NavBar.jsx'
import Chat from './Chat.jsx'
import MainFrame from './mainFrame.jsx'
import { useMediaQuery } from 'react-responsive'

function WebSite() {

	const [page, setPage] = useState('Home')
	const [game, setGame] = useState('pong')
	const [myProfile, setMyProfile] = useState(undefined)
	const [opponent, setOpponent] = useState(undefined)
	const [friends, setFriends] = useState(undefined)
	const [profileId, setProfileId] = useState(0)
	const [avatarSm, setAvatarSm] = useState('base_profile_picture.png')
	const [tournamentId, setTournamentId] = useState(0)
	const [initialSet, setInitialSet] = useState(false)
    const [displayChat, setDisplayChat] = useState(false)
	const [chan, setChan] = useState('general')
	const [chanList, setChanList] = useState(['general'])
	const [sockets, setSockets] = useState([])
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
		friends,
		setFriends,
		profileId,
		setProfileId,
		avatarSm,
		setAvatarSm,
		tournamentId,
		setTournamentId,
		displayChat,
		setDisplayChat,
		chan,
		setChan,
		chanList,
		setChanList,
		sockets,
		setSockets,
		sm,
		md,
		xlg,
		xxlg,
		xxxlg,
		customwindow
	}

	if (!initialSet) {
		var cred = {
			name : localStorage.getItem('ft_transcendenceLogin'),
			password : localStorage.getItem('ft_transcendencePassword')
		}
		// if (cred.name) {
			var initRequest = new XMLHttpRequest()
			// initRequest.open('GET', "/authenticate/sign_in/")
			initRequest.open('GET', '/data/sampleInit.json')
			initRequest.responseType = 'json'
			initRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
			initRequest.send(JSON.stringify(cred))
			initRequest.onload = () => {
				// console.log(initRequest.response)
				setMyProfile(initRequest.response.profile)
				setAvatarSm(initRequest.response.profile.avatar)
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