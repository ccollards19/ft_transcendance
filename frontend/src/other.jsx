import React from 'react'
import { useState } from "react"
  
export function displayNewWindow({props}, val, id) {

	var request = new XMLHttpRequest()
	request.responseType = 'json'

	if (val === 'Profile') {
		// request.open('GET', '/api/user?id='.concat(id))
		request.open('GET', '/data/sampleProfile.json')
		request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
		request.send()
		request.onload = () => {
			props.setProfile(request.response.profile)
			var on = []
			var off = []
			for (let item of request.response.friends) {
				if (item.status === 'online')
					on.push(item)
				else
					off.push(item)
			}
			props.setFriends(on.concat(off))
		}
	}
	else if (val === 'Leaderboard') {
		// request.open('GET', "/api/user?game=".concat(props.game))
		request.open('GET', '/data/sampleLadder.json')
		request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
		request.send()
		request.onload = () => props.setLadder(request.response)
	}
	else if (val === 'Tournaments') {
		// request.open('GET', "/api/tournaments?id=".concat(props.tournamentId))
		request.open('GET', '/data/sampleTournament'.concat(id === 0 ? 's' : '', '.json'))
		request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
		request.send()
		request.onload = () => {
			if (id !== 0) 
				props.setTournament(request.response)
			else {
				let on = []
				let off = []
				for (let item of request.response) {
					if (item.winnerId === 0 && item.reasonForNoWinner === '')
						on.push(item)
					else
						off.push(item)
				}
				props.setTournaments(on.concat(off))
			}
		}
	}
	else if (val === 'Play' && props.myProfile !== 'none' && props.myProfile.scope === 'remote') {
		// request.open('GET', "/api/user?id=".concat(props.myProfile.id, '?tournaments=', props.tournaments === 'none' ? 'yes' : 'no'))
		request.open('GET', '/data/samplePlay.json')
		request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
		request.send()
		request.onload = () => {
			props.setChallengers(request.response[props.game].challengers)
			props.setChallenged(request.response[props.game].challenged)
			if (props.tournaments === 'none')
				props.setTournaments(request.response.tournaments)
		}
	}
	document.getElementById(sessionStorage.getItem('currentPage')).classList.add('d-none')
	document.getElementById(val).classList.remove('d-none')
	sessionStorage.setItem('currentPage', val)
}

export function FriendList({props}) {
    
    const seeProfile = (e) => {
		let id = parseInt(e.target.dataset.id, 10)
		props.setProfileId(id)
		displayNewWindow({props}, 'Profile', 0)
	}

	const directMessage = (e) => {
		!props.xlg && props.setDisplayChat(true)
        let prompt = document.getElementById('chatPrompt')
        prompt.value = '/w '.concat('"', e.target.dataset.name, '" ')
        prompt.focus()
    }

    return (
        <ul className="d-flex rounded w-100 list-group overflow-auto noScrollBar" style={{minHeight: '300px', maxWidth: '280px'}}>
            {props.friends.map((profile) => 
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
                    	<button type='button' data-bs-toggle='dropdown' className='btn btn-secondary ms-3'>Options</button>
                    	<ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>
                    	    <li type='button' className='ps-2 dropdown-item nav-link' hidden={!profile.challengeable || profile.game !== props.game || profile.status !== 'online' || props.myProfile === 'none' || profile.id === props.myProfile.id}>Challenge</li>
                    	    <li onClick={directMessage} data-name={profile.name} type='button' className='ps-2 dropdown-item nav-link' hidden={profile.status !== 'online' || props.myProfile === 'none' || profile.id === props.myProfile.id}>Direct message</li>
                    	    <li type='button' className='px-2 dropdown-item nav-link' hidden={props.profile.id !== props.myProfile.id}>Remove from friendlist</li>
                    	    <li onClick={seeProfile} type='button' data-id={profile.id} className='ps-2 dropdown-item nav-link'>See profile</li>
                    	</ul>
					</div>
                </div>
            </li>)}
        </ul>
    )
}

export function Local({props}) {
	const [ready, setReady] = useState({
		player1: false,
		player2: false
	})
	const [start, setStart] = useState(false)
	const [profile1, setProfile1] = useState('none')
	const [profile2, setProfile2] = useState('none')
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

    if (props.myProfile !== 'none' && profile1 === 'none')
        setProfile1({
            name: props.myProfile.name,
            avatar: props.myProfile.avatar,
            id: props.myProfile.id
    })
	else if (props.myProfile === 'none' && profile1 !== 'none')
		setProfile1('none')

    const changeGame = (e) => props.setGame(e.target.dataset.game)

	function checkReady(player, check) {
		if (player === 'player1' && check && ready.player2)
			setStart(true)
		else if (player === 'player2' && check && ready.player1)
			setStart(true)
		else
			setStart(false)
	}
	
	const playerReady = (e) => {
		let newStatus = {
			...ready,
			[e.target.dataset.player]: e.target.checked
		}
		checkReady(e.target.dataset.player, e.target.checked)
		setReady(newStatus)
	}

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
			id1 : profile1 !== 'none' ? profile1.id : 'guest',
			id2 : profile2 !== 'none' ? profile2.id : 'guest'
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
		setProfile1('none')
		let obj = {
			login: sessionStorage.getItem('ft_transcendenceSessionLogin'),
			password: sessionStorage.getItem('ft_transcendenceSessionPassword')
		}
		var request = new XMLHttpRequest()
		request.open("POST", "/authenticate/sign_out/")
		request.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
		request.send(JSON.stringify(obj))
		localStorage.removeItem('ft_transcendenceLogin') && localStorage.removeItem('ft_transcendenceLogin')
		localStorage.removeItem('ft_transcendencePassword') && localStorage.removeItem('ft_transcendencePassword')
		sessionStorage.removeItem('ft_transcendenceSessionLogin')
		sessionStorage.removeItem('ft_transcendenceSessionPassword')
        props.setMyProfile('none')
		props.setAvatarSm('base_profile_picture.png')
		props.setActiveTab('All Tournaments')
	}

	const logoutLocal = (e) => {
		if (e.target.dataset.profile !== 'none') {
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
			{props.myProfile !== 'none' ?
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
					{profile1 !== 'none' ? 
						<div className="d-flex flex-column align-items-center">
							<img src={'/images/'.concat(profile1.avatar)} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{profile1.name}</span>
							<span className="d-flex gap-2 mt-3">
								<input onChange={playerReady} className="form-check-input" data-player='player1' type="checkbox" name="ready1" id="ready1" />
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
								<input onChange={playerReady} className="form-check-input" data-player='player1' type="checkbox" name="guest1" id="guest1" />
								<label className="form-check-label" htmlFor="guest1">Play as a guest</label>
							</span>
						</div>
					}
				</div>
                <img src="/images/versus.png" className="mx-3" alt="" style={{height: '150px',width: '100px'}} />
                <div className={`${props.xxlg && 'border border-black border-3 rounded'} d-flex justify-content-center align-items-center`} style={{height: props.xxlg ? '100%' : '60%', width: '50%', transform: props.xxlg ? 'rotate(0deg)' : 'rotate(-90deg)'}}>
					{profile2 !== 'none' ? 
						<div className="d-flex flex-column align-items-center">
							<img src={'/images/'.concat(profile2.avatar)} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{profile2.name}</span>
							<span className="d-flex gap-2 mt-3">
								<input onChange={playerReady} className="form-check-input" data-player='player2' type="checkbox" name="ready1" id="ready1" />
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
								<input onChange={playerReady} className="form-check-input" data-player='player2' type="checkbox" name="guest2" id="guest2" />
								<label className="form-check-label" htmlFor="guest2">Play as a guest</label>
							</span>
						</div>
					}
				</div>
            </div>
            <div className="text-center mt-3">
                <button onClick={launchGame} type="button" className="btn btn-warning" disabled={!start}>Let's rock !</button>
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

    return <>
                <p className="fs-2 fw-bold text-center">So you wanna play {props.game} ?</p>
                <hr className="mx-5" />
                <span className="ms-2" hidden={props.challengers.length === 0 && props.challenged.length === 0}>Tip : Click on an avatar to see the player's profile</span>
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">You've been challenged by</p>
                {props.challengers !== 'none' && props.challengers.length !== 0 ?
                    <Challengers props={props} /> :
                    <div className="d-flex rounded border border-black align-items-center justify-content-center fw-bold" style={style}>Nobody's here. That's kinda sad...</div> 
                }
                <hr className="mx-5" />
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">You challenged</p>
                {props.challenged !== 'none' && props.challenged.length !== 0 ?
                    <Challenged props={props} /> :
                    <div className="d-flex rounded border border-black align-items-center justify-content-center fw-bold" style={style}>Don't be shy. Other people want to play too</div> 
                }
                <hr className="mx-5" />
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">You're involved in</p>
				{props.myProfile.subscriptions.length !== 0 && props.myProfile.tournaments.length !== 0 ?
                	<RemoteTournaments props={props} /> :
					<div className="d-flex rounded border border-black align-items-center justify-content-center fw-bold" style={style}>What are you doing !? Go and conquer the world !</div>
				}
            </>
}

function RemoteTournaments({props}) {

	const addClick = (e) => {
		let id = parseInt(e.target.dataset.tournament, 10)
		props.setTournamentId(id)
		displayNewWindow({props}, "Tournaments", id)
	}

	const joinChat = (e) => {
		document.getElementById(props.chan).classList.add('d-none')
		let chanName = e.target.dataset.name
		props.setChanList([...props.chanList, chanName])
		props.setChan(chanName)
	}

	let key = 1
	let myTournaments = []
	for (let item of props.tournaments) {
		if (props.myProfile.tournaments.includes(item.id))
			myTournaments.push(item)
		else if (props.myProfile.subscriptions.includes(item.id))
			myTournaments.push(item)
	}

	return (
		<ul className="list-group overflow-auto noScrollBar" style={{width: '90%'}}>
			{myTournaments.map((tournament) =>
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
		</ul>
	)
}

function Challengers({props}) {

	const addClick = (e) => {
		let id = parseInt(e.target.dataset.id, 10)
		props.setProfileId(id)
		displayNewWindow({props}, "Profile", id)
	}

	const directMessage = (e) => {
		!props.xlg && props.setDisplayChat(true)
        let prompt = document.getElementById('chatPrompt')
        prompt.value = '/w '.concat('"', e.target.dataset.name, '" ')
        prompt.focus()
    }

	const watchGame = () => {}

	return (
		<ul className="list-group overflow-auto noScrollBar" style={{width: '90%'}}>
			{props.challengers.map((player) => 
			<li className={`list-group-item d-flex ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column align-items-center gap-2' : ''}`} key={player.id}>
				<img onClick={addClick} data-id={player.id} className="rounded-circle profileLink" title='See profile' src={"/images/".concat(player.avatar)} alt="" style={{width: '45px', height: '45px'}} />
				<div className={`d-flex ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column' : ''} justify-content-between align-items-center fw-bold ms-2 flex-grow-1`}>
					{player.name} {player.match !== 0 ? '(In a match)' : '(Available)'}
					<div className={`d-flex gap-2 ${!props.sm && 'd-flex flex-column align-items-center'}`}>
						<button onClick={player.match !== 0 ? watchGame : directMessage} data-match={player.match} data-name={player.name} type='button' className={`btn btn-success`} disabled={player.match !== 0}>{player.match !== 0 ? 'Please Wait' : 'Direct message'}</button>
						<button type='button' className={`btn btn-danger`}>Dismiss challenge</button>
					</div>
				</div>
			</li>)}
		</ul>
	)
}

function Challenged({props}) {

	const addClick = (e) => {
		let id = parseInt(e.target.dataset.id, 10)
		props.setProfileId(id)
		displayNewWindow({props}, "Profile", id)
	}

	const directMessage = (e) => {
		!props.xlg && props.setDisplayChat(true)
        let prompt = document.getElementById('chatPrompt')
        prompt.value = '/w '.concat('"', e.target.dataset.name, '" ')
        prompt.focus()
    }

	return (
		<ul className="list-group overflow-auto noScrollBar" style={{width: '90%'}}>
			{props.challenged.map((player) => 
			<li className={`list-group-item d-flex ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column align-items-center gap-2' : ''}`} key={player.id}>
				<img onClick={addClick} data-id={player.id} className="rounded-circle profileLink" title='See profile' src={"/images/".concat(player.avatar)} alt="" style={{width: '45px', height: '45px'}} />
				<div className={`d-flex ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column' : ''} justify-content-between align-items-center fw-bold ms-2 flex-grow-1`}>
					<span>{player.name} <span className={'fw-bold text-capitalize '.concat(player.status === 'online' ? 'text-success' : 'text-danger')}>({player.status})</span></span>
					<div className={`d-flex gap-2 ${!props.sm && 'd-flex flex-column align-items-center'}`}>
						<button onClick={directMessage} data-name={player.name} type='button' className="btn btn-success" hidden={player.status === 'offline'}>Direct message</button>
						<button type='button' className="btn btn-danger">Dismiss challenge</button>
					</div>
				</div>
			</li>)}
		</ul>
	)

}