import React from 'react'
import { useState } from "react"


export function Friend({props, profile}) {

	const seeProfile = () => props.setProfileId(profile.id)

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
		let menu = [<li key={index++} onClick={seeProfile} type='button' className='px-2 dropdown-item nav-link'>See profile</li>]
		if (props.myProfile && profile.id !== props.myProfile.id) {
			if (props.profileId === props.myProfile.id && props.myProfile.friends.includes(profile.id))
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

	const seeProfile = () => {
		props.setProfileId(profile.id)
		props.setPage('Profile')
	}
	
	return (
		<li className={`list-group-item w-100 d-flex align-items-center p-1 gap-3 pe-4 ${rank % 2 === 0 && 'bg-light'}`} style={{minHeight: '55px'}} key={profile.id}>
            <span style={{width: props.xxxlg ? '5%' : '10%'}} className="d-flex justify-content-center">{rank}</span>
            <span style={{width: props.xxxlg ? '5%' : '10%'}} className="h-100">
                <img onClick={seeProfile} src={'/images/'.concat(profile.avatar)} className="profileLink rounded-circle" alt="" title='See profile' style={{height: '45px', width: '45px'}} />
            </span>
            <span className={props.sm ? '' : 'ps-2'} style={{width: props.xxxlg ? '50%' : '60%'}}>{profile.name}</span> 
            {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">{profile[props.game].matches}</span>}
            {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">{profile[props.game].wins}</span>}
            {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">{profile[props.game].loses}</span>}
            <span style={{width: '10%'}} className="d-flex justify-content-center">{profile[props.game].level}</span>
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

    const changeGame = (e) => props.setGame(e.target.dataset.game)

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
			game : props.game,
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
		setProfile1(undefined)
		var request = new XMLHttpRequest()
		request.open("POST", "/authenticate/sign_out/")
		request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
		request.send(props.myProfile.id)
		localStorage.getItem('ft_transcendenceLogin') && localStorage.removeItem('ft_transcendenceLogin')
		localStorage.getItem('ft_transcendencePassword') && localStorage.removeItem('ft_transcendencePassword')
        props.setMyProfile(undefined)
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
				<div className='d-flex justify-content-center fs-1 fw-bold text-success'>Let's play {props.game} !!!</div> :
            	<div className="w-100 text-center dropdown-center mb-4">
            	    <button type="button" className="btn btn-success" data-bs-toggle="dropdown">What game will you play? (<span className='fw-bold text-capitalize'>{props.game}</span>)</button>
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

    let style = {
        minHeight: '100px',
        maxHeight: '250px',
        width: '90%',
		padding: '15px'
    }

	const changeGame = (e) => props.setGame(e.target.dataset.game)

    return <>
                <div className="fs-2 fw-bold text-center">
					So you wanna play <button type='button' className='nav-link text-primary text-capitalize d-inline' data-bs-toggle='dropdown'>{props.game}</button> ?
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
                <Challengers props={props} style={style} />
                <hr className="mx-5" />
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">You challenged</p>
                <Challenged props={props} style={style} />
                <hr className="mx-5" />
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">You're involved in</p>
				<RemoteTournaments props={props} style={style} />
            </>
}

function RemoteTournaments({props, style}) {

	const [tournaments, setTournaments] = useState(undefined)
	const [prevData, setPrevData] = useState(undefined)

	var xhr = new XMLHttpRequest()
    // xhr.open('GET', '/api/play/' + props.profileId + '/game/' + props.game + '/')
	xhr.open('GET', '/data/sampleMyTournaments' + props.game + '.json')
	xhr.seenBytes = 0

	xhr.onreadystatechange = () => {
	  
		if(xhr.readyState === 3) {
			var response = xhr.response.substr(xhr.seenBytes)
			if (!prevData || prevData !== response) {
				setPrevData(response)
				setTournaments(JSON.parse(response))
			
			  	xhr.seenBytes = response.length
			}
		}
	}
	xhr.send()

	if (!tournaments)
		return undefined

	const addClick = (e) => {
		let id = parseInt(e.target.dataset.tournament, 10)
		props.setTournamentId(id)
		props.setPage('Tournaments')
	}

	const joinChat = (e) => {
		let chanName = e.target.dataset.name
		props.setChanList([...props.chanList, chanName])
		props.setChan(chanName)
	}

	let key = 1

	return (
		<>
		{tournaments.length === 0 ?
			<div className="d-flex rounded border border-black align-items-center justify-content-center fw-bold" style={style}>What are you doing !? Go and conquer the world !</div> :
			<ul className="list-group overflow-auto noScrollBar" style={{width: '90%'}}>
				{tournaments.map((tournament) =>
				tournament.game === props.game &&
				<li className={`list-group-item d-flex ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column align-items-center gap-2' : ''}`} key={key++}>
					<img className="rounded-circle" title='See profile' src={"/images/".concat(tournament.picture)} alt="" style={{width: '45px', height: '45px'}} />
					<div className={`d-flex ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column' : ''} justify-content-between align-items-center fw-bold ms-2 flex-grow-1`}>
						<span>{tournament.title} <span className="text-primary fw-bold" hidden={tournament.organizer !== props.myProfile.id}>(You are the organizer)</span></span>
						<div className={`d-flex gap-2 ${!props.sm && 'd-flex flex-column align-items-center'}`}>
							<button onClick={joinChat} data-name={tournament.title} type='button' className="btn btn-success" disabled={props.chanList.length === 5 || props.chanList.includes(tournament.title)}>Join Tournament's chat</button>
							<button onClick={addClick} data-tournament={tournament.id} type='button' className="btn btn-secondary">See tournament's page</button>
						</div>
					</div>
				</li>)}
			</ul>}
		</>
	)
}

function Challengers({props, style}) {

	const [challengers, setChallengers] = useState(undefined)
	const [prevData, setPrevData] = useState(undefined)

	var xhr = new XMLHttpRequest()
    // xhr.open('GET', '/api/play/' + props.profileId + '/game/' + props.game + '/')
	xhr.open('GET', '/data/sampleChallengers' + props.game + '.json')
	xhr.seenBytes = 0

	xhr.onreadystatechange = () => {
	  
		if(xhr.readyState === 3) {
			var response = xhr.response.substr(xhr.seenBytes)
			if (!prevData || prevData !== response) {
				setPrevData(response)
				setChallengers(JSON.parse(response))
			
			  	xhr.seenBytes = response.length
			}
		}
	}
	xhr.send()

	if (!challengers)
		return undefined

	const seeProfile = (e) => {
		props.setProfileId(parseInt(e.target.dataset.id, 10))
		props.setPage('Profile')
	}

	const directMessage = (e) => {
		if (!props.xlg && document.getElementById('chat2').hidden) 
			document.getElementById('chat2').hidden = false
        let prompt = document.getElementById('chatPrompt')
        prompt.value = '/w '.concat('"', e.target.dataset.name, '" ')
        prompt.focus()
    }

	const setMatch = (match, opponent) => {
		var request = new XMLHttpRequest()
		request.open('POST', match === 0 ? '/game/room/create/' + props.game + '/id/' + props.myProfile.id + '/' : '/game/room/' + match + '/add-player/' + props.myProfile.id + '/')
		request.responseType = 'json'
		request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0', "Content-Type", "application/json;charset=UTF-8")
		request.send(match === 0 && JSON.stringify({game : props.game, id1 : props.myProfile.id}))
		request.onload = () => {
			// props.setMyProfile({
			// 	...props.myProfile,
			// 	match : request.response.room
			// })
			props.setOpponent(opponent)
			props.setPage('Match')
		}
	}

	const joinMatch = (e) => {
		let match = parseInt(e.target.dataset.match, 10)
		if (e.target.dataset.playing === 'true') {
			props.setMyProfile({
				...props.myProfile,
				match : match
			})
			props.setPage('Game')
		}
		else {
			let opponent = {
				id : parseInt(e.target.dataset.id, 10),
				name : e.target.dataset.name,
				avatar : e.target.dataset.avatar,
				host : match > 0
			}
			setMatch(match, opponent)
		}
	}

	function allowedSpectators(match) {
		return true
	}

	const dismiss = (e) => {
		let id = parseInt(e.target.dataset.id, 10)
		props.setMyProfile({
			...props.myProfile,
			[props.game] : {...props.myProfile[props.game], challengers : props.myProfile[props.game].challengers.filter(item => id !== item)}
		})
		setChallengers(challengers.filter(item => id !== item.id))
	}

	var menu

	function buildMenu(player) {
		let index = 1
		menu = [<li className='px-2 dropdown-item nav-link' type='button' key={index++} onClick={seeProfile} data-id={player.id}>See profile</li>]
		if (player.status === 'online') {
			menu.push(<li className='px-2 dropdown-item nav-link' type='button' key={index++} onClick={directMessage} data-name={player.name}>Direct message</li>)
			if (player.playing && allowedSpectators(player.match))
				menu.push(<li className='px-2 dropdown-item nav-link' type='button' key={index++} onClick={joinMatch} data-match={player.match} data-playing={player.playing}>Watch game</li>)
			else if (!player.playing)
				menu.push(<li className='px-2 dropdown-item nav-link' type='button' key={index++} onClick={joinMatch} data-name={player.name} data-avatar={player.avatar} data-id={player.id} data-match={player.match}>{player.match === 0 ? 'Host game' :  'Accept invitation'}</li>)
		}
		return menu
	}

	return (
		<>
		{challengers.length === 0 ?
			<div className="d-flex rounded border border-black align-items-center justify-content-center fw-bold" style={style}>Nobody's here. That's kinda sad...</div> :
			<ul className="list-group overflow-auto noScrollBar" style={{width: '90%'}}>
				{challengers.map((player) => 
					<li className={`list-group-item d-flex ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column align-items-center gap-2' : ''}`} key={player.id}>
						<img onClick={seeProfile} data-id={player.id} className="rounded-circle profileLink" title='See profile' src={"/images/".concat(player.avatar)} alt="" style={{width: '45px', height: '45px'}} />
						<div className={`d-flex ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column' : ''} justify-content-between align-items-center fw-bold ms-2 flex-grow-1`}>
							{player.name} {player.status === 'online' ? player.playing ? '(In a match)' : '(Available)' : '(offline)'}
							<div className={`d-flex gap-2 ${!props.sm ? 'd-flex flex-column align-items-center' : 'dropstart'} button-group`}>
								<button data-id={player.id} data-avatar={player.avatar} data-name={player.name} data-match={player.match} data-status={player.status} data-playing={player.playing} type='button' className={`btn btn-success`} data-bs-toggle='dropdown'>Options</button>
								<ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>
									{buildMenu(player)}
								</ul>
								<button onClick={dismiss} data-id={player.id} type='button' className={`btn btn-danger`}>Dismiss challenge</button>
							</div>
						</div>
					</li>)}
			</ul>}
		</>
	)
}

function Challenged({props, style}) {

	const [challenged, setChallenged] = useState(undefined)
	const [prevData, setPrevData] = useState(undefined)

	var xhr = new XMLHttpRequest()
    // xhr.open('GET', '/api/play/' + props.profileId + '/game/' + props.game + '/')
	xhr.open('GET', '/data/sampleChallenged' + props.game + '.json')
	xhr.seenBytes = 0

	xhr.onreadystatechange = () => {
	  
		if(xhr.readyState === 3) {
			var response = xhr.response.substr(xhr.seenBytes)
			if (!prevData || prevData !== response) {
				setPrevData(response)
				setChallenged(JSON.parse(response))
			
			  	xhr.seenBytes = response.length
			}
		}
	}
	xhr.send()

	if (!challenged)
		return undefined

	const seeProfile = (e) => {
		props.setProfileId(parseInt(e.target.dataset.id, 10))
		props.setPage('Profile')
	}

	const directMessage = (e) => {
		if (!props.xlg && document.getElementById('chat2').hidden) 
			document.getElementById('chat2').hidden = false
        let prompt = document.getElementById('chatPrompt')
        prompt.value = '/w '.concat('"', e.target.dataset.name, '" ')
        prompt.focus()
    }

	const setMatch = (match, opponent) => {
		var request = new XMLHttpRequest()
		request.open('POST', match === 0 ? '/game/room/create/' : '/game/room/' + match + '/add-player/' + props.myProfile.id + '/')
		request.responseType = 'json'
		request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0', "Content-Type", "application/json;charset=UTF-8")
		request.send(match === 0 && JSON.stringify({game : props.game, id1 : props.myProfile.id}))
		request.onload = () => {
			// props.setMyProfile({
			// 	...props.myProfile,
			// 	match : request.response.room
			// })
			props.setOpponent(opponent)
			props.setPage('Match')
		}
	}

	const joinMatch = (e) => {
		let match = parseInt(e.target.dataset.match, 10)
		if (e.target.dataset.playing === 'true') {
			props.setMyProfile({
				...props.myProfile,
				match : match
			})
			props.setPage('Game')
		}
		else {
			let opponent = {
				id : parseInt(e.target.dataset.id, 10),
				name : e.target.dataset.name,
				avatar : e.target.dataset.avatar,
				host : match > 0
			}
			setMatch(match, opponent)
		}
	}

	function allowedSpectators(match) {
		return true
	}

	const dismiss = (e) => {
		let id = parseInt(e.target.dataset.id, 10)
		props.setMyProfile({
			...props.myProfile,
			[props.game] : {...props.myProfile[props.game], challenged : props.myProfile[props.game].challenged.filter(item => id !== item)}
		})
		setChallenged(challenged.filter(item => id !== item.id))
	}

	var menu

	function buildMenu(player) {
		let index = 1
		menu = [<li className='px-2 dropdown-item nav-link' type='button' key={index++} onClick={seeProfile} data-id={player.id}>See profile</li>]
		if (player.status === 'online') {
			menu.push(<li className='px-2 dropdown-item nav-link' type='button' key={index++} onClick={directMessage} data-name={player.name}>Direct message</li>)
			if (player.playing && allowedSpectators(player.match))
				menu.push(<li className='px-2 dropdown-item nav-link' type='button' key={index++} onClick={joinMatch} data-match={player.match} data-playing={player.playing}>Watch game</li>)
			else if (!player.playing)
				menu.push(<li className='px-2 dropdown-item nav-link' type='button' key={index++} onClick={joinMatch} data-name={player.name} data-avatar={player.avatar} data-id={player.id} data-match={player.match}>{player.match === 0 ? 'Host game' :  'Accept invitation'}</li>)
		}
		return menu
	}

	return (
		<>
		{challenged.length === 0 ?
			<div className="d-flex rounded border border-black align-items-center justify-content-center fw-bold" style={style}>Nobody's here. That's kinda sad...</div> :
			<ul className="list-group overflow-auto noScrollBar" style={{width: '90%'}}>
				{challenged.map((player) => 
					<li className={`list-group-item d-flex ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column align-items-center gap-2' : ''}`} key={player.id}>
						<img onClick={seeProfile} data-id={player.id} className="rounded-circle profileLink" title='See profile' src={"/images/".concat(player.avatar)} alt="" style={{width: '45px', height: '45px'}} />
						<div className={`d-flex ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column' : ''} justify-content-between align-items-center fw-bold ms-2 flex-grow-1`}>
							{player.name} {player.status === 'online' ? player.playing ? '(In a match)' : '(Available)' : '(offline)'}
							<div className={`d-flex gap-2 ${!props.sm ? 'd-flex flex-column align-items-center' : 'dropstart'} button-group`}>
								<button data-id={player.id} data-avatar={player.avatar} data-name={player.name} data-match={player.match} data-status={player.status} data-playing={player.playing} type='button' className={`btn btn-success`} data-bs-toggle='dropdown'>Options</button>
								<ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>
									{buildMenu(player)}
								</ul>
								<button onClick={dismiss} data-id={player.id} type='button' className={`btn btn-danger`}>Dismiss challenge</button>
							</div>
						</div>
					</li>)}
			</ul>}
		</>
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
				setUsers([...users, {id : xhr.id, name : JSON.parse(xhr.response).profile.name}])
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
				setUsers([...users, {id : xhr.id, name : JSON.parse(xhr.response).profile.name}])
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