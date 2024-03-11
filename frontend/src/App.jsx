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

	// useEffect(() =>{
	// 	setInterval(() => {
	// 		console.log(sessionStorage.getItem('currentPage'))
	// 		if (sessionStorage.getItem('currentPage') === 'Profile') {
	// 			request.open('GET', "fetchProfile?id=".concat(profileId))
	// 			request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
	// 			request.send()
	// 			request.onload = () => {
	// 				setProfile(request.response.profile)
	// 				setFriends(request.response.friends)
	// 			}
	// 		}
	// 		if (sessionStorage.getItem('currentPage') === 'Leaderboard') {
	// 			request.open('GET', "fetchLadder?game=".concat(game))
	// 			request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
	// 			request.send()
	// 			request.onload = () => setLadder(request.response)
	// 		}
	// 		if (sessionStorage.getItem('currentPage') === 'Tournaments') {
	// 			request.open('GET', "fetchTournaments?game=".concat(game, '?id=', tournamentId))
	// 			request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
	// 			request.send()
	// 			request.onload = () => {
	// 				if (tournamentId === 0)
	// 					setTournaments(request.response)
	// 				else
	// 					setTournament(request.response)
	// 			}
	// 		}
	// 		if (sessionStorage.getItem('currentPage') === 'Play' && myProfile !== 'none' && myProfile.scope === 'remote') {
	// 			request.open('GET', "fetchPlay?id=".concat(myProfile.id, '?game=', game))
	// 			request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
	// 			request.send()
	// 			request.onload = () => {
	// 				setChallengers(request.response.challengers)
	// 				setChallenged(request.response.challenged)
	// 				setTournaments(request.response.tournaments)
	// 			}
	// 		}
	// 	}, 5000)
	// })

	if (!initialSet) {
		// let myId = getMyId(localStorage.getItem('ft_transcendenceCred'))
		let myId = 1
		if (myId < 0)
			return <img src="/images/magicWord.gif" alt="" style={{height: '100%', width: '100%'}} />
		else if (myId > 0) {
			var initRequest = new XMLHttpRequest()
			let creds = localStorage.getItem('ft_transcendenceCred')
			// request.open('GET', "siteLoad?id=".concat(myId, '?login=', creds.login, '?password=', creds.password))
			initRequest.open('GET', "/data/initialJSON.json")
			initRequest.responseType = 'json'
			initRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
			initRequest.send()
			initRequest.onload = () => {
			let response = initRequest.response
				setMyProfile(response.myProfile)
				setAvatarSm(response.myProfile.avatar)
				setGame(response.myProfile.game)
				let on = []
				let off = []
				for (let item of response.tournaments) {
					if (item.winnerId === 0 && item.reasonForNoWinner === '')
						on.push(item)
					else
						off.push(item)
				}
				setTournaments(on.concat(off))
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