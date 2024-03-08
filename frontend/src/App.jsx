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
		var request = new XMLHttpRequest()
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
				setAvatarSm(response.myProfile.avatar)
				setChallengers(response.challengers)
				setChallenged(response.challenged)
				setGame(response.myProfile.game)
			}
		}
		setInitialSet(true)
	}

	// if (!initialSet) {
	// 	setMyId(myId)
	// 	var profilesRequest = new XMLHttpRequest()
	// 	var ladderRequest = new XMLHttpRequest()
	// 	var tournamentsRequest = new XMLHttpRequest()
	// 	profilesRequest.responseType = ladderRequest.responseType = tournamentsRequest.responseType = 'json'
	// 	profilesRequest.open("GET", "/data/profiles.json")
    //     profilesRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
    //     profilesRequest.send()
    //     profilesRequest.onload = () => {
	// 		var initGame = 'pong'
	// 		var initProfiles = profilesRequest.response
	// 		var initProfile = 'none'
	// 		if (myId > 0) {
	// 			sessionStorage.setItem('ft_trenscendenceSessionCred', localStorage.getItem('ft_transcendenceCred'))
	// 			initProfile = initProfiles[myId]
	// 			setMyProfile(initProfile)
	// 			setProfile(initProfile)
	// 			setAvatarSm(initProfile.avatar)
	// 			let on = []
	//         	let off = []
	//         	for (let friend of initProfile.friends) {
	//         	    if (initProfiles[friend].status === 'online')
	//         	        on.push(initProfiles[friend])
	//         	    else
	//         	        off.push(initProfiles[friend])
	//         	}
	//         	setFriends(on.concat(off))
	// 			initGame = initProfile.game
	// 			setChallengers(initProfile[initGame].challengers.map((player) => initProfiles[player]))
	// 			setChallenged(initProfile[initGame].challenged.map((player) => initProfiles[player]))
	// 		}
	// 		setGame(initGame)
	// 		ladderRequest.open("GET", "/data/ladder_".concat(initGame, ".json"))
    //     	ladderRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
    //     	ladderRequest.send()
    //     	ladderRequest.onload = () => { setLadder(ladderRequest.response.map((champion) => initProfiles[champion])) }
	// 		tournamentsRequest.open("GET", "/data/tournaments_".concat(initGame, ".json"))
    //     	tournamentsRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
    //     	tournamentsRequest.send()
    //     	tournamentsRequest.onload = () => { setTournaments(tournamentsRequest.response) }
	// 	}
	// 	setInitialSet(true)
	// 	return undefined
	// }

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