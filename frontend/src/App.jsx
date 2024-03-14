import React from 'react'
import { useState } from "react"
import NavBar from './NavBar.jsx'
import Chat from './Chat.jsx'
import MainFrame from './mainFrame.jsx'
import { useEffect } from 'react'

sessionStorage.setItem("currentPage", 'Home')

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

	var request = new XMLHttpRequest()
	request.responseType = 'json'

	useEffect(() =>{
		setInterval(() => {
			console.log(sessionStorage.getItem('currentPage'))
			if (sessionStorage.getItem('currentPage') === 'Profile') {
				request.open('GET', "fetchProfile?id=".concat(profileId))
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
				request.open('GET', "fetchLadder?game=".concat(game))
				request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
				request.send()
				request.onload = () => setLadder(request.response)
			}
			if (sessionStorage.getItem('currentPage') === 'Tournaments') {
				request.open('GET', "fetchTournaments?id=".concat(tournamentId, '?game=', game))
				request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
				request.send()
				request.onload = () => {
					if (tournamentId !== 0)
						setTournament(request.response)
					else {
						let on = []
						let off = []
						for (let item of request.response.tournaments) {
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
				request.open('GET', "fetchPlay?id=".concat(myProfile.id, '?game=', game))
				request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
				request.send()
				request.onload = () => {
					setChallengers(request.response.challengers)
					setChallenged(request.response.challenged)
					setTournaments(request.response.tournaments)
				}
			}
		}, 5000)
	})

	function getMyId(login, password) {
		return 1
	}

	if (!initialSet) {
		var initLogin = localStorage.getItem('ft_transcendenceLogin')
		var initPW = localStorage.getItem('ft_transcendencePassword')
		let myId = getMyId(initLogin, initPW)
		if (myId < 0)
			return <img src="/images/magicWord.gif" alt="" style={{height: '100%', width: '100%'}} />
		else {
			var initRequest = new XMLHttpRequest()
			request.open('GET', "siteLoad?id=".concat(myId, '?login=', initLogin ? initLogin : 'none', '?password=', initPW ? initPW : 'none'))
			initRequest.responseType = 'json'
			initRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
			initRequest.send()
			initRequest.onload = () => {
			let response = initRequest.response
				setLadder(response.ladder)
				let on = []
				let off = []
				for (let item of response.tournaments) {
					if (item.winnerId === 0 && item.reasonForNoWinner === '')
						on.push(item)
					else
						off.push(item)
				}
				setTournaments(on.concat(off))
				if (myId > 0) {
					setMyProfile(response.myProfile)
					setAvatarSm(response.myProfile.avatar)
					setGame(response.myProfile.game)
					setChallengers(response.challengers)
					setChallenged(response.challenged)
					let on = []
					let off = []
					for (let item of response.friends) {
						if (item.status === 'online')
							on.push(item)
						else
							off.push(item)
					}
					setFriends(on.concat(off))
				}
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
		setLadder
	}

  	return (
	  	<>
  			<NavBar props={props} />
  			<div className="d-flex flex-grow-1" style={{maxHeight: 'calc(100% - 50px)'}}>
  			  <Chat props={props} />
  			  <MainFrame props={props} />
  			</div>
		</>
  	)
}

export default WebSite