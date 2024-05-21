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

	if (!props.xlg)
		return <div className="d-flex text-center justify-content-center align-items-center fw-bold fs-1 h-100 w-100">{props.languages[props.language].smallScreen}</div>

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
		Social.leaveAllChats(props.socket, props.chats, props.setChats, props.setChanName, props.setChanTag)
		setProfile1(undefined)
        props.setMyProfile(undefined)
    props.socket.close()
		let xhr = new XMLHttpRequest()
		xhr.open("POST", "/authenticate/sign_out/" + props.myProfile.id + '/')
		xhr.onload = () => props.setSocket(new WebSocket('ws://localhost/ws/'))
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
				<div className='d-flex justify-content-center fs-1 fw-bold text-success'>{props.settings.game === 'pong' ? props.languages[props.language].letsPlayPong : props.languages[props.language].letsPlayChess} !!!</div> :
            	<div className="w-100 text-center dropdown-center mb-4">
            	    <button type="button" className="btn btn-success" data-bs-toggle="dropdown">{props.languages[props.language].whatGame} (<span className='fw-bold text-capitalize'>{props.settings.game === 'pong' ? 'Pong' : props.languages[props.language].chess}</span>)</button>
            	    <ul className="dropdown-menu">
            	    	<li type='button' onClick={() => props.setSettings({...props.settings, game : 'pong'})} data-game='pong' className="dropdown-item d-flex align-items-center">
            	    	    <img data-game='pong' src="/images/joystick.svg" alt="" />
            	    	    <span data-game='pong' className="ms-2">Pong</span>
            	    	</li>
            	    	<li type='button' onClick={() => props.setSettings({...props.settings, game : 'chess'})} data-game='chess' className="dropdown-item d-flex align-items-center">
            	    	    <img data-game='chess' src="/images/hourglass.svg" alt="" />
            	    	    <span data-game='chess' className="ms-2">{props.languages[props.language].chess}</span>
            	    	</li>
            	    </ul>
            	</div>
			}
            <div className={`d-flex flex-grow-1 align-items-center justify-content-between`} style={{height: '80%'}}>
                <div className={`${props.xxlg && 'border border-black border-3 rounded'} d-flex justify-content-center align-items-center`} style={{height: props.xxlg ? '100%' : '60%', width: '50%'}}>
					{profile1 ? 
						<div className="d-flex flex-column align-items-center">
							<img src={'/images/'.concat(profile1.avatar)} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{profile1.name}</span>
							<span className="d-flex gap-2 mt-3">
								<input onChange={checkReady} className="form-check-input" type="checkbox" name="player1" id="ready1" />
								<label className="form-check-label" htmlFor="ready1">{props.languages[props.language].ready} ?</label>
							</span>
							<button onClick={logoutLocal} data-player='player1' data-profile={props.myProfile} type='button' className="btn btn-primary mt-3">{props.languages[props.language].menu2}</button>
						</div> :
						<div className={`d-flex flex-column align-items-center border border-black border-2 rounded ${props.xxlg ? 'p-5' : 'px-5 py-2'} bg-secondary`}>
							<form action="" className="d-flex flex-column align-items-center">
                			    <div className="mb-2">
                			        <label htmlFor="logAddressLocal1" className="form-label">E-mail</label>
                			        <input onKeyDown={typing} data-player='1' name="login" type="text" className="form-control" id="logAddressLocal1" />
                			    </div>
                			    <div className="mb-3">
                			        <label htmlFor="logPasswordLocal1" className="form-label">{props.languages[props.language].password}</label>
                			        <input onKeyDown={typing} data-player='1' name="password" type="password" className="form-control" id="logPasswordLocal1" />
                			    </div>
                                <div id='error1' className="text-danger-emphasis mt-2" hidden>{props.languages[props.language].wrongForm}</div>
                			    <button onClick={loginLocal} data-player='1' type="button" className="btn btn-info mb-2">{props.languages[props.language].menu1}</button>
                			</form>
							<span className="d-flex gap-2 mt-3">
								<input onChange={checkReady} className="form-check-input" type="checkbox" name="player1" id="guest1" />
								<label className="form-check-label" htmlFor="guest1">{props.languages[props.language].guest}</label>
							</span>
						</div>
					}
				</div>
                <img src="/images/versus.png" className="mx-3" alt="" style={{height: '150px',width: '100px'}} />
                <div className={`${props.xxlg && 'border border-black border-3 rounded'} d-flex justify-content-center align-items-center`} style={{height: props.xxlg ? '100%' : '60%', width: '50%'}}>
					{profile2 ? 
						<div className="d-flex flex-column align-items-center">
							<img src={'/images/'.concat(profile2.avatar)} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{profile2.name}</span>
							<span className="d-flex gap-2 mt-3">
								<input onChange={checkReady} className="form-check-input" type="checkbox" name="player2" id="ready2" />
								<label className="form-check-label" htmlFor="ready1">{props.languages[props.language].ready} ?</label>
							</span>
							<button onClick={logoutLocal} type='button' data-profile='none' className="btn btn-primary mt-3">{props.languages[props.language].menu2}</button>
						</div> :
						<div className={`d-flex flex-column align-items-center border border-black border-2 rounded ${props.xxlg ? 'p-5' : 'px-5 py-2'} bg-secondary`}>
							<form action="" className="d-flex flex-column align-items-center">
                			    <div className="mb-2">
                			        <label htmlFor="logAddressLocal2" className="form-label">E-mail</label>
                			        <input onKeyDown={typing} data-player='2' name="login" type="text" className="form-control" id="logAddressLocal2" />
                			    </div>
                			    <div className="mb-3">
                			        <label htmlFor="logPasswordLocal2" className="form-label">{props.languages[props.language].password}</label>
                			        <input onKeyDown={typing} data-player='2' name="password" type="password" className="form-control" id="logPasswordLocal2" />
                			    </div>
                                <div id='error2' className="text-danger-emphasis mt-2" hidden>{props.languages[props.language].wrongForm}</div>
                			    <button onClick={loginLocal} data-player='2' type="button" className="btn btn-info mb-2">{props.languages[props.language].menu1}</button>
                			</form>
							<span className="d-flex gap-2 mt-3">
								<input onChange={checkReady} className="form-check-input" type="checkbox" name="player2" id="guest2" />
								<label className="form-check-label" htmlFor="guest2">{props.languages[props.language].guest}</label>
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

	const [challengers, setChallengers] = useState(undefined)
	const [challenged, setChallenged] = useState(undefined)
	const [tournaments, setTournaments] = useState(undefined)

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
					{props.languages[props.language].wannaPlay} (<button type='button' className='nav-link text-primary text-capitalize d-inline' data-bs-toggle='dropdown'>{props.settings.game}</button>) ?
					<ul className='dropdown-menu bg-light'>
					<li type='button' onClick={changeGame} data-game='pong' className="dropdown-item d-flex align-items-center">
            		    <img data-game='pong' src="/images/joystick.svg" alt="" />
            		    <span data-game='pong' className="ms-2">Pong</span>
            		</li>
            		<li type='button' onClick={changeGame} data-game='chess' className="dropdown-item d-flex align-items-center">
            		    <img data-game='chess' src="/images/hourglass.svg" alt="" />
            		    <span data-game='chess' className="ms-2">{props.languages[props.language].chess}</span>
            		</li>
					</ul>
				</div>
                <hr className="mx-5" />
                <span className="ms-2">{props.languages[props.language].tip}</span>
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">{props.languages[props.language].challengers}</p>
				{challengers.length === 0 ?
				<div className='border border-black border-3 rounded d-flex justify-content-center align-items-center fw-bold' style={{height : '120px', width : '90%'}}>{props.languages[props.language].noChallenger}</div> :
				<ul className="d-flex list-group overflow-visible noScrollBar" style={{width: '90%'}}>
					{challengers.map(user => <Challenger key={index++} props={props} profile={user.item} tab='challengers' />)}
				</ul>}
                <hr className="mx-5" />
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">{props.languages[props.language].challenged}</p>
				{challenged.length === 0 ?
				<div className='border border-black border-3 rounded d-flex justify-content-center align-items-center fw-bold' style={{height : '120px', width : '90%'}}>{props.languages[props.language].noChallenged}</div> :
				<ul className="list-group overflow-visible noScrollBar" style={{width: '90%'}}>
					{challenged.map(user => <Challenger key={index++} props={props} profile={user.item} tab='challenged' />)}
				</ul>}
                <hr className="mx-5" />
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">{props.languages[props.language].tournamentsSection}</p>
				{tournaments.length === 0 ?
				<div className='border border-black border-3 rounded d-flex justify-content-center align-items-center fw-bold' style={{height : '120px', width : '90%'}}>{props.languages[props.language].noTournament}</div> :
				<ul className="list-group overflow-visible noScrollBar" style={{width: '90%'}}>
					{tournaments.map(tourn => <Tournament key={index++} props={props} tournament={tourn.item} /> )}
				</ul>}
            </>
}

function Challenger({props, profile, tab}) {

	const [match, setMatch] = useState(undefined)
	const navigate = useNavigate()

	useEffect(() => {
		if (!match && profile.playing) {
			let xhr = new XMLHttpRequest()
			xhr.open('GET', '/game/room/' + profile.match)
			xhr.onload = () => setMatch(JSON.parse(xhr.response))
			xhr.send()
		}
	})

	const dismiss = () => {
		props.socket.send(JSON.stringify({
			component : 'play',
			action : 'dismiss',
			item : {game : props.settings.game, tab : tab, id : profile.id}
		}))
	}

	const joinMatch = () => {
		if (!match) {
			let xhr = new XMLHttpRequest()
			xhr.open('POST', '/game/room/create/')
			xhr.onload = () => {
				if (xhr.status === 201 || xhr.status === 200)
					navigate('/match/' + JSON.parse(xhr.response).id)
				else {
					props.setChats(props.chats.map(chat => { return {...chat, messages : [chat.messages, {type : 'unavailable'}]} }))
					document.getElementById('chatButton').setAttribute('class', 'position-absolute bottom-0 end-0 me-4 mb-2 rounded-circle bg-dark-subtle d-flex justify-content-center align-items-center border border-3 border-danger')
				}
			}
			xhr.send(JSON.stringify({
				game : props.settings.game,
				id1 : props.myProfile.id,
				id2 : profile.id,
				spectate : props.settings.spectate && profile.spectate
			}))
		}
		else {
			props.socket.send(JSON.stringify({
				component : 'app',
				action : 'setMatch',
				item : {match : profile.match}
			}))
			navigate('/match/' + profile.match)
		}
	}

	const buildMenu = () => {
		let index = 1
		let menu
		menu = [<Link to={'/profile/' + profile.id} className='px-2 dropdown-item nav-link' type='button' key={index++}>{props.languages[props.language].seeProfile}</Link>]
		if (profile.status === 'online') {
			menu.push(<li className='px-2 dropdown-item nav-link' type='button' key={index++} onClick={() => Social.directMessage(props.xlg, document.getElementById('chat2').hidden, profile.name)}>{props.languages[props.language].dm}</li>)
			if (profile.playing && match && match.spectate)
				menu.push(<Link to={'/game/' + profile.match} className='px-2 dropdown-item nav-link' type='button' key={index++}>{props.languages[props.language].watchGame}</Link>)
			else if (!profile.playing && profile.challengeable)
				menu.push(<li onClick={joinMatch} className='px-2 dropdown-item nav-link' type='button' key={index++}>{props.languages[props.language].joinMatch}</li>)
		}
		return menu
	}

	return (
		<li className={`list-group-item d-flex overflow-visible ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column align-items-center gap-2' : ''} ${!profile.challengeable && 'bg-dark-subtle'}`} key={profile.id}>
			<Link to={'/profile/' + profile.id}><img className="rounded-circle profileLink" title='See profile' src={"/images/".concat(profile.avatar)} alt="" style={{width: '45px', height: '45px'}} /></Link>
			<div className={`d-flex ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column' : ''} justify-content-between align-items-center fw-bold ms-2 flex-grow-1 overflow-visible`}>
				{profile.name} {profile.status === 'online' ? profile.playing ? '(In a match)' : '(Available)' : '(offline)'} {!profile.challengeable && '(But not challengeable)'}
				<div className={`d-flex gap-2 ${!props.sm && 'flex-column align-items-center'} dropstart button-group`}>
					<button type='button' className={`btn btn-success`} data-bs-toggle='dropdown'>Options</button>
					<ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>
						{buildMenu()}
					</ul>
					<button onClick={dismiss} type='button' className={`btn btn-danger`}>{props.languages[props.language].dismissChallenge}</button>
				</div>
			</div>
		</li>
	)
}
