import React from 'react'
import { useState, useEffect } from "react"
import NavBar from './NavBar.jsx'
import Chat from './Chat.jsx'
import { Channel } from './Chat.jsx'
import MainFrame from './mainFrame.jsx'
import { useMediaQuery } from 'react-responsive'

sessionStorage.setItem("currentPage", 'Home')
// sessionStorage.setItem('sessionToken', createToken())
var request = new XMLHttpRequest()
request.responseType = 'json'

function WebSite() {

	const [game, setGame] = useState('pong')
	const [myProfile, setMyProfile] = useState('none')
	const [profile, setProfile] = useState('none')
	const [profileId, setProfileId] = useState(0)
	const [friends, setFriends] = useState('none')
	const [challengers, setChallengers] = useState('none')
	const [challenged, setChallenged] = useState('none')
	const [avatarSm, setAvatarSm] = useState('base_profile_picture.png')
	const [tournaments, setTournaments] = useState('none')
	const [tournamentId, setTournamentId] = useState(0)
	const [tournament, setTournament] = useState('none')
	const [ladder, setLadder] = useState('none')
	const [initialSet, setInitialSet] = useState(false)
    const [displayChat, setDisplayChat] = useState(false)
	const [refresh, setRefresh] = useState(false)
	const [activeTab, setActiveTab] = useState('All Tournaments')
	const [chan, setChan] = useState('general')
	const [chanList, setChanList] = useState(['general'])
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

	useEffect(() => {
		if (!refresh) 
			return
		if (sessionStorage.getItem('currentPage') === 'Profile') {
			// request.open('GET', "/api/user?id=".concat(profileId))
			request.open('GET', '/data/sampleProfile.json')
			request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
			request.send()
			request.onload = () => {
				setProfile(request.response.profile)
				var on = []
				var off = []
				for (let item of request.response.friends) {
					if (item.status === 'online')
						on.push(item)
					else
						off.push(item)
				}
				props.setFriends(on.concat(off))
			}
		}
		if (sessionStorage.getItem('currentPage') === 'Leaderboard') {
			// request.open('GET', "api/ladder?game=".concat(game))
			request.open('GET', '/data/sampleLadder.json')
			request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
			request.send()
			request.onload = () => setLadder(request.response)
		}
		if (sessionStorage.getItem('currentPage') === 'Tournaments') {
			// request.open('GET', "/api/tournaments?id=".concat(tournamentId))
			request.open('GET', '/data/sampleTournament'.concat(tournamentId === 0 ? 's' : '', '.json'))
			request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
			request.send()
			request.onload = () => {
				if (tournamentId !== 0)
					setTournament(request.response)
				else {
					let on = []
					let off = []
					for (let item of request.response) {
						if (item.winnerId === 0 && item.reasonForNoWinner === '')
							on.push(item)
						else
							off.push(item)
					}
					props.setTournaments(on.concat(off))
				}
			}
		}
		if (sessionStorage.getItem('currentPage') === 'Play' && myProfile !== 'none' && myProfile.scope === 'remote') {
			// request.open('GET', "/api/user?id=".concat(myProfile.id))
			request.open('GET', '/data/samplePlay.json')
			request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
			request.send()
			request.onload = () => {
				setChallengers(request.response[game].challengers)
				setChallenged(request.response[game].challenged)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[refresh])
	useEffect(() => {
		let page = sessionStorage.getItem('currentPage')
		const inter = setInterval(() => {
			if (page === 'Profile' || page === 'Leaderboard' || page === 'Tournaments' || (page === 'Play' && myProfile !== 'none' && myProfile.scope === 'remote'))
				setRefresh(prev => !prev);
		}, 5000)
		return () => clearInterval(inter)
	})

	let props = {
		game,
		setGame,
		myProfile,
		setMyProfile,
		profile,
		setProfile,
		profileId,
		setProfileId,
		friends,
		setFriends,
		challengers,
		setChallengers,
		challenged,
		setChallenged,
		avatarSm,
		setAvatarSm,
		tournaments,
		setTournaments,
		tournamentId,
		setTournamentId,
		tournament,
		setTournament,
		ladder,
		setLadder,
		displayChat,
		setDisplayChat,
		activeTab,
		setActiveTab,
		chan,
		setChan,
		chanList,
		setChanList,
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
		var initLogin = localStorage.getItem('ft_transcendenceLogin')
		var initPW = localStorage.getItem('ft_transcendencePassword')
		// if (initLogin) {
			var initRequest = new XMLHttpRequest()
			// initRequest.open('GET', "/api/user?login=".concat(initLogin, '?password=', initPW))
			initRequest.open('GET', '/data/sampleInit.json')
			initRequest.responseType = 'json'
			initRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
			initRequest.send()
			initRequest.onload = () => {
				setMyProfile(initRequest.response.profile)
				setAvatarSm(initRequest.response.profile.avatar)
				setGame(initRequest.response.profile.game)
				sessionStorage.setItem('ft_transcendenceSessionLogin', initLogin)
                sessionStorage.setItem('ft_transcendenceSessionPassword', initPW)
				sessionStorage.setItem('myId', myProfile.id)
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