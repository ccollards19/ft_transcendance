import React from 'react'
import { useState } from "react"
import NavBar from './NavBar.jsx'
import Chat from './Chat.jsx'
import MainFrame from './mainFrame.jsx'

sessionStorage.setItem("currentPage", 'Home')

function WebSite() {

	// const [myId, setMyId] = useState(getMyId(localStorage.getItem('ft_transcendenceCred')))
	const [myId, setMyId] = useState(1)
  	const [game, setGame] = useState('pong')
	const [myProfile, setMyProfile] = useState('none')
	const [profile, setProfile] = useState({"pong" : {"rank" : "pirate-symbol-mark-svgrepo-com.svg"}, "friends" : []})
	const [friends, setFriends] = useState('none')
	const [challengers, setChallengers] = useState('none')
	const [challenged, setChallenged] = useState('none')
	const [avatarSm, setAvatarSm] = useState('base_profile_picture.png')
	const [tournaments, setTournaments] = useState('none')
	const [tournament, setTournament] = useState('none')
	const [ladder, setLadder] = useState('none')
	const [initialSet, setInitialSet] = useState(false)

	if (myId < 0)
		return <img src="/images/magicWord.gif" alt="" style={{height: '100%', width: '100%'}} />

	if (!initialSet) {
		setMyId(myId)
		let creds = localStorage.getItem('ft_transcendenceCred')
		let login = creds ? creds.login : ''
		let password = creds ? creds.password : ''
		var request = new XMLHttpRequest()
		// request.open('GET', "siteLoad?id=".concat(myId, '?login=', login, '?password=', password))
		request.open('GET', "/data/initialJSON.json")
		request.responseType = 'json'
		request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
		request.send()
		request.onload = () => {
			var response = request.response
			setLadder(response.ladder)
			setTournaments(response.tournaments)
			if (myId > 0) {
				setMyProfile(response.myProfile)
				setProfile(response.myProfile)
				setFriends(response.friends)
				setAvatarSm(response.myProfile.avatar)
				setChallengers(response.challengers)
				setChallenged(response.challenged)
				setGame(response.myProfile.game)
			}
		}
		setInitialSet(true)
	}

	if (ladder === 'none')
		return undefined

  	return (
	  	<>
  			<NavBar props={{myProfile, setMyProfile, avatarSm, setAvatarSm, setProfile, setFriends, setGame, setTournament}} />
  			<div className="d-flex flex-grow-1" style={{maxHeight: 'calc(100% - 50px)'}}>
  			  <Chat props={{myProfile, setProfile}} />
  			  <MainFrame props={{myProfile, setMyProfile, game, setGame, tournaments, setTournaments, challengers, setChallengers, challenged, setChallenged, ladder, setLadder, friends, setFriends, setAvatarSm, profile, setProfile, tournament, setTournament}} />
  			</div>
		</>
  	)
}

export default WebSite