import React from 'react'
import { useState } from "react";
import NavBar from './NavBar.jsx'
import Chat from './Chat.jsx'
import MainFrame from './mainFrame.jsx'

sessionStorage.setItem("currentPage", 'Home')
localStorage.setItem("myId", 1)

function WebSite() {

	const [profiles, setProfiles] = useState('none')
	const [profile, setProfile] = useState('none')
  	const [tournaments, setTournaments] = useState('none')
  	const [myProfile, setMyProfile] = useState('none')
	const [challengers, setChallengers] = useState('none')
	const [challenged, setChallenged] = useState('none')
	const [ladder, setLadder] = useState('none')
  	const [game, setGame] = useState('pong')
	const [friends, setFriends] = useState('none')
	const [tournamentId, setTournamentId] = useState(0)
	const [avatarSm, setAvatarSm] = useState('base_profile_picture.png')
	const [initialSet, setInitialSet] = useState(false)
	

	if (!initialSet) {
		var profilesRequest = new XMLHttpRequest()
		profilesRequest.open("GET", "/data/profiles.json")
        profilesRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
        profilesRequest.responseType = 'json'
        profilesRequest.send()
        profilesRequest.onload = () => { 
			let initProfiles = profilesRequest.response
			setProfiles(initProfiles)
			let myId = localStorage.getItem('myId')
			if (myId !== 0) {
				let initProfile = initProfiles[myId]
				setMyProfile(initProfile)
				setProfile(initProfile)
				let initGame = initProfile.game
				setGame(initGame)
				setAvatarSm(initProfile.avatar)
				setChallengers(initProfile[initGame].challengers.map((player) => initProfiles[player]))
				setChallenged(initProfile[initGame].challenged.map((player) => initProfiles[player]))
				let on = []
	        	let off = []
	        	for (let friend of initProfile.friends) {
	        	    if (initProfiles[friend].status === 'online')
	        	        on.push(initProfiles[friend])
	        	    else
	        	        off.push(initProfiles[friend])
	        	}
	        	setFriends(on.concat(off))
				var ladderRequest = new XMLHttpRequest()
				ladderRequest.open("GET", "/data/ladder_".concat(initGame, ".json"))
        		ladderRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
        		ladderRequest.responseType = 'json'
        		ladderRequest.send()
        		ladderRequest.onload = () => { setLadder(ladderRequest.response) }
				var tournamentsRequest = new XMLHttpRequest()
				tournamentsRequest.open("GET", "/data/tournaments_".concat(initGame, ".json"))
        		tournamentsRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
        		tournamentsRequest.responseType = 'json'
        		tournamentsRequest.send()
        		tournamentsRequest.onload = () => { setTournaments(tournamentsRequest.response) }
			}
		}
		if (localStorage.getItem('myId') === 0) {
			var ladderRequest = new XMLHttpRequest()
			ladderRequest.open("GET", "/data/ladder_pong.json")
        	ladderRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
        	ladderRequest.responseType = 'json'
        	ladderRequest.send()
        	ladderRequest.onload = () => { setLadder(ladderRequest.response) }
			var tournamentsRequest = new XMLHttpRequest()
			tournamentsRequest.open("GET", "/data/tournaments_pong.json")
        	tournamentsRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
        	tournamentsRequest.responseType = 'json'
        	tournamentsRequest.send()
        	tournamentsRequest.onload = () => { setTournaments(tournamentsRequest.response) }
		}
		setInitialSet(true)
		return undefined
	}

	if (profiles === 'none')
		return undefined

  	return (
  	  <>
  	    <NavBar props={{myProfile, setMyProfile, avatarSm, setAvatarSm, setProfile, setFriends, setProfiles}} />
  	    <div className="d-flex flex-grow-1" style={{maxHeight: 'calc(100% - 50px)'}}>
  	      <Chat props={{myProfile}} />
  	      <MainFrame props={{myProfile, setMyProfile, game, setGame, tournamentId, setTournamentId, tournaments, setTournaments, challengers, setChallengers, challenged, setChallenged, profiles, setProfiles, ladder, setLadder, friends, setFriends, setAvatarSm, profile, setProfile}} />
  	    </div>
  	  </>
  	)
}

export default WebSite
