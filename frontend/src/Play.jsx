import { Link, useNavigate } from "react-router-dom"
import React, { useState, useEffect } from "react"
import { Tournament } from "./Tournaments"
import * as Social from "./Social.js"
import PongLocal from "./Pong/local.jsx"

export default function Play({props}) {
	
	const navigate = useNavigate()

	useEffect(() => {
		if (props.myProfile && props.myProfile.room) {
			if (props.myProfile.playing) {
				fetch('/game/room/getGame/').then(response => {
					if (response.status === 200) {
						response.json().then(game => navigate('/game/' + game + '/' + props.myProfile.room))
					}
				})
			}
			else
				navigate('/match/' + props.myProfile.room)
		}
	}, [props, navigate])

	if (props.myProfile && props.myProfile.room > 0 && props.myProfile.playing)
		return <div className="d-flex justify-content-center align-items-center noScrollBar" style={props.customwindow}><img src="/images/loading.gif" alt="" /></div>

    if (!props.myProfile || props.settings.scope === 'local') {
		if (!props.md)
			return <div className="d-flex text-center justify-content-center align-items-center fw-bold fs-2" style={props.c2stomwindow}>{props.language.smallScreen}</div>
		else if (props.settings.game === 'pong')
			return <PongLocal props={props} />
	}
	
	return (
		<div style={props.customwindow} className="noScrollBar">
			<Remote props={props} />
		</div>
	)
}

// function ChessLocal({props}) {}


function Remote({props}) {

	const [challengers, setChallengers] = useState(undefined)
	const [challenged, setChallenged] = useState(undefined)
	const [tournaments, setTournaments] = useState(undefined)
	const [displayChallengers, setDisplayChallengers] = useState(true)
	const [displayChallenged, setDisplayChallenged] = useState(true)
	const [displayTournaments, setDisplayTournaments] = useState(true)

	useEffect(() => {
		if (!challengers) {
			fetch('/game/play/' + props.settings.game + '/').then(response => {
				if (response.status === 200) {
					response.json().then(data => {
						setChallengers(data.challengers)
						setChallenged(data.challenged)
						setTournaments(data.tournaments)
					})
				}
			})
		}
		const interval = setInterval(() => {
			fetch('/game/play/' + props.settings.game + '/').then(response => {
				if (response.status === 200) {
					response.json().then(data => {
						setChallengers(data.challengers)
						setChallenged(data.challenged)
						setTournaments(data.tournaments)
					})
				}
			})
		}, 3000)
		return () => clearInterval(interval)
	}, [props.settings.game, challengers, challenged, tournaments])

	if (!challengers || !challenged || !tournaments)
		return <div className='w-100 h-100 d-flex align-items-center justify-content-center noScrollBar'><img src="/images/loading.gif" alt="" /></div>
	
	const changeGame = e => {
		props.setSettings({...props.settings, game : e.target.dataset.game})
		setChallengers(undefined)
	}

	const getChessName = () => {
		if (props.language.menu1 === 'Connexion')
			return 'Echecs'
		else if (props.language.menu1 === 'Verbindung')
			return 'Schach'
		return 'Chess'
	}

	let index = 1

    return <>
                <div className="fs-2 fw-bold text-center">
					{props.language.wannaPlay} (<button type='button' className='nav-link text-primary text-capitalize d-inline' data-bs-toggle='dropdown'>{props.settings.game === 'pong' ? 'pong' : getChessName()}</button>) ?
					<ul className='dropdown-menu bg-light'>
					<li type='button' onClick={changeGame} data-game='pong' className="dropdown-item d-flex align-items-center">
            		    <img data-game='pong' src="/images/joystick.svg" alt="" />
            		    <span data-game='pong' className="ms-2">Pong</span>
            		</li>
            		<li type='button' onClick={changeGame} data-game='chess' className="dropdown-item d-flex align-items-center">
            		    <img data-game='chess' src="/images/hourglass.svg" alt="" />
            		    <span data-game='chess' className="ms-2">{props.language.chess}</span>
            		</li>
					</ul>
				</div>
                <hr className="mx-5" />
                {(challengers.length > 0 || challenged.length > 0) && <span className="ms-2">{props.language.tip}</span>}
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">{props.language.challengers} {challengers.length > 0 && <img src='/images/caret-down-fill.svg' alt='' className="ms-2 border border-black p-1 rounded bg-white" onClick={() => setDisplayChallengers(!displayChallengers)} />}</p>
				{challengers.length === 0 ?
				<div className='border border-black border-3 rounded d-flex justify-content-center align-items-center fw-bold' style={{height : '120px', width : '90%'}}>{props.language.noChallenger}</div> :
				displayChallengers && <ul className="list-group overflow-visible" style={{width: '90%'}}>
					{challengers.filter(item => item.status === 'online' && item.challengeable).map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
					{challengers.filter(item => item.status === 'offline' && !item.challengeable).map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
					{challengers.filter(item => item.status === 'offline').map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
				</ul>}
                <hr className="mx-5" />
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">{props.language.challenged} {challenged.length > 0 && <img src='/images/caret-down-fill.svg' alt='' className="ms-2 border border-black p-1 rounded bg-white" onClick={() => setDisplayChallenged(!displayChallenged)} />}</p>
				{challenged.length === 0 ?
				<div className='border border-black border-3 rounded d-flex justify-content-center align-items-center fw-bold' style={{height : '120px', width : '90%'}}>{props.language.noChallenged}</div> :
				displayChallenged && <ul className="list-group overflow-visible" style={{width: '90%'}}>
					{challenged.filter(item => item.status === 'online' && item.challengeable).map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
					{challenged.filter(item => item.status === 'offline' && !item.challengeable).map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
					{challenged.filter(item => item.status === 'offline').map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
				</ul>}
                <hr className="mx-5" />
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">{props.language.tournamentsSection} {tournaments.length > 0 && <img src='/images/caret-down-fill.svg' alt='' className="ms-2 border border-black p-1 rounded bg-white" onClick={() => setDisplayTournaments(!displayTournaments)} />}</p>
				{tournaments.length === 0 ?
				<div className='border border-black border-3 rounded d-flex justify-content-center align-items-center fw-bold' style={{height : '120px', width : '90%'}}>{props.language.noTournament}</div> :
				displayTournaments && <ul className="list-group overflow-visible" style={{width: '90%'}}>
					{tournaments.map(tournament => <Tournament key={index++} props={props} tournament={tournament} /> )}
				</ul>}
            </>
}

function Challenger({props, challenger, tab, challengers, setChallengers, challenged, setChallenged}) {

	const navigate = useNavigate()

	const dismiss = () => {
		props.socket.send(JSON.stringify({
			action : 'dismiss',
			item : {game : props.settings.game, id : challenger.id}
		}))
		tab === 'challengers' && setChallengers(challengers.filter(item => item.id !== challenger.id))
		tab === 'challenged' && setChallenged(challenged.filter(item => item.id !== challenger.id))
		props.setMyProfile({...props.myProfile, [props.settings.game + 'Challengers'] : props.myProfile[props.settings.game + 'Challengers'].filter(item => item !== challenger.id)})
	}

	const joinMatch = () => {
		if (!challenger.room) {
			fetch('/game/room/create/', {
				method : 'POST', 
				body : JSON.stringify({
					game : props.settings.game,
					player2 : challenger.id
				})
			}).then(response => {
				if (response.status === 401)
					props.setChats(props.chats.map(chat => { return {...chat, messages : [...chat.messages, {type : 'system', subType : 'allreadyInAMatch', name : challenger.name}]}}))
				else if (response.status === 200 || response.status === 201) {
					response.json().then(id => {
						props.setMyProfile({...props.myProfile, room : id})
						props.socket.send(JSON.stringify({action : 'joinMatch', item : {}}))
						navigate('/match/' + id)
					})
				}
			})
		}
		else {
			fetch('game/updateRoom/' + challenger.room.id + '/', {method : 'POST'}).then(response => {
				if (response.status === 200) {
					props.setMyProfile({...props.myProfile, room : challenger.room.id})
					props.socket.send(JSON.stringify({action : 'joinMatch', item : {}}))
					navigate('/match/' + challenger.room.id)
				}
			})
		}
	}

	const buildMenu = () => {
		let index = 1
		let menu
		menu = [<Link to={'/profile/' + challenger.id} className='px-2 dropdown-item nav-link' type='button' key={index++}>{props.language.seeProfile}</Link>]
		if (challenger.status === 'online') {
			menu.push(<li className='px-2 dropdown-item nav-link' type='button' key={index++} onClick={() => Social.directMessage(props.xlg, document.getElementById('chat2').hidden, challenger.name)}>{props.language.dm}</li>)
			if (challenger.playing && challenger.room.spectate)
				menu.push(<Link to={'/game/' + challenger.room.game + '/' + challenger.room.id} className='px-2 dropdown-item nav-link' type='button' key={index++}>{props.language.watchGame}</Link>)
			else if (!challenger.playing && (!challenger.room || challenger.room.player2.id === props.myProfile.id))
				menu.push(<li onClick={joinMatch} className='px-2 dropdown-item nav-link' type='button' key={index++}>{props.language.joinMatch}</li>)
		}
		return menu
	}

	const getBackgroundColor = () => {
		if (!challenger.challengeable || challenger.status === 'offline')
			return 'bg-dark-subtle'
		else if (challenger.room && challenger.room.player2.id === props.myProfile.id)
			return 'bg-warning'
		else if (challenger.room)
			return 'bg-dark-subtle'
		return 'bg-white'
	}

	const getStatus = () => {
		if (challenger.status === 'online') {
			if (challenger.playing)
				return props.language.inAGame
			else
				return props.language.available
		}
		return '(' + props.language.offline + ')'
	}

	const getComment = () => {
		if (!challenger.challengeable)
			return props.language.butNotChallengeable
		else if (challenger.room && challenger.room.player2.id === props.myProfile.id)
			return props.language.waitingForU
		return ''
	}

	// console.log(challenger)

	return (
		<li className={`${((!props.xxlg && props.xlg) || !props.md) && 'flex-column align-items-center gap-2'} list-group-item d-flex `.concat(getBackgroundColor())}>
			<Link to={'/profile/' + challenger.id}>
				<img className="rounded-circle profileLink" title={props.language.seeProfile} src={challenger.avatar} alt="" style={{width: '45px', height: '45px'}} />
			</Link>
			<div className={`d-flex justify-content-between align-items-center fw-bold ms-2 flex-grow-1 ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column' : ''}`}>{challenger.name} {getStatus()} {getComment()}
				<div className={`d-flex gap-2 dropstart button-group ${!props.sm && 'flex-column align-items-center'}`}>
					<button type='button' className={`btn btn-success`} data-bs-toggle='dropdown'>
						Options
					</button>
					<ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>
						{buildMenu()}
					</ul>
					<button onClick={dismiss} type='button' className={`btn btn-danger`}>
						{props.language.dismissChallenge}
					</button>
				</div>
			</div>
		</li>
	)
}
