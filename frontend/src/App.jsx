import React from 'react'
import { useState } from "react"
import NavBar from './NavBar.jsx'
import Chat from './Chat.jsx'
import MainFrame from './mainFrame.jsx'
import { useMediaQuery } from 'react-responsive'

// sessionStorage.setItem('sessionToken', createToken())

function WebSite() {

	const [page, setPage] = useState('Home')
	const [game, setGame] = useState('pong')
	const [myProfile, setMyProfile] = useState('none')
	const [profileId, setProfileId] = useState(0)
	const [avatarSm, setAvatarSm] = useState('base_profile_picture.png')
	const [tournamentId, setTournamentId] = useState(0)
	const [initialSet, setInitialSet] = useState(false)
    const [displayChat, setDisplayChat] = useState(false)
	const [chan, setChan] = useState('general')
	const [chanList, setChanList] = useState(['general'])
	const [sockets, setSockets] = useState([])
	const xsm = useMediaQuery({query: '(max-width: 480px)'})
	const sm = useMediaQuery({query: '(min-width: 481px)'})
	const md = useMediaQuery({query: '(min-width: 769px)'})
	const lg = useMediaQuery({query: '(min-width: 1025px)'})
	const xlg = useMediaQuery({query: '(min-width: 1201px)'})
	const xxlg = useMediaQuery({query: '(min-width: 1350px)'})
	const xxxlg = useMediaQuery({query: '(min-width: 1824px)'})
	const customwindow =  {
        backgroundColor: '#ced4da',
        overflow: 'auto',
        height: xlg ? '75%' : '85%',
        width: xlg ? '75%' : '95%',
        padding: '10px 20px',
		marginBottom: !xlg && '40px'
    }

	let props = {
		page,
		setPage,
		game,
		setGame,
		myProfile,
		setMyProfile,
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
		xsm,
		sm,
		md,
		lg,
		xlg,
		xxlg,
		xxxlg,
		customwindow
	}

	if (!initialSet) {
		var cred = {
			login : localStorage.getItem('ft_transcendenceLogin'),
			password : localStorage.getItem('ft_transcendencePassword')
		}
		// if (cred.login) {
			var initRequest = new XMLHttpRequest()
			// initRequest.open('GET', "/api/user/)
			initRequest.open('GET', '/data/sampleInit.json')
			initRequest.responseType = 'json'
			initRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
			initRequest.send(JSON.stringify(cred))
			initRequest.onload = () => {
				setMyProfile(initRequest.response.profile)
				setAvatarSm(initRequest.response.profile.avatar)
				setGame(initRequest.response.profile.game)
				sessionStorage.setItem('ft_transcendenceSessionLogin', cred.login)
                sessionStorage.setItem('ft_transcendenceSessionPassword', cred.password)
				sessionStorage.setItem('myId', initRequest.response.profile.id)
			}
		// }
		setInitialSet(true)
	}

	if (!initialSet) 
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