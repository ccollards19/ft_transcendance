import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { Tournament } from "./Tournaments"
import * as Social from "./Social.js"

export default function Play({props}) {

    return (
		<div style={props.customwindow}>
			{props.myProfile && props.settings.scope === 'remote' ?
				<Remote props={props} /> :
				<Local props={props} />
			}
		</div>
	)
}

function Local({props}) {
	const [profile1, setProfile1] = useState(props.myProfile)
	const [profile2, setProfile2] = useState(undefined)

	props.socket.send(JSON.stringify({
		component : 'local',
		action : undefined,
		item : undefined
	}))

	useEffect(() => {
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data.item)
			else if (data === 'chat')
				props.socket.onChat(data)
		}
	}, [props.socket, props.socket.onmessage])

	const checkReady = () => {
		let check1 = profile1 ? document.getElementById('ready1').checked : document.getElementById('guest1').checked
		let check2 = profile2 ? document.getElementById('ready2').checked : document.getElementById('guest2').checked
		if (check1 && check2)
			document.getElementById('launchButton').disabled = false
		else
			document.getElementById('launchButton').disabled = true
	}

    function checkIssue(form, player) {
        let issue = false
        if (form.login === '') {
			document.getElementById('logAddressLocal' + player).setAttribute('class', 'form-control border border-3 border-danger')
            issue = true
        }
        if (form.password === '') {
            document.getElementById('logPasswordLocal' + player).setAttribute('class', 'form-control border border-3 border-danger')
            issue = true
        }
        return issue
    }

	const loginLocal = e => {
        let player = e.target.dataset.player
        let form = {
			login : document.getElementById('logAddressLocal' + player).value,
			password : document.getElementById('logPasswordLocal' + player).value
		}
        if (!checkIssue(form, player)) {
			let xhr = new XMLHttpRequest()
			xhr.open('GET', "/authenticate/sign_in/local/")
			xhr.send(JSON.stringify(form))
			xhr.onload = () => {
				if ('details' in xhr.response)
					document.getElementById('error' + player).hidden = false
				else {
					player === '1' ? setProfile1(xhr.response) : setProfile2(xhr.response)
					document.getElementById('error' + player).hidden = true
				}
        	}
		}
	}

	const launchGame = () => {
		let info = {
			game : props.settings.game,
			profile1 : profile1 ? profile1 : 'guest',
			profile2 : profile2 ? profile2 : 'guest'
		}
		var request = new XMLHttpRequest()
		request.open('POST', "game/room/create/")
		request.send(JSON.stringify(info))
		request.onload = () => {}
	}

	const logout = () => {
		setProfile1(undefined)
        props.setMyProfile(undefined)
		let xhr = new XMLHttpRequest()
		xhr.open("POST", "/authenticate/sign_out/" + props.myProfile.id + '/')
		xhr.onload = () => {}
		xhr.send()
	}

	const logoutLocal = e => {
		if (e.target.dataset.profile) {
			if(window.confirm('Warning ! You will be disconnected from the website'))
				logout()
		}
		e.target.dataset.player === '1' ? setProfile1(undefined) : setProfile2(undefined)
	}

    const typing = e => {
        let player = e.target.dataset.player
		document.getElementById('logAddressLocal' + player).setAttribute('class', 'form-control')
		document.getElementById('logPasswordLocal' + player).setAttribute('class', 'form-control')
		document.getElementById('error' + player).hidden = true
		if (e.keyCode === 13) {
			e.preventDefault()
			loginLocal(e)
		}
    }

	return (
		<>
			{props.myProfile ?
				<div className='d-flex justify-content-center fs-1 fw-bold text-success'>Let's play {props.settings.game} !!!</div> :
            	<div className="w-100 text-center dropdown-center mb-4">
            	    <button type="button" className="btn btn-success" data-bs-toggle="dropdown">What game will you play? (<span className='fw-bold text-capitalize'>{props.settings.game}</span>)</button>
            	    <ul className="dropdown-menu">
            	    	<li type='button' onClick={() => props.setSettings({...props.settings, game : 'pong'})} data-game='pong' className="dropdown-item d-flex align-items-center">
            	    	    <img data-game='pong' src="/images/joystick.svg" alt="" />
            	    	    <span data-game='pong' className="ms-2">Pong</span>
            	    	</li>
            	    	<li type='button' onClick={() => props.setSettings({...props.settings, game : 'chess'})} data-game='chess' className="dropdown-item d-flex align-items-center">
            	    	    <img data-game='chess' src="/images/hourglass.svg" alt="" />
            	    	    <span data-game='chess' className="ms-2">Chess</span>
            	    	</li>
            	    </ul>
            	</div>
			}
            <div className={`d-flex flex-grow-1 align-items-center justify-content-between`} style={{height: '80%'}}>
                <div className={`${props.xxlg && 'border border-black border-3 rounded'} d-flex justify-content-center align-items-center`} style={{height: props.xxlg ? '100%' : '60%', width: '50%', transform: props.xxlg ? 'rotate(0deg)' : 'rotate(90deg)'}}>
					{profile1 ? 
						<div className="d-flex flex-column align-items-center">
							<img src={'/images/'.concat(profile1.avatar)} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{profile1.name}</span>
							<span className="d-flex gap-2 mt-3">
								<input onChange={checkReady} className="form-check-input" type="checkbox" name="player1" id="ready1" />
								<label className="form-check-label" htmlFor="ready1">Ready ?</label>
							</span>
							<button onClick={logoutLocal} data-player='player1' data-profile={props.myProfile} type='button' className="btn btn-primary mt-3">Logout</button>
						</div> :
						<div className={`d-flex flex-column align-items-center border border-black border-2 rounded ${props.xxlg ? 'p-5' : 'px-5 py-2'} bg-secondary`}>
							<form action="" className="d-flex flex-column align-items-center">
                			    <div className="mb-2">
                			        <label htmlFor="logAddressLocal1" className="form-label">Username</label>
                			        <input onKeyDown={typing} data-player='1' name="login" type="text" className="form-control" id="logAddressLocal1" />
                			    </div>
                			    <div className="mb-3">
                			        <label htmlFor="logPasswordLocal1" className="form-label">Password</label>
                			        <input onKeyDown={typing} data-player='1' name="password" type="password" className="form-control" id="logPasswordLocal1" />
                			    </div>
                                <div id='error1' className="text-danger-emphasis mt-2" hidden>Wrong address or password</div>
                			    <button onClick={loginLocal} data-player='1' type="button" className="btn btn-info mb-2">Login</button>
                			</form>
							<span className="d-flex gap-2 mt-3">
								<input onChange={checkReady} className="form-check-input" type="checkbox" name="player1" id="guest1" />
								<label className="form-check-label" htmlFor="guest1">Play as a guest</label>
							</span>
						</div>
					}
				</div>
                <img src="/images/versus.png" className="mx-3" alt="" style={{height: '150px',width: '100px'}} />
                <div className={`${props.xxlg && 'border border-black border-3 rounded'} d-flex justify-content-center align-items-center`} style={{height: props.xxlg ? '100%' : '60%', width: '50%', transform: props.xxlg ? 'rotate(0deg)' : 'rotate(-90deg)'}}>
					{profile2 ? 
						<div className="d-flex flex-column align-items-center">
							<img src={'/images/'.concat(profile2.avatar)} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{profile2.name}</span>
							<span className="d-flex gap-2 mt-3">
								<input onChange={checkReady} className="form-check-input" type="checkbox" name="player2" id="ready2" />
								<label className="form-check-label" htmlFor="ready1">Ready ?</label>
							</span>
							<button onClick={logoutLocal} type='button' data-profile='none' className="btn btn-primary mt-3">Logout</button>
						</div> :
						<div className={`d-flex flex-column align-items-center border border-black border-2 rounded ${props.xxlg ? 'p-5' : 'px-5 py-2'} bg-secondary`}>
							<form action="" className="d-flex flex-column align-items-center">
                			    <div className="mb-2">
                			        <label htmlFor="logAddressLocal2" className="form-label">Username</label>
                			        <input onKeyDown={typing} data-player='2' name="login" type="text" className="form-control" id="logAddressLocal2" />
                			    </div>
                			    <div className="mb-3">
                			        <label htmlFor="logPasswordLocal2" className="form-label">Password</label>
                			        <input onKeyDown={typing} data-player='2' name="password" type="password" className="form-control" id="logPasswordLocal2" />
                			    </div>
                                <div id='error2' className="text-danger-emphasis mt-2" hidden>Wrong address or password</div>
                			    <button onClick={loginLocal} data-player='2' type="button" className="btn btn-info mb-2">Login</button>
                			</form>
							<span className="d-flex gap-2 mt-3">
								<input onChange={checkReady} className="form-check-input" type="checkbox" name="player2" id="guest2" />
								<label className="form-check-label" htmlFor="guest2">Play as a guest</label>
							</span>
						</div>
					}
				</div>
            </div>
            <div className="text-center mt-3">
                <button id='launchButton' onClick={launchGame} type="button" className="btn btn-warning" disabled>Let's rock !</button>
            </div>
        </>
	)
}

function Remote({props}) {

	const [challengers, setChallengers] = useState([])
	const [challenged, setChallenged] = useState([])
	const [tournaments, setTournaments] = useState([])

	useEffect(() => {
		if (!challengers) {
			props.socket.send(JSON.stringify({
				component : 'play',
				action : undefined, 
				item : {game : props.settings.game}
			}))
		}
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data.item)
			else if (data.action === 'chat')
				props.socket.onChat(data)
			else if (data.action === 'setChallengers')
				setChallengers(data.item)
			else if (data.action === 'setChallenged')
				setChallenged(data.item)
			else if (data.action === 'setTournaments')
				setTournaments(data.item)
		}
		const interval = setInterval(() => {
			props.socket.send(JSON.stringify({
				component : 'play',
				action : undefined, 
				item : {game : props.settings.game}
			}))
		}, 3000)
		return () => clearInterval(interval)
	}, [props.socket, props.socket.onmessage, props.settings.game, challengers, challenged, tournaments])

	if (!challengers || !challenged || !tournaments)
		return <div className='w-100 h-100 d-flex align-items-center justify-content-center noScrollBar'><img src="/images/loading.gif" alt="" /></div>

	const changeGame = e => {
		let game = e.target.dataset.game
		props.socket.send(JSON.stringify({
			component : 'play',
			action : undefined,
			item : {game : game}
		}))
		props.setSettings({...props.settings, game : game})
		setChallenged([])
		setChallengers([])
		setTournaments([])
	}

	let index = 1

    return <>
                <div className="fs-2 fw-bold text-center">
					So you wanna play <button type='button' className='nav-link text-primary text-capitalize d-inline' data-bs-toggle='dropdown'>{props.settings.game}</button> ?
					<ul className='dropdown-menu bg-light'>
					<li type='button' onClick={changeGame} data-game='pong' className="dropdown-item d-flex align-items-center">
            		    <img data-game='pong' src="/images/joystick.svg" alt="" />
            		    <span data-game='pong' className="ms-2">Pong</span>
            		</li>
            		<li type='button' onClick={changeGame} data-game='chess' className="dropdown-item d-flex align-items-center">
            		    <img data-game='chess' src="/images/hourglass.svg" alt="" />
            		    <span data-game='chess' className="ms-2">Chess</span>
            		</li>
					</ul>
				</div>
                <hr className="mx-5" />
                <span className="ms-2">Tip : Click on an avatar to see the player's profile</span>
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">You've been challenged by</p>
				{challengers.length === 0 ?
				<div className='border border-black border-3 rounded d-flex justify-content-center align-items-center fw-bold' style={{height : '120px', width : '90%'}}>Nobody wants to play ? Shame...</div> :
				<ul className="list-group overflow-auto noScrollBar" style={{width: '90%'}}>
					{challengers.map(user => { return <Challenger key={index++} props={props} profile={user.item} tab='challengers' />})}
				</ul>}
                <hr className="mx-5" />
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">You challenged</p>
				{challenged.length === 0 ?
				<div className='border border-black border-3 rounded d-flex justify-content-center align-items-center fw-bold' style={{height : '120px', width : '90%'}}>What are you doing !? Go and challenge the world !!!</div> :
				<ul className="list-group overflow-auto noScrollBar" style={{width: '90%'}}>
					{challenged.map(user => { return <Challenger key={index++} props={props} profile={user.item} tab='challenged' />})}
				</ul>}
                <hr className="mx-5" />
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">You're involved in</p>
				{tournaments.length === 0 ?
				<div className='border border-black border-3 rounded d-flex justify-content-center align-items-center fw-bold' style={{height : '120px', width : '90%'}}>Ain't you bored of doing nothing?</div> :
				<ul className="list-group overflow-auto noScrollBar" style={{width: '90%'}}>
					{tournaments.map(tourn => { return <Tournament key={index++} props={props} tournament={tourn.item} /> })}
				</ul>}
            </>
}

function Challenger({props, profile, tab}) {

	const [match, setMatch] = useState(undefined)
	const navigate = useNavigate()

	if (!match && profile.playing) {
		let xhr = new XMLHttpRequest()
		xhr.open('GET', '/room/' + profile.match)
		xhr.onload = () => setMatch(JSON.parse(xhr.response))
		xhr.send()
	}

	const dismiss = () => {
		props.socket.send(JSON.stringify({
			component : 'play',
			action : 'dismiss',
			item : {game : props.settings.game, tab : tab, id : profile.id}
		}))
	}

	const joinMatch = () => {
		if (profile.match === 0) {
			let xhr = new XMLHttpRequest()
			xhr.open('POST', '/room/create')
			xhr.onload = () => {
				let response = JSON.parse(xhr.response)
				props.send(JSON.stringify({
					component : 'app',
					action : 'setMatch',
					item : {match : response.match}
				}))
			}
			xhr.send(JSON.stringify({
				game : props.settings.game,
				id1 : props.myProfile.id,
				id2 : profile.id,
				spectate : props.settings.spectate && profile.spectate
			}))
		}
		else {
			props.send(JSON.stringify({
				component : 'app',
				action : 'setMatch',
				item : {match : profile.match}
			}))
		}
		navigate('/match/' + match)
	}

	const buildMenu = () => {
		let index = 1
		let menu
		menu = [<Link to={'/profile/' + profile.id} className='px-2 dropdown-item nav-link' type='button' key={index++}>See profile</Link>]
		if (profile.status === 'online') {
			menu.push(<li className='px-2 dropdown-item nav-link' type='button' key={index++} onClick={() => Social.directMessage(props.xlg, document.getElementById('chat2').hidden, profile.name)}>Direct message</li>)
			if (profile.playing && match && match.spectate)
				menu.push(<Link to={'/game/' + profile.match} className='px-2 dropdown-item nav-link' type='button' key={index++}>Watch game</Link>)
			else if (!profile.playing && profile.challengeable)
				menu.push(<li onClick={joinMatch} className='px-2 dropdown-item nav-link' type='button' key={index++}>Join match</li>)
		}
		return menu
	}

	return (
		<li className={`list-group-item d-flex ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column align-items-center gap-2' : ''} ${!profile.challengeable && 'bg-dark-subtle'}`} key={profile.id}>
			<Link to={'/profile/' + profile.id}><img className="rounded-circle profileLink" title='See profile' src={"/images/".concat(profile.avatar)} alt="" style={{width: '45px', height: '45px'}} /></Link>
			<div className={`d-flex ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column' : ''} justify-content-between align-items-center fw-bold ms-2 flex-grow-1`}>
				{profile.name} {profile.status === 'online' ? profile.playing ? '(In a match)' : '(Available)' : '(offline)'} {!profile.challeangeable && '(But not challengeable)'}
				<div className={`d-flex gap-2 ${!props.sm ? 'd-flex flex-column align-items-center' : 'dropstart'} button-group`}>
					<button type='button' className={`btn btn-success`} data-bs-toggle='dropdown'>Options</button>
					<ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>
						{buildMenu()}
					</ul>
					<button onClick={dismiss} type='button' className={`btn btn-danger`}>Dismiss challenge</button>
				</div>
			</div>
		</li>
	)
}
