import React, { useEffect } from 'react'
import { useState } from "react"
import { Link } from 'react-router-dom'
import { Tournament } from './Tournaments'


export function Friend({props, profile, id}) {

	const directMessage = () => {
		if (!props.xlg && document.getElementById('chat2').hidden) 
			document.getElementById('chat2').hidden = false
		let prompt = document.getElementById('chatPrompt')
		prompt.value = '/w '.concat('"', profile.name, '" ')
		prompt.focus()
	}

	const unMute = () => props.setMuted(props.muted.filter(user => user !== profile.id))

	const challenge = (e) => {
		let game = e.target.dataset.game
		props.setMyProfile({
			...props.myProfile,
			[game] : {...props.myProfile[game], challenged : [...props.myProfile[game].challenged, profile.id]}
		})
	}

	const addToFl = () => {
		props.setMyProfile({
			...props.myProfile,
			friends : [...props.myProfile.friends, profile.id]
		})
	}

	const removeFromFl = () => {
		props.setMyProfile({
			...props.myProfile,
			friends : props.myProfile.friends.filter(item => item !== profile.id)
		})
	}

	const buildMenu = () => {
		let index = 1
		let menu = [<Link to={'/profile/' + profile.id} key={index++} className='px-2 dropdown-item nav-link'>See profile</Link>]
		if (props.myProfile && profile.id !== props.myProfile.id) {
			if (id === props.myProfile.id && props.myProfile.friends.includes(profile.id))
				menu.push(<li onClick={removeFromFl} key={index++} type='button' className='px-2 dropdown-item nav-link'>Remove from friendlist</li>)
			else
				menu.push(<li onClick={addToFl} key={index++} type='button' className='px-2 dropdown-item nav-link'>Add to friendlist</li>)
			if (props.muted.includes(profile.id))
				menu.push(<li onClick={unMute} key={index++} type='button' className='px-2 dropdown-item nav-link'>Unmute</li>)
			if (profile.status === 'online') {
				if(!props.muted.includes(profile.id))
					menu.push(<li onClick={directMessage} key={index++} type='button' className='px-2 dropdown-item nav-link'>Direct message</li>)
				if (profile.challengeable && !props.myProfile['pong'].challenged.includes(profile.id))
					menu.push(<li onClick={challenge} data-game='pong' key={index++} type='button' className='px-2 dropdown-item nav-link'>Challenge to Pong</li>)
				if (profile.challengeable && !props.myProfile['chess'].challenged.includes(profile.id))
					menu.push(<li onClick={challenge} data-game='chess' key={index++} type='button' className='px-2 dropdown-item nav-link'>Challenge to Chess</li>)
			}
		}
		return menu
	}

	return (
		<li className='list-group-item d-flex ps-2' key={profile.id}>
            <div style={{height: '70px', width: '70px'}}>
                <img className='rounded-circle' style={{height: '70px', width: '70px'}} src={'/images/'.concat(profile.avatar)} alt="" />
            </div>
            <div className='d-flex flex-wrap align-items-center ms-3'>
                <span className='w-100 fw-bold'>{profile.name}</span>
				<div className='w-100 d-flex justify-content-between align-items-center pe-2'>
                	<span className={'fw-bold text-capitalize '.concat(profile.status === "online" ? 'text-success' : 'text-danger')}>
                	    {profile.status}
                	</span>
                	<button data-name={profile.name} data-id={profile.id} data-status={profile.status} data-challenge={profile.challengeable} type='button' data-bs-toggle='dropdown' className='btn btn-secondary ms-3'>Options</button>
                	<ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>
						{buildMenu()}
					</ul>
				</div>
            </div>
        </li>
	)
}

export function Champion({props, profile, rank}) {

	return (
		<li className={`list-group-item w-100 d-flex align-items-center p-1 gap-3 pe-4 ${rank % 2 === 0 && 'bg-light'}`} style={{minHeight: '55px'}} key={profile.id}>
            <span style={{width: props.xxxlg ? '5%' : '10%'}} className="d-flex justify-content-center">{rank}</span>
            <span style={{width: props.xxxlg ? '5%' : '10%'}} className="h-100">
                <Link to={'/profile/' + profile.id}><img src={'/images/'.concat(profile.avatar)} className="profileLink rounded-circle" alt="" title='See profile' style={{height: '45px', width: '45px'}} /></Link>
            </span>
            <span className={props.sm ? '' : 'ps-2'} style={{width: props.xxxlg ? '50%' : '60%'}}>{profile.name}</span> 
            {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">{profile[props.settings.game].matches}</span>}
            {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">{profile[props.settings.game].wins}</span>}
            {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">{profile[props.settings.game].loses}</span>}
            <span style={{width: '10%'}} className="d-flex justify-content-center">{profile[props.settings.game].level}</span>
        </li>
	)
}

export function Local({props}) {
	const [ready, setReady] = useState({
		player1: false,
		player2: false
	})
	const [profile1, setProfile1] = useState(props.myProfile)
	const [profile2, setProfile2] = useState(undefined)
    const [form1, setForm1] = useState({
        login: '',
        password: ''
    })
    const [form2, setForm2] = useState({
        login: '',
        password: ''
    })
    const [emptyLogin1, setEmptyLogin1] = useState(false)
    const [emptyLogin2, setEmptyLogin2] = useState(false)
    const [emptyPW1, setEmptyPW1] = useState(false)
    const [emptyPW2, setEmptyPW2] = useState(false)
    const [wrongForm1, setWrongForm1] = useState(true)
    const [wrongForm2, setWrongForm2] = useState(true)

    const changeGame = (e) => props.setSettings({...props.settings, game : e.target.dataset.game})

	const checkReady = (e) => {
		setReady({
			...ready,
			[e.target.name] : e.target.checked
		})
	}

	// function checkReady(player, check) {
	// 	if (player === 'player1' && check && ready.player2)
	// 		setStart(true)
	// 	else if (player === 'player2' && check && ready.player1)
	// 		setStart(true)
	// 	else
	// 		setStart(false)
	// }
	
	// const playerReady = (e) => {
	// 	let newStatus = {
	// 		...ready,
	// 		[e.target.dataset.player]: e.target.checked
	// 	}
	// 	checkReady(e.target.dataset.player, e.target.checked)
	// 	setReady(newStatus)
	// }

    function checkIssue(form, player) {
        let issue = false
        if (form.login === '') {
            player === 'player1' ? setEmptyLogin1(true) : setEmptyLogin2(true)
            issue = true
        }
        if (form.password === '') {
            player === 'player1' ? setEmptyPW1(true) : setEmptyPW2(true)
            issue = true
        }
        return issue
    }

	const loginLocal = (e) => {
        var player = e.target.dataset.player
        var form = player === 'player1' ? form1 : form2
        if (!checkIssue(form, player)) {
			var request = new XMLHttpRequest()
			request.open('GET', "/authenticate/sign_in/")
			request.responseType = 'json'
			request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0', "Content-Type", "application/json;charset=UTF-8")
			request.send(JSON.stringify(form))
			request.onload = () => {
				if ('details' in request.response)
					player === 'player1' ? setWrongForm1(false) : setWrongForm2(false)
				else {
					if (player === 'player1') {
						setProfile1(request.response)
						setWrongForm1(false)
					}
					else {
						setProfile2(request.response)
						setWrongForm2(false)
					}
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
		request.open('POST', "localhost:8000/game/room/create/")
		request.responseType = 'json'
		request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0', "Content-Type", "application/json;charset=UTF-8")
		request.send(JSON.stringify(info))
		request.onload = () => {

		}
	}

	const logout = () => {
		console.log('logout')
		setProfile1(undefined)
        props.setMyProfile(undefined)
		var request = new XMLHttpRequest()
		request.open("POST", "/authenticate/sign_out/")
		request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
		request.send(props.myProfile.id)
		localStorage.getItem('ft_transcendenceLogin') && localStorage.removeItem('ft_transcendenceLogin')
		localStorage.getItem('ft_transcendencePassword') && localStorage.removeItem('ft_transcendencePassword')
	}

	const logoutLocal = (e) => {
		if (e.target.dataset.profile) {
			if(window.confirm('Warning ! You will be disconnected from the website'))
				logout()
		}
		else if (e.target.dataset.player === 'player1')
			setProfile1('none')
		else
			setProfile2('none')
	}

    const typing = (e) => {
        let {name, value} = e.target
        if (e.target.dataset.player === 'player1') {
            setForm1({
                ...form1,
                [name]: value    
            })
            setEmptyLogin1(false)
            setEmptyPW1(false)
            setWrongForm1(true)
        }
        else {
            setForm2({
                ...form2,
                [name]: value    
            })
            setEmptyLogin2(false)
            setEmptyPW2(false)
            setWrongForm2(true)
        }

    }

	return (
		<>
			{props.myProfile ?
				<div className='d-flex justify-content-center fs-1 fw-bold text-success'>Let's play {props.settings.game} !!!</div> :
            	<div className="w-100 text-center dropdown-center mb-4">
            	    <button type="button" className="btn btn-success" data-bs-toggle="dropdown">What game will you play? (<span className='fw-bold text-capitalize'>{props.settings.game}</span>)</button>
            	    <ul className="dropdown-menu">
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
			}
            <div className={`d-flex flex-grow-1 align-items-center justify-content-between`} style={{height: '80%'}}>
                <div className={`${props.xxlg && 'border border-black border-3 rounded'} d-flex justify-content-center align-items-center`} style={{height: props.xxlg ? '100%' : '60%', width: '50%', transform: props.xxlg ? 'rotate(0deg)' : 'rotate(90deg)'}}>
					{profile1 ? 
						<div className="d-flex flex-column align-items-center">
							<img src={'/images/'.concat(profile1.avatar)} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{profile1.name}</span>
							<span className="d-flex gap-2 mt-3">
								<input onChange={checkReady} className="form-check-input" type="checkbox" name="player1" id="player1" />
								<label className="form-check-label" htmlFor="ready1">Ready ?</label>
							</span>
							<button onClick={logoutLocal} data-player='player1' data-profile={props.myProfile} type='button' className="btn btn-primary mt-3">Logout</button>
						</div> :
						<div className={`d-flex flex-column align-items-center border border-black border-2 rounded ${props.xxlg ? 'p-5' : 'px-5 py-2'} bg-secondary`}>
							<form action="" className="d-flex flex-column align-items-center">
                			    <div className="mb-2">
                			        <label htmlFor="logAddressLocal1" className="form-label">Username</label>
                			        <input onChange={typing} data-player='player1' name="login" type="text" className={"form-control ".concat(emptyLogin1 && 'border border-3 border-danger')} id="logAddressLocal1" />
                			    </div>
                			    <div className="mb-3">
                			        <label htmlFor="logPasswordLocal1" className="form-label">Password</label>
                			        <input onChange={typing} data-player='player1' name="password" type="password" className={"form-control ".concat(emptyPW1 && 'border border-3 border-danger')} id="logPasswordLocal1" />
                			    </div>
                                <div className="text-danger-emphasis mt-2" hidden={wrongForm1}>Wrong address or password</div>
                			    <button onClick={loginLocal} data-player='player1' type="button" className="btn btn-info mb-2">Login</button>
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
								<input onChange={checkReady} className="form-check-input" type="checkbox" name="ready1" id="ready1" />
								<label className="form-check-label" htmlFor="ready1">Ready ?</label>
							</span>
							<button onClick={logoutLocal} type='button' data-profile='none' className="btn btn-primary mt-3">Logout</button>
						</div> :
						<div className={`d-flex flex-column align-items-center border border-black border-2 rounded ${props.xxlg ? 'p-5' : 'px-5 py-2'} bg-secondary`}>
							<form action="" className="d-flex flex-column align-items-center">
                			    <div className="mb-2">
                			        <label htmlFor="logAddressLocal2" className="form-label">Username</label>
                			        <input onChange={typing} data-player='player2' name="login" type="text" className={"form-control ".concat(emptyLogin2 && 'border border-3 border-danger')} id="logAddressLocal2" />
                			    </div>
                			    <div className="mb-3">
                			        <label htmlFor="logPasswordLocal2" className="form-label">Password</label>
                			        <input onChange={typing} data-player='player2' name="password" type="password" className={"form-control ".concat(emptyPW2 && 'border border-3 border-danger')} id="logPasswordLocal2" />
                			    </div>
                                <div className="text-danger-emphasis mt-2" hidden={wrongForm2}>Wrong address or password</div>
                			    <button onClick={loginLocal} data-player='player2' type="button" className="btn btn-info mb-2">Login</button>
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
                <button onClick={launchGame} type="button" className="btn btn-warning" disabled={!ready.player1 || !ready.player2}>Let's rock !</button>
            </div>
        </>
	)
}

export function Remote({props}) {

	const [challengers, setChallengers] = useState(undefined)
	const [challenged, setChallenged] = useState(undefined)
	const [tournaments, setTournaments] = useState(undefined)

	/*
	Attendu : 
	{
		"action" : "addChallenger" / "addChallenged" / "updateChallenger" / 'updateChallenged,
		"item" : {
			"avatar",
			"name",
			"id",
			"status",
			"playing",
			if (playing)
				"match",
		}
		//
		"action" : "addTournament" / "updateTournament"
		"item" : {
			"picture",
			"title",
			"id",
			"winnerId",
			"ReasonForNoWinner"
		}
	}
	*/

	useEffect(() => {
		if ((props.socket.page !== 'play' || props.socket.game !== props.settings.game) && props.socket.readyState === 1) {
			props.socket.send(JSON.stringify({component : 'play', game : props.settings.game}))
			props.socket.page = 'play'
			props.socket.game = props.settings.game
			setChallengers([])
			setChallenged([])
			setTournaments([])
		}
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data === 'chat')
				props.socket.onChat(data)
			else if (data.action === 'addChallenger')
				setChallengers([...challengers, {id : data.item.id, item : data.item}])
			else if (data.action === 'addChallenged')
				setChallenged([...challenged, {id : data.item.id, item : data.item}])
			else if (data.action === 'addTournament')
				setTournaments([...tournaments, {id : data.item.id, item : data.item}])
			else if (data.action === 'modifyChallenger')
				setChallengers(challengers.map(challenger => {
					if (challenger.id === data.id)
						return {
							...challenger,
							[data.key] : data.value
						}
					else
						return challenger
				}))
			else if (data.action === 'modifyChallenged')
				setChallenged(challenged.map(user => {
					if (user.id === data.id)
						return {
							...user,
							[data.key] : data.value
						}
					else
						return user
				}))
			else if (data.action === 'modifyTournament')
				setTournaments(tournaments.map(tournament => {
					if (tournament.id === data.id)
						return {
							...tournament,
							[data.key] : data.value
						}
					else
						return tournament
				}))
		}
	}, [props.socket, props.settings, challengers, challenged, tournaments])

	if (!challengers)
		return <div style={props.customwindow}></div>

	// if (!challengers || game !== props.settings.game) {
	// 	let xhr = new XMLHttpRequest()
	// 	xhr.open('GET', '/aapi/user/' + props.myProfile.id + '/' + props.settings.game + '/challengers.json')
	// 	xhr.onreadystatechange = () => {
	// 		if (xhr.readyState === 3) {
	// 			setChallengers(JSON.parse(xhr.response).map(user => { return {id : user.id, item : user} }))
	// 			setGame(props.settings.game)
	// 			setChallenged(undefined)
	// 			setTournaments(undefined)
	// 		}
	// 	}
	// 	xhr.send()
	// 	return <div style={props.customwindow}></div>
	// }

	// if (challengers && !challenged) {
	// 	let xhr = new XMLHttpRequest()
	// 	xhr.open('GET', '/aapi/user/' + props.myProfile.id + '/' + props.settings.game + '/challenged.json')
	// 	xhr.onreadystatechange = () => {
	// 		if (xhr.readyState === 3)
	// 			setChallenged(JSON.parse(xhr.response).map(user => { return {id : user.id, item : user} }))
	// 	}
	// 	xhr.send()
	// 	return <div style={props.customwindow}></div>
	// }

	// if (challenged && !tournaments) {
	// 	let xhr = new XMLHttpRequest()
	// 	xhr.open('GET', '/aapi/user/' + props.myProfile.id + '/' + props.settings.game + '/tournaments.json')
	// 	xhr.onreadystatechange = () => {
	// 		if (xhr.readyState === 3)
	// 			setTournaments(JSON.parse(xhr.response).map(item => { return {id : item.id, item : item} }).filter(item => item.winnerId === 0 || item.reasonForNoWinner === ''))
	// 	}
	// 	xhr.send()
	// 	return <div style={props.customwindow}></div>
	// }

	let index = 1

    return <>
                <div className="fs-2 fw-bold text-center">
					So you wanna play <button type='button' className='nav-link text-primary text-capitalize d-inline' data-bs-toggle='dropdown'>{props.settings.game}</button> ?
					<ul className='dropdown-menu bg-light'>
					<li type='button' onClick={() => props.setGame('pong')} className="dropdown-item d-flex align-items-center">
            		    <img data-game='pong' src="/images/joystick.svg" alt="" />
            		    <span data-game='pong' className="ms-2">Pong</span>
            		</li>
            		<li type='button' onClick={() => props.setGame('chess')} className="dropdown-item d-flex align-items-center">
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

	if (!match && profile.playing) {
		let xhr = new XMLHttpRequest()
		xhr.open('GET', '/aapi/match/' + profile.match + '.json')
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 3)
				setMatch(JSON.parse(xhr.response))
		}
		xhr.send()
	}

	const directMessage = () => {
		if (!props.xlg && document.getElementById('chat2').hidden) 
			document.getElementById('chat2').hidden = false
        let prompt = document.getElementById('chatPrompt')
        prompt.value = '/w '.concat('"', profile.name, '" ')
        prompt.focus()
    }

	const dismiss = () => {
		let xhr = new XMLHttpRequest()
		xhr.open('POST', '/api/user/' + props.myProfile.id + '/')
		xhr.send({game : props.settings.game, tab : tab, id : profile.id})
	}

	const buildMenu = () => {
		let index = 1
		let menu
		menu = [<Link to={'/profile/' + profile.id} className='px-2 dropdown-item nav-link' type='button' key={index++}>See profile</Link>]
		if (profile.status === 'online') {
			menu.push(<li className='px-2 dropdown-item nav-link' type='button' key={index++} onClick={directMessage}>Direct message</li>)
			if (profile.playing && match && match.spectate)
				menu.push(<Link to={'/game/' + profile.game + '/' + profile.match} className='px-2 dropdown-item nav-link' type='button' key={index++}>Watch game</Link>)
			else if (!profile.playing)
				menu.push(<Link to={'/match/' + profile.game + '/' + (profile.match === 0 ? 'new' : profile.match) + '/' + profile.id + '/' + profile.name + '/' + profile.avatar} className='px-2 dropdown-item nav-link' type='button' key={index++}>{profile.match === 0 ? 'Host game' :  'Accept invitation'}</Link>)
		}
		return menu
	}

	return (
		<li className={`list-group-item d-flex ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column align-items-center gap-2' : ''}`} key={profile.id}>
			<Link to={'/profile/' + profile.id}><img className="rounded-circle profileLink" title='See profile' src={"/images/".concat(profile.avatar)} alt="" style={{width: '45px', height: '45px'}} /></Link>
			<div className={`d-flex ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column' : ''} justify-content-between align-items-center fw-bold ms-2 flex-grow-1`}>
				{profile.name} {profile.status === 'online' ? profile.playing ? '(In a match)' : '(Available)' : '(offline)'}
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

export function MuteList({props}) {

	const [users, setUsers] = useState([])

	var xhr

	const newUser = (id) =>{
		xhr = new XMLHttpRequest()
		xhr.open('GET', '/aapi/user/' + id + '.json')
		xhr.id = id
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 3)
				setUsers([...users, {id : xhr.id, name : JSON.parse(xhr.response).name}])
		}
		xhr.send()
	}

	if (users.length < props.muted.length && !xhr)
		newUser(props.muted[users.length])

	const unmute = (e) => {
		let id = parseInt(e.target.dataset.id, 10)
		props.setMuted(props.muted.filter(muted => muted !== id))
		setUsers(users.filter(user => user.id !== id))
	}

	let index = 1

	return (
		<div className='p-1 m-1 border border-2 border-primary rounded' style={{width : '90%'}}>
			<div className='text-primary'>List of muted users :</div>
			{users && users.length === 0 ?
			<div className='text-primary'>You didn't mute anyone</div> :
			users.map(user => {
				return (
					<div key={index++}>
						<button type='button' data-bs-toggle='dropdown' className='nav-link text-primary'>{user.name}</button>
						<ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>
							<li key='a' className='px-2'>{user.name}</li>
							<li key='b'><hr className="dropdown-divider" /></li>
							<li key='c' onClick={unmute} data-id={user.id} type='button' className='px-2 dropdown-item nav-link'>Unmute</li>
						</ul>
					</div>
				)
			})}
		</div>
	)
}

export function BlockList({props}) {

	const [users, setUsers] = useState([])

	var xhr

	const newUser = (id) =>{
		xhr = new XMLHttpRequest()
		xhr.open('GET', '/aapi/user/' + id + '.json')
		xhr.id = id
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 3)
				setUsers([...users, {id : xhr.id, name : JSON.parse(xhr.response).name}])
		}
		xhr.send()
	}

	if (props.myProfile && users.length < props.myProfile.blocked.length && !xhr)
		newUser(props.myProfile.blocked[users.length])

	const unblock = (e) => {
		let id = parseInt(e.target.dataset.id, 10)
		let update = new XMLHttpRequest()
		update.open('POST', '/api/user/' + props.myProfile.id + '/unblock/', true, props.creds.name, props.creds.password)
		update.send({id : id})
		update.onload = () => {}
		setUsers(users.filter(user => user.id !== id))
	}

	let index = 1

	return (
		<div className='p-1 m-1 border border-2 border-primary rounded' style={{width : '90%'}}>
			<div className='text-primary'>List of blocked users :</div>
			{users && users.length === 0 ?
			<div className='text-primary'>You didn't block anyone</div> :
			users.map(user => {
				return (
					<div key={index++}>
						<button type='button' data-bs-toggle='dropdown' className='nav-link text-primary'>{user.name}</button>
						<ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>
							<li key='a' className='px-2'>{user.name}</li>
							<li key='b'><hr className="dropdown-divider" /></li>
							<li key='c' onClick={unblock} data-id={user.id} type='button' className='px-2 dropdown-item nav-link'>Unblock</li>
						</ul>
					</div>
				)
			})}
		</div>
	)
}

export function Help() {

	return (
		<div className='p-1 m-1 border border-2 border-primary rounded' style={{width : '90%'}}>
			<div className='text-primary'>/w "[username]" [message] to send a direct message</div>
			<div className='text-primary'>/m to display a list of muted users</div>
			<div className='text-primary'>/b to display a list of blocked users</div>
			<div className='text-primary'>/h to display this help again</div>
		</div>
	)

}