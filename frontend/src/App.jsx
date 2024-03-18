import React from 'react'
import { useState, useEffect } from "react"
import NavBar from './NavBar.jsx'
import Chat from './Chat.jsx'
import MainFrame from './mainFrame.jsx'
import { useMediaQuery } from 'react-responsive'

sessionStorage.setItem("currentPage", 'Home')
localStorage.setItem('ft_transcendenceLogin', 'login')
localStorage.setItem('ft_transcendencePassword', 'password')

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
	const xsm = useMediaQuery({query: '(max-width: 480px)'})
	const sm = useMediaQuery({query: '(min-width: 481px,)'})
	const md = useMediaQuery({query: '(min-width: 769px)'})
	const lg = useMediaQuery({query: '(min-width: 1025px)'})
	const xlg = useMediaQuery({query: '(min-width: 1201px)'})
	const customwindow =  {
        backgroundColor: '#ced4da',
        overflow: 'auto',
        height: xlg ? '75%' : '95%',
        width: xlg ? '75%' : '95%',
        padding: '10px 20px'
    }

	var request = new XMLHttpRequest()
	request.responseType = 'json'

	useEffect(() =>{
		setInterval(() => {
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
				// request.open('GET', "/api/game?id=".concat(game, '?id=', tournamentId))
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
				// request.open('GET', "/api/user?id=".concat(myProfile.id, '?game=', game))
				request.open('GET', "/data/samplePlay.json")
				request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
				request.send()
				request.onload = () => {
					setChallengers(request.response.challengers)
					setChallenged(request.response.challenged)
				}
			}
		}, 5000)
	})

	if (!initialSet) {
		var initLogin = localStorage.getItem('ft_transcendenceLogin')
		var initPW = localStorage.getItem('ft_transcendencePassword')
		if (initLogin) {
			var initRequest = new XMLHttpRequest()
			// initRequest.open('GET', "/api/user?login=".concat(initLogin, '?password=', initPW))
			initRequest.open('GET', "/data/sampleInit.json")
			initRequest.responseType = 'json'
			initRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
			initRequest.send()
			initRequest.onload = () => {
				setMyProfile(initRequest.response.profile)
				setAvatarSm(initRequest.response.profile.avatar)
				setGame(initRequest.response.profile.game)
				sessionStorage.setItem('ft_transcendenceSessionLogin', initLogin)
            	sessionStorage.setItem('ft_transcendenceSessionPassword', initPW)
			}
		}
		setInitialSet(true)
	}

	if (!initialSet)
		return undefined

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
		xsm,
		sm,
		md,
		lg,
		xlg,
		customwindow
	}

	let chat = <Chat props={props} />

  	return (
	  	<>
  			<NavBar props={props} />
  			<div className="d-flex flex-grow-1" style={{maxHeight: 'calc(100% - 50px)'}}>
  			  {xlg ? chat : undefined}
  			  <MainFrame props={props} chat={chat} />
  			</div>
		</>
  	)
}

export default WebSite