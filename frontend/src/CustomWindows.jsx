import React from 'react'
import { useState } from "react"
import { FriendList, Local, Remote, displayNewWindow } from "./other.jsx"
import { SpecificTournament, Tabs } from "./Tournaments.jsx"

export function Home({props}) {

	const addClick = (e) => displayNewWindow({props}, e.target.dataset.link, 0)

    let log = props.myProfile !== 'none'

    return (
        <div id="Home" className="customWindow">
            <h1 className="text-center pt-2">Welcome !!!</h1>
            <hr className="mx-5" />
            <h3 className="text-center mb-3">Fancy a game of pong ?</h3>
            <h4 className="text-center">How to use :</h4>
            <p className="text-center mb-2">
                First, you need to <button onClick={addClick} className={'nav-link d-inline '.concat(log ? 'text-danger' : 'text-primary')} data-link='Login' disabled={log}>login</button> if you already have an account.
            </p>
            <p className="text-center mb-2">
                You may also use your 42 login if you have one
            </p>
            <div className="d-flex justify-content-center">
                <button className="nav-link" title="Click to get to the 42 login page" disabled={log}>
                    <img src="/images/42_logo.png" alt="" className="px-3 border border-black" />
                </button>
            </div>
            <p className="px-5 mt-2 text-center">
                or <button onClick={addClick} className={'nav-link d-inline '.concat(log ? 'text-danger' : 'text-primary')} data-link='Subscribe' disabled={log}>create a new account</button>.
            </p>
            <p className="text-center">
                Once you're in, take all your sweet time to complete your profile.
            </p>
            <p className="text-center">
                That's also where you will find a list of the people you added as friends.
            </p>
            <p className="text-center">
                Then, take a look at the 'Settings' page and adjust things to your liking.
            </p>
            <p className="text-center">
                The game you choose to play today affects everything game-related everywhere on the website.
            </p>
            <p className="text-center">
                That includes the background, the profiles display, the leaderboard and - obviously - the game you will play or challenge people to.
            </p>
            <p className="text-center">
                If your screen is large enough to display it, you will find a chat on the left. You need to be connected to use it.
            </p>
            <p className="text-center">
                You may use it to speak with everyone who's connected to the website via the default 'General' channel. 
            </p>
            <p className="text-center">
                A unique channel is created for each game, for the exclusive use of contenders and potential viewers (if you allowed them in the settings).
            </p>
            <p className="text-center">
                You may also click on any nickname (except yours) to display a small menu filled with self-explanatory options
            </p>
            <p className="text-center">
                On the 'leaderboard' page, you will find the top [up to] 50 players, ranked by the ELO system, for the game you chose to play today.
            </p>
            <p className="text-center">
                Finally, the 'About' page will give you informations about this project.
            </p>
            <p className="text-center">
                At any time, you can display this manual by clicking on the 'home' button, top right of the screen.
            </p>
        </div>
    )
}

export function About() {
    return (
        <div id="About" className="customWindow d-none">
            <h1 className="text-center">About this project</h1>
            <hr className="mx-5" />
            <p className="mx-5 text-center">
                This is ft_transcendence, the final project of 19's common core.
            </p>
            <p className="mx-5 text-center">
                The goal is to make a Single Page Application (SPA) designed to let players confront each other in Pong !
            </p>
            <p className="mx-5 text-center mb-4">
                Some modules were added to that basis :
            </p>
            <ul className="aboutList text-center p-0">
                <li className="mb-2"><i>Bootstrap was used to make the frontend</i></li>
                <li className="mb-2"><i>Django was used to make the backend</i></li>
                <li className="mb-2"><i>The game is handled by the server (API)</i></li>
                <li className="mb-2"><i>The website is linked to a database, so we don't lose anything when we shut it down</i></li>
                <li className="mb-2"><i>Another game is available (Surprise!)</i></li>
                <li className="mb-2"><i>The chat</i></li>
                <li className="mb-2"><i>You may play against a remote player, you don't HAVE to share a keyboard</i></li>
                <li className="mb-2"><i>You may play in the terminal. Less pretty but still fun</i></li>
            </ul>
            <hr className="mx-5" />
            <h3 className="mx-5 text-center mb-4">
                The team is composed of :
            </h3>
            <ul className="aboutList text-center p-0">
                <li className="mb-2">Karim Talbi</li>
                <li className="mb-2">Cyril Collard</li>
                <li className="mb-2">Nicolas Espana Ribera</li>
                <li className="mb-2">Gilles Poncelet</li>
            </ul>
        </div>
    )
}

export function Profile({props}) {

    const [hideName, setHideName] = useState(false)
    const [hideCPDiv, setHideCPDiv] = useState(false)
    const [hideCP, setHideCP] = useState(false)
    const [hideBioDiv, setHideBioDiv] = useState(false)
    const [hideBio, setHideBio] = useState(false)

	if (props.profile === 'none')
		return <div id='Profile' className='customWindow d-none'></div>

	const modifyName = () => { 
        document.getElementById('changeName').value = props.profile.name
        setHideName(!hideName) 
    }
    const modifyCP = () => {
        document.getElementById('changeCP').value = props.profile.catchphrase
        setHideBioDiv(!hideBioDiv)
        setHideCP(!hideCP)
    }
    const modifyBio = () => {
        document.getElementById('changeBio').value = props.profile.bio
        setHideCPDiv(!hideCPDiv)
        setHideBio(!hideBio)
    }

	var isMyProfile = false
	var profileAvatar = 'otherAvatar'
    var profileName = 'otherName'
    var myTitle = ''
	var isInMyFriendList = props.myProfile !== 'none' && props.profile.id !== props.myProfile.id && props.myProfile.friends.includes(props.profile.id)

    if (props.myProfile !== 'none' && props.profile.id === props.myProfile.id) {
		isMyProfile = true
		profileAvatar = 'myAvatar'
    	profileName = 'myName'
    	myTitle = 'Modify Name'
	}

    if (props.profile.id !== props.myProfile.id) {
        if (hideName)
            setHideName(false)
        if (hideCPDiv)
            setHideCPDiv(false)
        if (hideCP)
            setHideCP(false)
        if (hideBioDiv)
            setHideBioDiv(false)
        if (hideBio)
            setHideBio(false)
    }

	const modifyMyProfile = (e) => {
		let {name} = e.target
		let value
		if (name === 'name') {
			value = document.getElementById('changeName').value
			modifyName()
		}
		else if (name === 'catchphrase') {
			value = document.getElementById('changeCP').value
			modifyCP()
		}
		else if (name === 'bio') {
			value = document.getElementById('changeBio').value
			modifyBio()
		}
		var request = new XMLHttpRequest()
		request.open('POST', "/api/user?id=".concat(props.myProfile.id, '?login=', sessionStorage.getItem('ft_transcendenceSessionLogin'), '?password=', sessionStorage.getItem('ft_transcendenceSessionPassword'), '?', name, '=', value))
		request.send()
		request.onload = () => {
			if (request.status === '404')
				window.alert("Couldn't reach DB")
			else {
				props.setProfile({
					...props.profile,
					[name]: value
				})
				props.setMyProfile({
					...props.myProfile,
					[name]: value
				})
			}
		}
	}

    const directMessage = () => {
        let prompt = document.getElementById('chatPrompt')
        prompt.value = '/w '.concat('"', props.profile.name, '" ')
        prompt.focus()
    }

	let challenge = props.profile.challengeable && props.profile.game === props.game && props.profile.status === 'online' && props.myProfile !== 'none'
	let message = props.profile.status === 'online' && props.myProfile !== 'none'

    return (
        <div id="Profile" className="customWindow d-flex flex-column d-none">
            <div className="w-100 pt-1 px-1 d-flex gap-2 justify-content-between">
                <label id={profileAvatar} htmlFor='avatarUpload' className="rounded-circle d-flex justify-content-center align-items-center position-relative" style={{height: '125px',width: '125px'}}>
                    <img id='avatarLarge' src={'/images/'.concat(props.profile.avatar)} alt="" className="rounded-circle" style={{height: '100%',width: '100%'}} />
                    <span id='modifyAvatarLabel' className="text-white fw-bold position-absolute">Modify avatar</span>
                    <input id='avatarUpload' type="file" accept='image/jpeg, image/png' disabled={!isMyProfile} />
                </label>
                <h2 className="d-flex justify-content-center flex-grow-1">
                    <button onClick={modifyName} className='nav-link' title={myTitle} disabled={!isMyProfile} hidden={hideName}>
                        <span id={profileName} className="fs-1 fw-bold text-decoration-underline">{props.profile.name}</span>
                    </button>
                    <div style={{maxWidth: '40%'}} hidden={!hideName}>
                        <form className="d-flex flex-column align-self-center" action='/modifyMyProfile.jsx'>
                            <div className="form-text fs-5">Max 20 characters</div>
                            <input id="changeName" type="text" name="modifyNameForm" className="fs-3" size="40" maxLength="20" />
                            <div className="d-flex flex-row gap-2">
                                <button type="button" onClick={modifyMyProfile} name='name' className="btn btn-success my-1">Save changes</button>
                                <button type="button" onClick={modifyName} className="btn btn-danger my-1">Cancel changes</button>
                            </div>
                        </form>
                    </div>
                </h2>
                <div className="border-start border-bottom border-black p-3 rounded-circle" style={{width: '125px',height: '125px'}}>
                    <img src={'/images/'.concat(props.profile[props.game].rank)} alt="" className="rounded-circle" style={{height: '100%',width: '100%'}} />
                </div>
            </div>
            <div className="mw-100 flex-grow-1 d-flex flex-column p-2" style={{maxHeight: '75%'}}>
                <p className="d-flex justify-content-around text-uppercase fs-5 fw-bold">
                    <span className="text-success">wins - {props.profile[props.game].wins}</span>
                    <span className="text-primary">Matches played - {props.profile[props.game].matches}</span>
                    <span className="text-danger">loses - {props.profile[props.game].loses}</span>
                </p>
                <div className="d-flex justify-content-center" style={{height: '40px'}}>
                <button type='button' data-bs-toggle='dropdown' className='btn btn-secondary ms-3' hidden={(!challenge && !message && !isInMyFriendList) || isMyProfile}>Options</button>
                    <ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>
                        <li type='button' className='ps-2 dropdown-item nav-link' hidden={!challenge}>Challenge</li>
                        <li onClick={directMessage} type='button' className='ps-2 dropdown-item nav-link' hidden={!message}>Direct message</li>
                        <li type='button' className='ps-2 dropdown-item nav-link' hidden={!isInMyFriendList}>Unfriend</li>
                    </ul>
                </div>
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">Friend List</p>
                <div className="d-flex mt-1" style={{maxHeight: '80%'}}>
                    {props.profile.friends.length > 0 ?
                        <FriendList props={props}  /> :
                        <div className="w-25 d-flex rounded border border-black d-flex align-items-center justify-content-center fw-bold" style={{height: '100%', maxWidth : '280px'}}>
                            Nothing to display... Yet
                        </div>
                    }
                    <div className="d-flex flex-column gap-3 ms-3" style={{maxWidth: '800px', height: '100%'}}>
                        <div className="ps-3" style={{minHeight: '20%'}} hidden={hideCPDiv}>
                            <span className="me-3 mt-1 text-decoration-underline fs-4 fw-bold text-danger-emphasis">Catchphrase</span>
                            <button onClick={modifyCP} type="button" className="btn btn-secondary" hidden={!isMyProfile || hideCP}>Modify</button>
                            <div className="w-100 m-0 fs-4" hidden={hideCP}>{props.profile.catchphrase}</div>
                            <div hidden={!hideCP}>
                                <form className="d-flex flex-column" action='/modifyMyProfile.jsx'>
                                    <div className="form-text">Max 80 characters</div>
                                    <input id="changeCP" type="text" name="modifyCPForm" size="40" maxLength="80" />
                                    <span><button onClick={modifyMyProfile} name='catchphrase' type="button" data-id="" className="btn btn-success my-1">Save changes</button></span>
                                    <span><button onClick={modifyCP} type="button" className="btn btn-danger">Cancel changes</button></span>
                                </form>
                            </div>
                        </div>
                        <div className="ps-3" style={{maxHeight: '60%'}} hidden={hideBioDiv}>
                            <span className="me-3 mt-1 text-decoration-underline fs-4 fw-bold text-danger-emphasis">Bio</span>
                            <button onClick={modifyBio} type="button" data-info='bio' className="btn btn-secondary" hidden={!isMyProfile || hideBio}>Modify</button>
                            <div className="mt-1 flex-grow-1 fs-5 overflow-auto" style={{maxHeight: '100%'}} hidden={hideBio}>{props.profile.bio}</div>
                            <div hidden={!hideBio}>
                                <form className="d-flex flex-column" action='/modifyMyProfile.jsx'>
                                    <textarea id="changeBio" name="modifyBioForm" cols="50" rows="5"></textarea>
                                    <span><button onClick={modifyMyProfile} name='bio' type="button" className="btn btn-success my-1">Save changes</button></span>
                                    <span><button onClick={modifyBio} type="button" data-info='bio' className="btn btn-danger">Cancel changes</button></span>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function Settings({props}) {
    const [changes, setChanges] = useState(true)
    const [config, setConfig] = useState({
		game: props.myProfile.game,
		device: props.myProfile.device,
		scope: props.myProfile.scope,
		challengeable: props.myProfile.challengeable,
		queue: props.myProfile.queue,
		spectate: props.myProfile.spectate
	})
    const [configCopy, setConfigCopy] = useState(config)

    function configChanged (newConfig) {
        if (newConfig.game !== configCopy.game)
            return true
        else if (newConfig.device !== configCopy.device)
            return true
        else if (newConfig.scope !== configCopy.scope)
            return true
        else if (newConfig.challengeable !== configCopy.challengeable)
            return true
        else if (newConfig.queue !== configCopy.queue)
            return true
        else if (newConfig.spectate !== configCopy.spectate)
            return true
        return false
    }

    function checkChanges(newConfig) {
        if (configChanged(newConfig))
            setChanges(false)
        else 
            setChanges(true)
    }

    const validateChanges = () => {
        // saveChangesInDb(config)
        setChanges(true)
		if (props.game !== config.game) {
			var request = new XMLHttpRequest()
			request.open('GET', "changeGameInSettings?id=".concat(props.myProfile.id, '?login=', sessionStorage.getItem('ft_transcendenceSessionLogin'), '?password=', sessionStorage.getItem('ft_transcendenceSessionPassword')))
			request.responseType = 'json'
			request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
			request.send()
			request.onload = () => {
				var response = request.response
				props.setChallengers(response.challengers)
				props.setChallenged(response.challenged)
				props.setGame(response.myProfile.game)
				props.setLadder(response.ladder)
				let on = []
				let off = []
				for (let item of response.tournaments) {
					if (item.winnerId === 0 && item.reasonForNoWinner === '')
						on.push(item)
					else
						off.push(item)
				}
				props.setTournaments(on.concat(off))
			}
			props.setGame(config.game)
		}
        props.setMyProfile({
            ...props.myProfile,
            game: config.game,
            device: config.device,
            scope: config.scope,
            challengeable: config.challengeable,
            queue: config.queue,
            spectate: config.spectate
        })
        setConfigCopy(config)
    }

    const applyChanges = (e) => {
        const {name, value} = e.target
        let newConfig = {
            ...config,
            [name]: value
        }
        setConfig(newConfig)
        checkChanges(newConfig)
    }

    const applyChangesCheckBox = (e) => {
        const {name, checked} = e.target
        let newConfig = {
            ...config,
            [name]: checked
        }
        setConfig(newConfig)
        checkChanges(newConfig)
    }

    

    return (
        <div id="Settings" className="customWindow d-flex align-items-center justify-content-center d-none">
            <div className="w-50 p-2 border border-3 border-black rounded bg-secondary d-flex flex-column justify-content-center align-items-center overflow-auto text-dark">
                <h2 className="text-center pt-2 fs-3 fw-bold">Settings</h2>
                <label htmlFor="game" className="form-label ps-2 pt-3">What game do you wish to play today ?</label>
                <select onChange={applyChanges} name="game" id="game" className="form-select w-50" defaultValue={config.game}>
                    <option id='pong' value="pong">Pong</option>
                    <option id='chess' value="chess">Chess</option>
                </select>
                <span className="form-text">This will affect the display on some parts of the website</span>
                <label htmlFor="whatDevice" className="form-label ps-2 pt-3">What device will you use ?</label>
                <select onChange={applyChanges} name="device" id="whatDevice" className="form-select w-50" defaultValue={config.device}>
                    <option value="keyboard">Keyboard</option>
                    <option value="mouse">Mouse</option>
                    <option value="touch">Touch-screen</option>
                </select>
                <form className="w-100 pt-4 d-flex justify-content-center gap-2">
                    <div className="w-50 form-check form-check-reverse d-flex justify-content-end">
                        <label className="form-check-label pe-2" htmlFor="remote">Remote
                            <input onChange={applyChanges} className="form-check-input" type="radio" name="scope" value='remote' id="remote" checked={config.scope === 'remote'} />
                        </label>
                    </div>
                    <div className="w-50 form-check d-flex justify-content-start">
                        <label className="form-check-label ps-2" htmlFor="local">Local
                            <input onChange={applyChanges} className="form-check-input" type="radio" name="scope" value='local' id="local" checked={config.scope === 'local'} />
                        </label>
                    </div>
                </form>
                <div className="w-25 pt-4 d-flex justify-content-center">
                    <div className="form-check">
                      <input onChange={applyChangesCheckBox} className="form-check-input" type="checkbox" name="challengeable" id="challengeable" defaultChecked={config.challengeable} />
                      <label className="form-check-label" htmlFor="challengeable">Challengeable</label>
                    </div>
                </div>
                <div id="queue" className="d-flex flex-column align-items-center pt-4">
                    <div><label htmlFor="queueLength" className="form-label">Queue length</label></div>
                    <div><input onChange={applyChanges} type="text" id="queueLength" name="queue" className="form-control" defaultValue={config.queue} /></div>
                    <div><span className="form-text">0 for no limit</span></div>
                </div>
                <div className="form-check py-3">
                    <input onChange={applyChangesCheckBox} className="form-check-input" type="checkbox" name="spectate" id="spectator" defaultChecked={config.spectate} />
                    <label className="form-check-label" htmlFor="spectator">Allow spectators</label>
                </div>
                <button onClick={validateChanges} type="button" className="btn btn-primary" disabled={changes}>Save changes</button>
            </div>
        </div>
    )
}

export function Play({props}) {

	let log = localStorage.getItem('myId') !== 0
    let remote

    if (log && props.myProfile.scope === 'remote')
        remote = true
	else
		remote = false

	return (
		<div id='Play' className='customWindow d-none'>
			{remote ?
				<Remote props={props} /> :
				<Local props={props} />
			}
		</div>
	)
}

export function Leaderboard({props}) {

	if (props.ladder === 'none')
		return <div id='Leaderboard' className='customWindow d-none'></div>

	const seeProfile = (e) => {
		let id = parseInt(e.target.dataset.id, 10)
		props.setProfileId(id)
		displayNewWindow({props}, 'Profile', id)
	}

    const changeGame = (e) => {
		props.setGame(e.target.dataset.game)
		document.getElementById(e.target.dataset.game).selected = true
		var request = new XMLHttpRequest()
		request.open('GET', "fetchLadder?game=".concat(e.target.dataset.game))
		request.responseType = 'json'
		request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
		request.send()
		request.onload = () => props.setLadder(request.response)
	}

	let rank = 1

    return (
        <div id="Leaderboard" className="customWindow d-none">
            <div className="d-flex mb-0 justify-content-center align-items-center fw-bold fs-2" style={{minHeight: '10%'}}>
                Leaderboard (<button type='button' className='nav-link text-primary' data-bs-toggle='dropdown'>{props.game}</button>)
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
            <span className="ms-2">Tip : Click on an avatar to see the player's profile</span>
            <ul className="list-group mt-2">
                <li id="leaderhead" className="list-group-item w-100 d-flex p-1 pt-2">
                    <span className="d-flex justify-content-center" style={{width: '5%'}}><i>#</i></span>
                    <span style={{width: '5%'}}>Avatar</span>
                    <span style={{width: '50%'}}>Name</span>
                    <span style={{width: '10%'}} className="d-flex justify-content-center">Matches</span>
                    <span style={{width: '10%'}} className="d-flex justify-content-center">Wins</span>
                    <span style={{width: '10%'}} className="d-flex justify-content-center">Loses</span>
                    <span style={{width: '10%'}} className="d-flex justify-content-center">Level</span>
                </li>
            </ul>
            <div className="overflow-auto noScrollBar d-flex" style={{maxHeight: '70%'}}>
                <ul className="w-100 list-group" style={{maxHeight: '100%'}}>
				{props.ladder.map((profile) => 
					<li className="list-group-item w-100 d-flex align-items-center p-1" style={{minHeight: '50px'}} key={profile.id}>
        			    <span style={{width: '5%'}} className="d-flex justify-content-center">{rank++}</span>
        			    <span style={{width: '5%'}} className="h-100">
        			        <img onClick={(seeProfile)} src={'/images/'.concat(profile.avatar)} className="profileLink rounded-circle" data-id={profile.id} alt="" title='See profile' style={{height: '45px', width: '45px'}} />
        			    </span>
        			    <span style={{width: '50%'}}>{profile.name}</span>
        			    <span style={{width: '10%'}} className="d-flex justify-content-center">{profile[props.game].matches}</span>
        			    <span style={{width: '10%'}} className="d-flex justify-content-center">{profile[props.game].wins}</span>
        			    <span style={{width: '10%'}} className="d-flex justify-content-center">{profile[props.game].loses}</span>
        			    <span style={{width: '10%'}} className="d-flex justify-content-center">{profile[props.game].level}</span>
        			</li>)}
                </ul>
            </div>
        </div>
    )
}

export function Tournaments({props}) {

	if (props.tournaments === 'none' && props.tournament === 'none')
		return <div id='Tournaments' className='customWindow d-none'></div>

	if (props.myProfile !== 'none') {
		var mySub = props.myProfile[props.game].subscriptions.map((tournament) => props.tournaments[tournament])
		var myTourn = props.myProfile[props.game].tournaments.map((tournament) => props.tournaments[tournament])
	}

	const seeTournament = (e) => {
		let tournamentId = parseInt(e.target.dataset.tournament, 10)
		props.setTournamentId(tournamentId)
		var request = new XMLHttpRequest()
		request.open('GET', "fetchSpecificTournament?id=".concat(tournamentId))
		request.responseType = 'json'
		request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
		request.send()
		request.onload = () => props.setTournament(request.response)
	}

    const changeGame = (e) => {
		let newGame = e.target.dataset.game
		document.getElementById(newGame).selected = true
		props.setGame(newGame)
		var request = new XMLHttpRequest()
		request.open('GET', "fetchTournamentsList?game=".concat(newGame))
		request.responseType = 'json'
		request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
		request.send()
		request.onload = () => props.setTournaments(request.response)
	}

	const createTournament= () => displayNewWindow({props}, 'NewTournament', 0)


	return (
		<div id='Tournaments' className='customWindow d-none'>
			{props.tournamentId !== 0 ?
				<SpecificTournament props={props} /> :
                <>
				 <div className="d-flex mb-0 justify-content-center align-items-center fw-bold fs-2" style={{minHeight: '10%'}}>
            	    Tournaments (<button type='button' className='nav-link text-primary' data-bs-toggle='dropdown'>{props.game}</button>)
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
                <Tabs props={props}>
					<ul title='All Tournaments' className="list-group" key='all'>
                    <div className='d-flex justify-content-center gap-3 my-2'>
                        <div className='bg-white border border-black border-3 rounded py-1 d-flex justify-content-center fw-bold' style={{width: '100px'}}>Ongoing</div>
                        <div className='bg-dark-subtle border border-black border-3 rounded py-1 d-flex justify-content-center fw-bold' style={{width: '100px'}}>Over</div>
                    </div>
						{props.tournaments.map((tournament) => 
							<li className={`list-group-item d-flex px-2 py-1 border border-2 rounded ${tournament.winnerId === 0 && tournament.reasonForNoWinner === "" ? 'bg-white' : 'bg-dark-subtle'}`} key={tournament.id} style={{minHeight: '50px'}}>
							<div className="d-flex align-items-center" style={{width: '50px', height: '50px'}}>
								<img className="rounded-circle" title='See profile' src={"/images/".concat(tournament.picture)} alt="" style={{width: '45px', height: '45px'}} />
							</div>
							<div className="d-flex justify-content-between align-items-center fw-bold ms-2 flex-grow-1">
								<span>{tournament.title} <span className="text-danger-emphasis fw-bold" hidden={tournament.organizerId !== props.myProfile.id}>(You are the organizer)</span></span>
								<div><button onClick={seeTournament} data-tournament={tournament.id} type='button' className="btn btn-secondary">See tournament's page</button></div>
							</div>
						</li>)}
					</ul>
					<ul title='My subscriptions' className="list-group" key='sub'>
						{props.myProfile === 'none' ?
							undefined :
							mySub.map((tournament) => 
								<li className="list-group-item d-flex px-2 py-1 bg-white border rounded" key={tournament.id}>
								<div className="d-flex align-items-center" style={{width: '50px', height: '50px'}}>
									<img className="rounded-circle" title='See profile' src={"/images/".concat(tournament.picture)} alt="" style={{width: '45px', height: '45px'}} />
								</div>
								<div className="d-flex justify-content-between align-items-center fw-bold ms-2 flex-grow-1">
                                    <span>{tournament.title} <span className="text-danger-emphasis fw-bold" hidden={tournament.organizerId !== props.myProfile.id}>(You are the organizer)</span></span>
									<div><button onClick={seeTournament} data-tournament={tournament.id} type='button' className="btn btn-secondary">See tournament's page</button></div>
								</div>
							</li>)}
					</ul>
                    <div title='My Tournaments' key='my'>
                        <div className='d-flex justify-content-center'><button onClick={createTournament} type='button' className='btn btn-secondary my-2'>Create a tournament</button></div>
					    <ul className="list-group">
					    	{props.myProfile === 'none' ?
					    	undefined :
					    	myTourn.map((tournament) => 
					    		<li className="list-group-item d-flex px-2 py-1 bg-white border rounded" key={tournament.id}>
					    		<div className="d-flex align-items-center" style={{width: '50px', height: '50px'}}>
					    			<img className="rounded-circle" title='See profile' src={"/images/".concat(tournament.picture)} alt="" style={{width: '45px', height: '45px'}} />
					    		</div>
					    		<div className="d-flex justify-content-between align-items-center fw-bold ms-2 flex-grow-1">
					    			{tournament.title}
					    			<div><button onClick={seeTournament} data-tournament={tournament.id} type='button' className="btn btn-secondary">See tournament's page</button></div>
					    		</div>
					    	</li>)}
					    </ul>
                    </div>
				</Tabs>
                </>
			}
		</div>
	)
}

export function NewTournament({props}) {

	const [newTournament, setNewTournament] = useState({
		game: props.game,
		organizerId: props.myProfile.id,
		organizerName: props.myProfile.name,
		picture: '',
		title: '',
		background: '',
		maxContenders: 4,
		timeout: 0,
        scope: 'public'
	})
	const [existingName, setExistingName] = useState(false)

	const createTournament = () => {
		var request = new XMLHttpRequest()
		request.open('POST', "/api/tournaments?details=".concat(newTournament))
		request.responseType = 'json'
		request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
		request.send()
		request.onload = () => {
			if (request.status === '404')
				window.alert("Internal server error")
			else if (request.response.detail && request.response.detail === 'Name already in use')
				setExistingName(true)
			else {
				displayNewWindow({props}, 'Tournaments', request.response.id)
				setExistingName(false)
			}
		}
		setNewTournament({
			...newTournament,
			picture: '',
			title: '',
			background: '',
			maxContenders: 4,
			timeout: 0
		})
	}

	return (
		<div id='NewTournament' className='customWindow d-flex align-items-center justify-content-center d-none'>
			<div className="w-50 p-2 border border-3 border-black rounded bg-secondary d-flex flex-column justify-content-center align-items-center overflow-auto text-dark">
                <h2 className="text-center pt-2 fs-3 fw-bold">Creation of a brand new tournament</h2>
                <label htmlFor="tournGame" className="form-label ps-2 pt-3">What game will the contenders play ?</label>
                <select name="tournGame" id="tournGame" className="form-select w-50" defaultValue={newTournament.game}>
                    <option id='pong' value="pong">Pong</option>
                    <option id='chess' value="chess">Chess</option>
                </select>
				<div className="d-flex flex-column align-items-center pt-3">
                    <label htmlFor="tournamentName" className="form-label">Title of the tournament</label>
                    <input type="text" id="tournamentName" name="tournamentName" className="form-control" />
					<p hidden={!existingName}>A tournament with this title already exists</p>
                </div>
				<div className='d-flex flex-column align-items-center mt-1'>
					<label htmlFor="tournamentPic" className="form-label">Choose a picture for the tournament</label>
					<input id='tournamentPic' type="file" accept='image/jpeg, image/png' style={{width: '100px'}} />
				</div>
				<div className='d-flex flex-column align-items-center mt-2'>
					<label htmlFor="tournamentBG" className="form-label">You may add a background image for the tournament</label>
					<input id='tournamentBG' type="file" accept='image/jpeg, image/png' style={{width: '100px'}} />
				</div>
				<div className="d-flex flex-column align-items-center pt-4">
                    <label htmlFor="maxContenders" className="form-label">Max number of contenders</label>
                    <input type="text" id="maxContenders" name="maxContenders" className="form-control" defaultValue='4' />
					<span className="form-text">Must be a multiple of 4</span>
                </div>
                <div className="d-flex flex-column align-items-center pt-3">
                    <label htmlFor="timeout" className="form-label">Timeout</label>
                    <input type="text" id="timeout" name="timeout" className="form-control" defaultValue={newTournament.timeout} />
					<span className="form-text">Time before a victory by forfeit</span>
                    <span className="form-text">0 for no limit</span>
                </div>
				<div className="w-50 pt-4 d-flex justify-content-center">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" name="selfContender" id="selfContender" />
                      <label className="form-check-label" htmlFor="selfContender">Will you be a contender yourself ?</label>
                    </div>
                </div>
                <div className="w-100 pt-4 d-flex justify-content-center gap-2">
                    <div className="w-50 form-check form-check-reverse d-flex justify-content-end">
                        <label className="form-check-label pe-2" htmlFor="public">Public
                            <input className="form-check-input" type="radio" name="scope" value='public' id="public" checked={newTournament.scope === 'public'} />
                        </label>
                    </div>
                    <div className="w-50 form-check d-flex justify-content-start">
                        <label className="form-check-label ps-2" htmlFor="private">Private
                            <input className="form-check-input" type="radio" name="scope" value='private' id="private" checked={newTournament.scope === 'private'} />
                        </label>
                    </div>
                </div>
				<span className='mt-2'>Choose those informations carefuly for you won't be able to change them later</span>
                <button onClick={createTournament} type="button" className="btn btn-primary mt-3">Create tournament</button>
            </div>
		</div>
	)

}

export function Login({props}) {

    const [cookie, setCookie] = useState(false)
    const [logForm, setLogForm] = useState({
        login: '',
        password: ''
    })
    const [emptyLogin, setEmptyLogin] = useState(false)
    const [emptyPW, setEmptyPW] = useState(false)
    const [wrongForm, setWrongForm] = useState(false)

    // const checkIssues = () => {
    //     let issue = false
    //     if (logForm.logAddress === '') {
    //         setEmptyLogin(true)
    //         issue = true
    //     }
    //     if (logForm.logPassword === '') {
    //         setEmptyPW(true)
    //         issue = true
    //     }
    //     return issue
    // }

    const login = () => {
        // if (!checkIssues()) {
			var request = new XMLHttpRequest()
			request.open('GET', "/api/user?login=".concat(logForm.login, '?password=', logForm.password))
			request.responseType = 'json'
			request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
			request.send()
			request.onload = () => {
				var response = request.response
				if (response.detail && response.detail === 'Wrong')
					setWrongForm(true)
				else {
					if (cookie) {
						localStorage.setItem('ft_transcendenceLogin', logForm.login)
						localStorage.setItem('ft_transcendencePassword', logForm.password)
					}
					sessionStorage.setItem('ft_transcendenceSessionLogin', logForm.login)
					sessionStorage.setItem('ft_transcendenceSessionPassword', logForm.password)
					props.setMyProfile(response.profile)
					props.setAvatarSm(response.profile.avatar)
					props.setProfile(response.profile)
					props.setProfileId(response.profile.id)
					if (response.profile.game !== props.game)
						props.setGame(response.profile.game)
					if (wrongForm)
						setWrongForm(false)
					displayNewWindow({props}, "Profile", response.profile.id)
				}
			}
        // }
    }

    const typing = (e) => {
        let {name, value} = e.target
        setLogForm({
            ...logForm,
            [name]: value
        })
        setEmptyLogin(false)
        setEmptyPW(false)
        setWrongForm(false)
    }

	const toSubscribe = () => displayNewWindow({props}, 'Subscribe', 0)

    const toggleCookie = (e) => { setCookie(e.target.checked) }

    return (
        <div id="Login" className="customWindow d-flex align-items-center justify-content-center d-none">
            <div className="w-50 p-2 border border-3 border-black rounded bg-secondary d-flex flex-column justify-content-between align-items-center overflow-auto">
                <p className="fs-4 fw-bold">Please login</p>
                <form action="" className="d-flex flex-column align-items-center">
                    <div className="mb-2">
                        <label htmlFor="logAddress" className="form-label">Username</label>
                        <input onChange={typing} name="login" type="text" className={"form-control ".concat(emptyLogin ? 'border border-3 border-danger' : '')} id="logAddress" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="logPassword" className="form-label">Password</label>
                        <input onChange={typing} name="password" type="password" className={"form-control ".concat(emptyPW ? 'border border-3 border-danger' : '')} id="logPassword" />
                    </div>
                    <div className="text-danger-emphasis mt-2" hidden={!wrongForm}>Wrong address or password</div>
                    <button onClick={login} type="button" className="btn btn-info mb-2">Login</button>
                </form>
                <p className="fw-bold px-2 text-center">If you don't have an account, you may <button onClick={toSubscribe} className="nav-link d-inline text-info text-decoration-underline" data-link='Subscribe'>subscribe here</button></p>
                <p className="fw-bold">You may also use your 42 account</p>
                <button className="nav-link"><img src="/images/42_logo.png" alt="" className="border border-black px-3" /></button>
                <div className="form-check mt-3">
                  <input onChange={toggleCookie} className="form-check-input" type="checkbox" name="cookie" id="cookie" defaultChecked={false} />
                  <label className="form-check-label" htmlFor="cookie">Remember me</label>
                </div>
            </div>
        </div>
    )
}

export function Subscribe({props}) {

    const [newProfile, setNewProfile] = useState({
        address: '',
        name: '',
        password: '',
        passwordConfirm: ''
    })
    const [wrongPW, setWrongPW] = useState(false)
    const [wrongAdd, setWrongAdd] = useState(false)
    const [existingAddr, setExistingAddr] = useState(false)
    const [existingName, setExistingName] = useState(false)
    const [emptyAddress, setEmptyAddress] = useState(false)
    const [emptyName, setEmptyName] = useState(false)
    const [emptyPassword, setEmptyPassword] = useState(false)
    const [emptyPasswordConfirm, setEmptyPasswordConfirm] = useState(false)

    const checkIssues = () => {
        let issue = false
        if (newProfile.address === '') {
            setEmptyAddress(true)
            issue = true
        }
        if (newProfile.password === '') {
            setEmptyPassword(true)
            issue = true
        }
		if (newProfile.name === '') {
            setEmptyName(true)
            issue = true
        }
        if (newProfile.passwordConfirm === '') {
            setEmptyPasswordConfirm(true)
            issue = true
        }
        if (newProfile.password !== '' && newProfile.passwordConfirm !== '' && newProfile.password !== newProfile.passwordConfirm) {
            setWrongPW(true)
            issue = true
        }
        return issue
    }

    const subscribe = () => {
        if (!checkIssues()) {
			var request = new XMLHttpRequest()
			request.open('POST', "/api/user?login=".concat(newProfile.address, '?username=', newProfile.name, '?password=', newProfile.password, '?game=', props.game))
			request.responseType = 'json'
			request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
			request.send()
			request.onload = () => {
				if (request.status === '404')
					window.alert("Internal server error")
				else if (request.response.detail) {
					let detail = request.response.detail
					if (detail === 'Address already in use')
						setExistingAddr(true)
					else if (detail === 'Username already exists')
						setExistingName(true)
				}
				else {
					props.setMyProfile(request.response.profile)
					props.setProfile(request.response.profile)
					props.setProfileId(request.response.profile.id)
					displayNewWindow({props}, "Profile", request.response.profile.id)
					if (existingAddr)
						setExistingAddr(false)
					if (existingName)
						setEmptyName(false)
				}
			}
        }
    }

    const typing = (e) => {
        let {name, value} = e.target
        setNewProfile({
            ...newProfile,
            [name]: value
        })
        setWrongPW(false)
        setWrongAdd(false)
        setExistingName(false)
		setExistingAddr(false)
        setEmptyAddress(false)
        setEmptyPassword(false)
        setEmptyPasswordConfirm(false)
    }

    return (
    <div id="Subscribe" className="customWindow d-flex align-items-center justify-content-center d-none">
        <div className="w-50 p-2 border border-3 border-black rounded bg-secondary d-flex flex-column justify-content-between align-items-center overflow-auto">
            <p className="fs-4 fw-bold px-3 text-center">Welcome to ft_transcendence !</p>
            <form action="" className="d-flex flex-column align-items-center">
                <div className="mb-2">
                    <label htmlFor="subAddress" className="form-label">E-mail Address:</label>
                    <input onChange={typing} name='address' type="email" className={"form-control ".concat(emptyAddress ? 'border border-3 border-danger' : '')} id="subAddress" />
                    <div className="text-danger-emphasis mt-2" hidden={!existingAddr}>This address is already used</div>
                    <div className="text-danger-emphasis mt-2" hidden={!wrongAdd}>Invalid address</div>
                    <label htmlFor="subName" className="form-label">Username:</label>
                    <input onChange={typing} name='name' type="text" className={"form-control ".concat(emptyName ? 'border border-3 border-danger' : '')} id="subName" />
                    <div className="text-danger-emphasis mt-2" hidden={!existingName}>This username is already used</div>
                </div>
                <div className="mb-4">
                    <label htmlFor="subPassword" className="form-label">Password:</label>
                    <input onChange={typing} type="password" name='password' className={"form-control ".concat(emptyPassword ? 'border border-3 border-danger' : '')} id="subPassword" />
                    <label htmlFor="subPasswordConfirm" className="form-label">Password confirmation:</label>
                    <input onChange={typing} type="password" name='passwordConfirm' className={"form-control ".concat(emptyPasswordConfirm ? 'border border-3 border-danger' : '')} id="subPasswordConfirm" />
                    <div className="text-danger-emphasis mt-2" hidden={!wrongPW}>The passwords do not match</div>
                </div>
                <button onClick={subscribe} type="button" className="btn btn-info">Create account</button>
            </form>
        </div>
    </div>)
}

export default Home