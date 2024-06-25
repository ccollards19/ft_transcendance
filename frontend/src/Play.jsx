import { Link, useNavigate } from "react-router-dom"
import React, { useState, useEffect } from "react"
import { Tournament } from "./Tournaments"
import * as Social from "./Social.js"
import PongLocal from "./Pong/local.jsx"
import TicTacToeLocal from "./TicTacToe.jsx"
import { Modal } from "react-bootstrap"

export default function Play({props}) {
	
	const navigate = useNavigate()

	useEffect(() => {
		if (props.myProfile && props.myProfile.room) {
			if (props.myProfile.playing)
				navigate('/game/' + props.myProfile.room)
			else
				navigate('/match')
		}
	}, [props, navigate])

	if (props.myProfile && props.myProfile.room > 0 && props.myProfile.playing)
		return <div className="d-flex justify-content-center align-items-center noScrollBar" style={props.customwindow}><img src="/images/loading.gif" alt="" /></div>

    if (!props.myProfile || props.settings.scope === 'local') {
		if (!props.md)
			return <div className="d-flex text-center justify-content-center align-items-center fw-bold fs-2" style={props.customwindow}>{props.language.smallScreen}</div>
		else if (props.settings.game === 'pong')
			return <PongLocal props={props} />
		else if (props.settings.game === 'tictactoe')
			return <TicTacToeLocal props={props} />
	}
	
	return (
		<div style={props.customwindow} className="noScrollBar">
			<Remote props={props} />
		</div>
	)
}

function Remote({props}) {

	const [challengers, setChallengers] = useState(undefined)
	const [challenged, setChallenged] = useState(undefined)
	const [tournaments, setTournaments] = useState(undefined)
	const [displayChallengers, setDisplayChallengers] = useState(true)
	const [displayChallenged, setDisplayChallenged] = useState(true)
	const [displayTournaments, setDisplayTournaments] = useState(true)

	useEffect(() => {
		if (!challengers || challengers.game !== props.settings.game) {
			fetch('/game/play/' + props.settings.game + '/').then(response => {
				if (response.status === 200) {
					response.json().then(data => {
						setChallengers({game : props.settings.game, data : data.challengers})
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
						setChallengers({game : props.settings.game, data : data.challengers})
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

	let index = 1

    return <>
                <div className="fs-2 fw-bold text-center">
					<span className="text-decoration-underline">{props.language.wannaPlay} {props.settings.game === 'pong' ? 'Pong' : 'Tic-tac-toe'} ?</span>
				</div>
                <hr className="mx-5" />
                {(challengers.data?.length > 0 || challenged?.length > 0) && <span className="ms-2">{props.language.tip}</span>}
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">{props.language.challengers} {challengers?.data?.length > 0 && <img src='/images/caret-down-fill.svg' alt='' className="ms-2 border border-black p-1 rounded bg-white" onClick={() => setDisplayChallengers(!displayChallengers)} />}</p>
				{challengers?.data?.length === 0 ?
				<div className='border border-black border-3 rounded d-flex justify-content-center align-items-center fw-bold' style={{height : '120px', width : '90%'}}>{props.language.noChallenger}</div> :
				displayChallengers && <ul className="list-group" style={{width: '90%'}}>
					{challengers.data?.filter(item => item.status === 'online' && item.challengeable).map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
					{challengers.data?.filter(item => item.status === 'offline' && !item.challengeable).map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
					{challengers.data?.filter(item => item.status === 'offline').map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
				</ul>}
                <hr className="mx-5" />
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">{props.language.challenged} {challenged.length > 0 && <img src='/images/caret-down-fill.svg' alt='' className="ms-2 border border-black p-1 rounded bg-white" onClick={() => setDisplayChallenged(!displayChallenged)} />}</p>
				{challenged.length === 0 ?
				<div className='border border-black border-3 rounded d-flex justify-content-center align-items-center fw-bold' style={{height : '120px', width : '90%'}}>{props.language.noChallenged}</div> :
				displayChallenged && <ul className="list-group" style={{width: '90%'}}>
					{challenged.filter(item => item.status === 'online' && item.challengeable).map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challenged' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
					{challenged.filter(item => item.status === 'offline' && !item.challengeable).map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challenged' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
					{challenged.filter(item => item.status === 'offline').map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challenged' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
				</ul>}
                <hr className="mx-5" />
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">{props.language.tournamentsSection} {tournaments.length > 0 && <img src='/images/caret-down-fill.svg' alt='' className="ms-2 border border-black p-1 rounded bg-white" onClick={() => setDisplayTournaments(!displayTournaments)} />}</p>
				{tournaments.length === 0 ?
				<div className='border border-black border-3 rounded d-flex justify-content-center align-items-center fw-bold' style={{height : '120px', width : '90%'}}>{props.language.noTournament}</div> :
				displayTournaments && <ul className="list-group" style={{width: '90%'}}>
					{tournaments.map(tournament => <Tournament key={index++} props={props} tournament={tournament} /> )}
				</ul>}
            </>
}

function Challenger({props, challenger, tab, challengers, setChallengers, challenged, setChallenged}) {

	const [show, setShow] = useState(false)
	
	const navigate = useNavigate()

	const dismiss = () => {
		props.socket.send(JSON.stringify({
			action : 'dismiss',
			item : {game : props.settings.game, id : challenger.id}
		}))
		tab === 'challengers' && setChallengers(challengers.data.filter(item => item.id !== challenger.id))
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
						navigate('/match')
					})
				}
			})
		}
		else {
			fetch('game/updateRoom/' + challenger.room.id + '/', {method : 'POST'}).then(response => {
				if (response.status === 200) {
					props.setMyProfile({...props.myProfile, room : challenger.room.id})
					props.socket.send(JSON.stringify({action : 'joinMatch', item : {}}))
					navigate('/match')
				}
			})
		}
		setShow(false)
	}

	const buildMenu = () => {
		let index = 1
		let menu
		menu = [<li onClick={() => {
			navigate('/profile/' + challenger.id)
			setShow(false)
		}} className='text-center fs-3 fw-bold px-2 dropdown-item nav-link' type='button' key={index++}>{props.language.seeProfile}</li>]
		if (challenger.status === 'online') {
			menu.push(<li className='text-center fs-3 fw-bold px-2 dropdown-item nav-link' type='button' key={index++} onClick={() => {
				Social.directMessage(props.xlg, document.getElementById('chat2').hidden, challenger.name)
				setShow(false)
			}}>{props.language.dm}</li>)
			if (challenger.playing && challenger.room?.spectate)
				menu.push(<li onClick={() => {
					navigate('/game/' + challenger.room.id)
					setShow(false)
				}} className='text-center fs-3 fw-bold px-2 dropdown-item nav-link' type='button' key={index++}>{props.language.watchGame}</li>)
			else if (!challenger.playing && (!challenger.room || challenger.room.player2.id === props.myProfile.id) && props.xlg)
				menu.push(<li onClick={joinMatch} className='text-center fs-3 fw-bold px-2 dropdown-item nav-link' type='button' key={index++}>{props.language.joinMatch}</li>)
		}
		return menu
	}

	const getBackgroundColor = () => {
		if (!challenger.challengeable || challenger.status === 'offline')
			return 'bg-dark-subtle'
		else if (challenger.room && challenger.room.player2.id === props.myProfile.id && challenger.room.game === props.settings.game)
			return 'bg-warning'
		else if (challenger.room)
			return 'bg-dark-subtle'
		return 'bg-white'
	}

	const getStatus = () => {
		if (challenger.status === 'online') {
			if (challenger.playing)
				return props.language.inAGame
			else {
				if (!challenger.room)
					return props.language.available
				else {
					if (challenger.room.game === props.settings.game && challenger.room.player2.id === props.myProfile.id)
						return props.language.waitingForU
					else
						return props.language.inARoom
				}
			}
		}
		return '(' + props.language.offline + ')'
	}

	console.log(challenger)

	return (
		<li className={`${((!props.xxlg && props.xlg) || !props.md) && 'flex-column align-items-center gap-2'} list-group-item d-flex `.concat(getBackgroundColor())}>
			<Link to={'/profile/' + challenger.id}>
				<img className="rounded-circle profileLink" title={props.language.seeProfile} src={challenger.avatar} alt="" style={{width: '45px', height: '45px'}} />
			</Link>
			<div className={`d-flex justify-content-between align-items-center fw-bold ms-2 flex-grow-1 ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column' : ''}`}>{challenger.name} {getStatus()}
				<div className={`d-flex gap-2 dropstart button-group ${!props.sm && 'flex-column align-items-center'}`}>
					<button onClick={() => setShow(true)} type='button' className={`btn btn-success`}>Options</button>
					<Modal show={show} onHide={() => setShow(false)} centered>
        				<Modal.Header className="bg-danger" style={{height : '200px'}}>
        				  <Modal.Title className='w-100 d-flex justify-content-center'>
							<div style={{height : '150px', width : '150px'}}>
								<span className="d-flex justify-content-center fw-bold">{challenger.name}</span>
								<img src={challenger.avatar} alt="" className="w-100 h-100 rounded-circle" />
							</div>
						  </Modal.Title>
        				</Modal.Header>
        				<Modal.Body>
							{buildMenu()}
						</Modal.Body>
        				<Modal.Footer>
        				  <button type='button' className='btn btn-secondary' onClick={() => setShow(false)}>
        				    {props.language.close}
        				  </button>
        				</Modal.Footer>
      				</Modal>
					<button onClick={dismiss} type='button' className={`btn btn-danger`}>
						{props.language.dismissChallenge}
					</button>
				</div>
			</div>
		</li>
	)
}
