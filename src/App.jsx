import React from 'react'
import { useState } from "react"
import NavBar from './NavBar.jsx'
import Chat from './Chat.jsx'
import MainFrame from './mainFrame.jsx'

sessionStorage.setItem("currentPage", 'Home')

function getMyId(myCred)  {
	// Call DB to check creds
	return 1
}

function WebSite() {

	const [myId, setMyId] = useState(getMyId(localStorage.getItem('ft_transcendenceCred')))
  	const [game, setGame] = useState('none')
	const [myProfile, setMyProfile] = useState('none')
	const [profile, setProfile] = useState({"pong" : {"rank" : "pirate-symbol-mark-svgrepo-com.svg"}, "friends" : []})
	const [friends, setFriends] = useState('none')
	const [challengers, setChallengers] = useState('none')
	const [challenged, setChallenged] = useState('none')
	const [avatarSm, setAvatarSm] = useState('base_profile_picture.png')
	const [tournaments, setTournaments] = useState('none')
  	const [myTournaments, setMyTournaments] = useState('none')
	const [tournamentId, setTournamentId] = useState(0)
	const [ladder, setLadder] = useState('none')
	const [initialSet, setInitialSet] = useState(false)

	if (!initialSet) {
		setMyId(myId)
		var profilesRequest = new XMLHttpRequest()
		var ladderRequest = new XMLHttpRequest()
		var tournamentsRequest = new XMLHttpRequest()
		profilesRequest.responseType = ladderRequest.responseType = tournamentsRequest.responseType = 'json'
		profilesRequest.open("GET", "/data/profiles.json")
        profilesRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
        profilesRequest.send()
        profilesRequest.onload = () => {
			var initGame = 'pong'
			var initProfiles = profilesRequest.response
			var initProfile = 'none'
			if (myId > 0) {
				initProfile = initProfiles[myId]
				setMyProfile(initProfile)
				setProfile(initProfile)
				setAvatarSm(initProfile.avatar)
				let on = []
	        	let off = []
	        	for (let friend of initProfile.friends) {
	        	    if (initProfiles[friend].status === 'online')
	        	        on.push(initProfiles[friend])
	        	    else
	        	        off.push(initProfiles[friend])
	        	}
	        	setFriends(on.concat(off))
				initGame = initProfile.game
				setChallengers(initProfile[initGame].challengers.map((player) => initProfiles[player]))
				setChallenged(initProfile[initGame].challenged.map((player) => initProfiles[player]))
			}
			setGame(initGame)
			ladderRequest.open("GET", "/data/ladder_".concat(initGame, ".json"))
        	ladderRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
        	ladderRequest.send()
        	ladderRequest.onload = () => { setLadder(ladderRequest.response.map((champion) => initProfiles[champion])) }
			tournamentsRequest.open("GET", "/data/tournaments_".concat(initGame, ".json"))
        	tournamentsRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
        	tournamentsRequest.send()
        	tournamentsRequest.onload = () => { 
				let initTournaments = tournamentsRequest.response
				setTournaments(initTournaments)
				if (initProfile !== 'none') {
					let initMyTournaments = initProfile[initGame].tournaments.concat(initProfile[initGame].subscriptions)
					if (initMyTournaments.length !== 0)
						setMyTournaments(initMyTournaments.map((tournament) => initTournaments[tournament]))
				}
			}
		}
		setInitialSet(true)
		return undefined
	}

	if (game === 'none')
		return undefined

  	return (
  	  <>
  	    <NavBar props={{myProfile, setMyProfile, avatarSm, setAvatarSm, setProfile, setFriends, setGame, setTournamentId}} />
  	    <div className="d-flex flex-grow-1" style={{maxHeight: 'calc(100% - 50px)'}}>
  	      <Chat props={{myProfile, setProfile}} />
  	      <MainFrame props={{myProfile, setMyProfile, game, setGame, tournamentId, setTournamentId, tournaments, setTournaments, challengers, setChallengers, challenged, setChallenged, ladder, setLadder, friends, setFriends, setAvatarSm, profile, setProfile, myTournaments, setMyTournaments}} />
  	    </div>
  	  </>
  	)
}

export default WebSite