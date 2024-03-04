import React from 'react'
import { useState } from "react";
import NavBar from './NavBar.jsx'
import Chat from './Chat.jsx'
import MainFrame from './mainFrame.jsx'

sessionStorage.setItem("currentPage", 'Home')

function WebSite() {

	const [profiles, setProfiles] = useState('none')
  	const [tournaments, setTournaments] = useState('none')
  	const [myProfile, setMyProfile] = useState('none')
	const [ladder, setLadder] = useState('none')
  	const [game, setGame] = useState('pong')
	const [profileId, setProfileId] = useState(0)
	const [tournamentId, setTournamentId] = useState(0)
	const [initialSet, setInitialSet] = useState(false)
	

	if (!initialSet) {
		var profilesReq = new XMLHttpRequest()
		var tournReq = new XMLHttpRequest()
	}

  	return (
  	  <>
  	    <NavBar myProfile={myProfile} setMyProfile={setMyProfile} setProfileId={setProfileId} />
  	    <div className="d-flex flex-grow-1" style={{maxHeight: 'calc(100% - 50px)'}}>
  	      <Chat myProfile={myProfile} setProfileId={setProfileId} />
  	      <MainFrame profileId={profileId} setProfileId={setProfileId} myProfile={myProfile} setMyProfile={setMyProfile} game={game} setGame={setGame} tournamentId={tournamentId} setTournamentId={setTournamentId} tournaments={tournaments} setTournaments={setTournaments} />
  	    </div>
  	  </>
  	)
}

export default WebSite
