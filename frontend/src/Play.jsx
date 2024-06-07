import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { Tournament } from "./Tournaments"
import * as Social from "./Social.js"
import NoPage from "./NoPage.jsx"

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
	})

	if (props.myProfile && props.myProfile.room > 0 && props.myProfile.playing)
		return <div className="d-flex justify-content-center align-items-center noScrollBar" style={props.customwindow}><img src="/images/loading.gif" alt="" /></div>

    return (
		<div style={props.customwindow} className="noScrollBar">
			{props.myProfile && props.settings.scope === 'remote' ?
				<Remote props={props} /> : <NoPage props={props} />
				// props.settings.game === 'pong' ?
				// <PongLocal props={props} /> :
				// <ChessLocal props={props} />
			}
		</div>
	)
}

// function Local({props}) {
	
// 	const [profile1, setProfile1] = useState(props.myProfile)
// 	const [profile2, setProfile2] = useState(undefined)

// 	if (!props.xlg)
// 		return <div className="d-flex text-center justify-content-center align-items-center fw-bold fs-1 h-100 w-100">{props.language.smallScreen}</div>

// 	const checkReady = () => {
// 		let check1 = profile1 ? document.getElementById('ready1').checked : document.getElementById('guest1').checked
// 		let check2 = profile2 ? document.getElementById('ready2').checked : document.getElementById('guest2').checked
// 		if (check1 && check2)
// 			document.getElementById('launchButton').disabled = false
// 		else
// 			document.getElementById('launchButton').disabled = true
// 	}

//     function checkIssue(form, player) {
//         let issue = false
//         if (form.login === '') {
// 			document.getElementById('logAddressLocal' + player).setAttribute('class', 'form-control border border-3 border-danger')
//             issue = true
//         }
//         if (form.password === '') {
//             document.getElementById('logPasswordLocal' + player).setAttribute('class', 'form-control border border-3 border-danger')
//             issue = true
//         }
//         return issue
//     }

// 	const loginLocal = e => {
//         let player = e.target.dataset.player
//         let form = {
// 			login : document.getElementById('logAddressLocal' + player).value,
// 			password : document.getElementById('logPasswordLocal' + player).value
// 		}
//         if (!checkIssue(form, player)) {
// 			let xhr = new XMLHttpRequest()
// 			xhr.open('GET', "/authenticate/sign_in/local/")
// 			xhr.send(JSON.stringify(form))
// 			xhr.onload = () => {
// 				if ('details' in xhr.response)
// 					document.getElementById('error' + player).hidden = false
// 				else {
// 					player === '1' ? setProfile1(xhr.response) : setProfile2(xhr.response)
// 					document.getElementById('error' + player).hidden = true
// 				}
//         	}
// 		}
// 	}

// 	const launchGame = () => {
// 		let info = {
// 			game : props.settings.game,
// 			profile1 : profile1 ? profile1 : 'guest',
// 			profile2 : profile2 ? profile2 : 'guest'
// 		}
// 		var request = new XMLHttpRequest()
// 		request.open('POST', "game/room/create/")
// 		request.send(JSON.stringify(info))
// 		request.onload = () => {}
// 	}

// 	const logout = () => {
// 		Social.leaveAllChats(props.socket, props.chats, props.setChats, props.setChanName, props.setChanTag)
// 		setProfile1(undefined)
//         props.setMyProfile(undefined)
//     	props.socket.close()
// 		let xhr = new XMLHttpRequest()
// 		xhr.open("POST", "/authenticate/sign_out/" + props.myProfile.id + '/')
// 		xhr.onload = () => props.setSocket(new WebSocket('ws://' + window.location.host + '/ws/'))
// 		xhr.send()
// 	}

// 	const logoutLocal = e => {
// 		if (e.target.dataset.profile) {
// 			if(window.confirm('Warning ! You will be disconnected from the website'))
// 				logout()
// 		}
// 		e.target.dataset.player === '1' ? setProfile1(undefined) : setProfile2(undefined)
// 	}

//     const typing = e => {
//         let player = e.target.dataset.player
// 		document.getElementById('logAddressLocal' + player).setAttribute('class', 'form-control')
// 		document.getElementById('logPasswordLocal' + player).setAttribute('class', 'form-control')
// 		document.getElementById('error' + player).hidden = true
// 		if (e.keyCode === 13) {
// 			e.preventDefault()
// 			loginLocal(e)
// 		}
//     }

// 	return (
// 		<>
// 			{props.myProfile ?
// 				<div className='d-flex justify-content-center fs-1 fw-bold text-success'>{props.settings.game === 'pong' ? props.language.letsPlayPong : props.language.letsPlayChess} !!!</div> :
//             	<div className="w-100 text-center dropdown-center mb-4">
//             	    <button type="button" className="btn btn-success" data-bs-toggle="dropdown">{props.language.whatGame} (<span className='fw-bold text-capitalize'>{props.settings.game === 'pong' ? 'Pong' : props.language.chess}</span>)</button>
//             	    <ul className="dropdown-menu">
//             	    	<li type='button' onClick={() => props.setSettings({...props.settings, game : 'pong'})} data-game='pong' className="dropdown-item d-flex align-items-center">
//             	    	    <img data-game='pong' src="/images/joystick.svg" alt="" />
//             	    	    <span data-game='pong' className="ms-2">Pong</span>
//             	    	</li>
//             	    	<li type='button' onClick={() => props.setSettings({...props.settings, game : 'chess'})} data-game='chess' className="dropdown-item d-flex align-items-center">
//             	    	    <img data-game='chess' src="/images/hourglass.svg" alt="" />
//             	    	    <span data-game='chess' className="ms-2">{props.language.chess}</span>
//             	    	</li>
//             	    </ul>
//             	</div>
// 			}
//             <div className={`d-flex flex-grow-1 align-items-center justify-content-between`} style={{height: '80%'}}>
//                 <div className={`${props.xxlg && 'border border-black border-3 rounded'} d-flex justify-content-center align-items-center`} style={{height: props.xxlg ? '100%' : '60%', width: '50%'}}>
// 					{profile1 ? 
// 						<div className="d-flex flex-column align-items-center">
// 							<img src={'/images/'.concat(profile1.avatar)} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
// 							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{profile1.name}</span>
// 							<span className="d-flex gap-2 mt-3">
// 								<input onChange={checkReady} className="form-check-input" type="checkbox" name="player1" id="ready1" />
// 								<label className="form-check-label" htmlFor="ready1">{props.language.ready} ?</label>
// 							</span>
// 							<button onClick={logoutLocal} data-player='player1' data-profile={props.myProfile} type='button' className="btn btn-primary mt-3">{props.language.menu2}</button>
// 						</div> :
// 						<div className={`d-flex flex-column align-items-center border border-black border-2 rounded ${props.xxlg ? 'p-5' : 'px-5 py-2'} bg-secondary`}>
// 							<form action="" className="d-flex flex-column align-items-center">
//                 			    <div className="mb-2">
//                 			        <label htmlFor="logAddressLocal1" className="form-label">E-mail</label>
//                 			        <input onKeyDown={typing} data-player='1' name="login" type="text" className="form-control" id="logAddressLocal1" />
//                 			    </div>
//                 			    <div className="mb-3">
//                 			        <label htmlFor="logPasswordLocal1" className="form-label">{props.language.password}</label>
//                 			        <input onKeyDown={typing} data-player='1' name="password" type="password" className="form-control" id="logPasswordLocal1" />
//                 			    </div>
//                                 <div id='error1' className="text-danger-emphasis mt-2" hidden>{props.language.wrongForm}</div>
//                 			    <button onClick={loginLocal} data-player='1' type="button" className="btn btn-info mb-2">{props.language.menu1}</button>
//                 			</form>
// 							<span className="d-flex gap-2 mt-3">
// 								<input onChange={checkReady} className="form-check-input" type="checkbox" name="player1" id="guest1" />
// 								<label className="form-check-label" htmlFor="guest1">{props.language.guest}</label>
// 							</span>
// 						</div>
// 					}
// 				</div>
//                 <img src="/images/versus.png" className="mx-3" alt="" style={{height: '150px',width: '100px'}} />
//                 <div className={`${props.xxlg && 'border border-black border-3 rounded'} d-flex justify-content-center align-items-center`} style={{height: props.xxlg ? '100%' : '60%', width: '50%'}}>
// 					{profile2 ? 
// 						<div className="d-flex flex-column align-items-center">
// 							<img src={'/images/'.concat(profile2.avatar)} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
// 							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{profile2.name}</span>
// 							<span className="d-flex gap-2 mt-3">
// 								<input onChange={checkReady} className="form-check-input" type="checkbox" name="player2" id="ready2" />
// 								<label className="form-check-label" htmlFor="ready1">{props.language.ready} ?</label>
// 							</span>
// 							<button onClick={logoutLocal} type='button' data-profile='none' className="btn btn-primary mt-3">{props.language.menu2}</button>
// 						</div> :
// 						<div className={`d-flex flex-column align-items-center border border-black border-2 rounded ${props.xxlg ? 'p-5' : 'px-5 py-2'} bg-secondary`}>
// 							<form action="" className="d-flex flex-column align-items-center">
//                 			    <div className="mb-2">
//                 			        <label htmlFor="logAddressLocal2" className="form-label">E-mail</label>
//                 			        <input onKeyDown={typing} data-player='2' name="login" type="text" className="form-control" id="logAddressLocal2" />
//                 			    </div>
//                 			    <div className="mb-3">
//                 			        <label htmlFor="logPasswordLocal2" className="form-label">{props.language.password}</label>
//                 			        <input onKeyDown={typing} data-player='2' name="password" type="password" className="form-control" id="logPasswordLocal2" />
//                 			    </div>
//                                 <div id='error2' className="text-danger-emphasis mt-2" hidden>{props.language.wrongForm}</div>
//                 			    <button onClick={loginLocal} data-player='2' type="button" className="btn btn-info mb-2">{props.language.menu1}</button>
//                 			</form>
// 							<span className="d-flex gap-2 mt-3">
// 								<input onChange={checkReady} className="form-check-input" type="checkbox" name="player2" id="guest2" />
// 								<label className="form-check-label" htmlFor="guest2">{props.language.guest}</label>
// 							</span>
// 						</div>
// 					}
// 				</div>
//             </div>
//             <div className="text-center mt-3">
//                 <button id='launchButton' onClick={launchGame} type="button" className="btn btn-warning" disabled>Let's rock !</button>
//             </div>
//         </>
// 	)
// }

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
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">{props.language.challengers} {challengers.length > 0 && <img src='/images/caret-down-fill.svg' alt='' className="ms-2" onClick={() => setDisplayChallengers(!displayChallengers)} />}</p>
				{challengers.length === 0 ?
				<div className='border border-black border-3 rounded d-flex justify-content-center align-items-center fw-bold' style={{height : '120px', width : '90%'}}>{props.language.noChallenger}</div> :
				displayChallengers && <ul className="list-group overflow-visible" style={{width: '90%'}}>
					{challengers.filter(item => item.status === 'online' && item.challengeable).map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
					{challengers.filter(item => item.status === 'offline' && !item.challengeable).map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
					{challengers.filter(item => item.status === 'offline').map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
				</ul>}
                <hr className="mx-5" />
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">{props.language.challenged} {challenged.length > 0 && <img src='/images/caret-down-fill.svg' alt='' className="ms-2" onClick={() => setDisplayChallenged(!displayChallenged)} />}</p>
				{challenged.length === 0 ?
				<div className='border border-black border-3 rounded d-flex justify-content-center align-items-center fw-bold' style={{height : '120px', width : '90%'}}>{props.language.noChallenged}</div> :
				displayChallenged && <ul className="list-group overflow-visible" style={{width: '90%'}}>
					{challenged.filter(item => item.status === 'online' && item.challengeable).map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
					{challenged.filter(item => item.status === 'offline' && !item.challengeable).map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
					{challenged.filter(item => item.status === 'offline').map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
				</ul>}
                <hr className="mx-5" />
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">{props.language.tournamentsSection} {tournaments.length > 0 && <img src='/images/caret-down-fill.svg' alt='' className="ms-2" onClick={() => setDisplayTournaments(!displayTournaments)} />}</p>
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
				if (response.status === 201) {
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
				menu.push(<Link to={'/game/' + challenger.room.game.name + '/' + challenger.room.id} className='px-2 dropdown-item nav-link' type='button' key={index++}>{props.language.watchGame}</Link>)
			else if (!challenger.playing && (!challenger.room || challenger.room.player2.id === props.myProfile.id))
				menu.push(<li onClick={joinMatch} className='px-2 dropdown-item nav-link' type='button' key={index++}>{props.language.joinMatch}</li>)
		}
		return menu
	}

	return (
		<li className={`list-group-item d-flex ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column align-items-center gap-2' : ''} ${(!challenger.challengeable || challenger.status === 'offline') && 'bg-dark-subtle'} ${challenger.room && challenger.room.player2.id === props.myProfile.id && 'bg-warning'}`}>
			<Link to={'/profile/' + challenger.id}>
				<img className="rounded-circle profileLink" title={props.language.seeProfile} src={challenger.avatar} alt="" style={{width: '45px', height: '45px'}} />
			</Link>
			<div className={`d-flex justify-content-between align-items-center fw-bold ms-2 flex-grow-1 ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column' : ''}`}>{challenger.name} {challenger.status === 'online' ? challenger.playing ? props.language.inAGame : props.language.available : '(' + props.language.offline + ')'} {!challenger.challengeable && props.language.butNotChallengeable} {challenger.room && challenger.room.player2.id === props.myProfile.id && props.language.waitingForU}
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
