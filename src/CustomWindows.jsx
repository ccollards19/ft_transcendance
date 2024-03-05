import React from 'react'
import { useState } from "react"
import { FriendList, Ladder, Local, Remote } from "./other.jsx"
import { MyTournaments, AllTournaments, MySubscriptions, SpecificTournament, TournamentsTabs } from "./Tournaments.jsx"
import { displayNewWindow } from "./NavBar.jsx"

const addClick = (e) => {
    displayNewWindow(e.target.dataset.link)
}

export function Home({props}) {

    let log = props.myProfile !== 'none'

    return (
        <div id="Home" className="customWindow">
            <h2 className="text-center pt-2">Welcome !!!</h2>
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
            <h2 className="text-center">About this project</h2>
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
    const isAFriend = () => {
        for (let friend of props.myProfile.friends) {
            if (props.profile.id === friend)
                return true
        }
        return false
    }

    let profileAvatar = props.profile.id === props.myProfile.id ? 'myAvatar' : 'otherAvatar'
    let profileName = props.profile.id === props.myProfile.id ? 'myName' : 'otherName'
    let myTitle = props.profile.id === props.myProfile.id ? 'Modify Name' : ''
    let otherProfile = props.profile.id !== props.myProfile.id
    let isInMyFriendList = false
    if (props.myProfile !== 'none' && props.profile.id !== props.myProfile.id && isAFriend())
        isInMyFriendList = true

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
		props.setProfile({
			...props.profile,
			[name]: value
		})
		props.setMyProfile({
			...props.myProfile,
			[name]: value
		})
		// Modify profile in the DB
	}

    const directMessage = () => {
        let prompt = document.getElementById('chatPrompt')
        prompt.value = '/w '.concat('"', props.profile.name, '"', ' ')
        prompt.focus()
    }

    return (
        <div id="Profile" className="customWindow d-flex flex-column d-none">
            <div className="w-100 pt-1 px-1 d-flex gap-2 justify-content-between">
                <label id={profileAvatar} htmlFor='avatarUpload' className="rounded-circle d-flex justify-content-center align-items-center position-relative" style={{height: '125px',width: '125px'}}>
                    <img id='avatarLarge' src={'/images/'.concat(props.profile.avatar)} alt="" className="rounded-circle" style={{height: '125px',width: '125px'}} />
                    <span id='modifyAvatarLabel' className="text-white fw-bold position-absolute">Modify avatar</span>
                    <input id='avatarUpload' type="file" disabled={otherProfile} />
                </label>
                <h2 className="d-flex justify-content-center flex-grow-1">
                    <button onClick={modifyName} className='nav-link' title={myTitle} disabled={otherProfile} hidden={hideName}>
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
                <button type='button' data-bs-toggle='dropdown' className='btn btn-secondary ms-3' hidden={props.profile.id === props.myProfile.id || props.profile.id === 'none' || !isInMyFriendList}>Options</button>
                    <ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>
                        <li type='button' className='ps-2 dropdown-item nav-link' hidden={!props.profile.challengeable || props.profile.game !== props.game || props.profile.status !== 'online' || props.myProfile === 'none'}>Challenge</li>
                        <li onClick={directMessage} type='button' className='ps-2 dropdown-item nav-link' hidden={props.profile.status !== 'online' || props.myProfile === 'none'}>Direct message</li>
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
                    <div className="d-flex flex-column gap-3" style={{maxWidth: '800px', height: '100%'}}>
                        <div className="ps-3" style={{minHeight: '20%'}} hidden={hideCPDiv}>
                            <span className="me-3 mt-1 text-decoration-underline fs-4 fw-bold text-danger-emphasis">Catchphrase</span>
                            <button onClick={modifyCP} type="button" className="btn btn-secondary" hidden={otherProfile || hideCP}>Modify</button>
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
                        <div className="ps-3" style={{maxHeight: '80%'}} hidden={hideBioDiv}>
                            <span className="me-3 mt-1 text-decoration-underline fs-4 fw-bold text-danger-emphasis">Bio</span>
                            <button onClick={modifyBio} type="button" data-info='bio' className="btn btn-secondary" hidden={otherProfile || hideBio}>Modify</button>
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
    const [config, setConfig] = useState('none')
    const [configCopy, setConfigCopy] = useState('none')

    if (props.myProfile === 'none') {
        if (config !== 'none') {
            setConfig('none')
            setConfigCopy('none')
        }
        return <div id='Settings' className='d-none'></div>
    }
    else if (config === 'none') {
        let newConfig = {
            game: props.myProfile.game,
            device: props.myProfile.device,
            scope: props.myProfile.scope,
            challengeable: props.myProfile.challengeable,
            queue: props.myProfile.queue,
            spectate: props.myProfile.spectate
        }
        setConfig(newConfig)
        setConfigCopy(newConfig)
    }

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
			var ladderRequest = new XMLHttpRequest()
			ladderRequest.open("GET", "/data/ladder_".concat(config.game, ".json"))
        	ladderRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
        	ladderRequest.responseType = 'json'
        	ladderRequest.send()
        	ladderRequest.onload = () => { props.setLadder(ladderRequest.response) }
			var tournamentsRequest = new XMLHttpRequest()
			tournamentsRequest.open("GET", "/data/tournaments_".concat(config.game, ".json"))
        	tournamentsRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
        	tournamentsRequest.responseType = 'json'
        	tournamentsRequest.send()
        	tournamentsRequest.onload = () => { props.setTournaments(tournamentsRequest.response) }
			var profilesRequest = new XMLHttpRequest()
			profilesRequest.open("GET", "/data/profiles.json")
        	profilesRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
        	profilesRequest.responseType = 'json'
        	profilesRequest.send()
        	profilesRequest.onload = () => {
				props.setChallengers(props.myProfile[config.game].challengers.map((player) => profilesRequest.response[player]))
				props.setChallenged(props.myProfile[config.game].challenged.map((player) => profilesRequest.response[player]))
			}
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
        props.setGame(config.game)
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
		return <div id='Leaderboard' className='d-none'></div>

    return (
        <div id="Leaderboard" className="customWindow d-none">
            <p className="d-flex mb-0 justify-content-center text-danger-emphasis text-decoration-underline fw-bold fs-1" style={{minHeight: '10%'}}>
                Leaderboard
            </p>
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
            <div className="overflow-auto noScrollBar" style={{maxHeight: '70%'}}>
                <ul className="list-group">
                    <Ladder props={props} />
                </ul>props
            </div>
        </div>
    )
}

// export function Tournaments({props}) {

// 	const tabs = [
// 		<AllTournaments game={game} />,
// 		<MyTournaments myProfile={myProfile} game={game} />,
// 		<MySubscriptions myProfile={myProfile} game={game} />
// 	]

// 	return (
// 		<div id='Tournaments' className='customWindow d-none'>
// 			{tournamentId !== 0 ?
// 				<SpecificTournament tournamentId={tournamentId} setProfileId /> :
// 				<TournamentsTabs tabs={tabs} />	
// 			}
// 		</div>
// 	)
// }

export function Login({props}) {

    const [cookie, setCookie] = useState(false)
    const [logForm, setLogForm] = useState({
        logAddress: '',
        logPassword: ''
    })
    const [emptyLogin, setEmptyLogin] = useState(false)
    const [emptyPW, setEmptyPW] = useState(false)
    const [wrongForm, setWrongForm] = useState(true)

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
            // let myId = tryConnect(logForm)
            var myId = 1
            if (myId === -1)
                setWrongForm(false)
            else {
                setEmptyLogin(false)
                setEmptyPW(false)
                setWrongForm(true)
				if (cookie)
                	localStorage.setItem('ft_transcendenceId', myId)
                sessionStorage.setItem('myId', myId)
                var request = new XMLHttpRequest()
                request.open("GET", "/data/profiles.json")
                request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
                request.responseType = 'json'
                request.send()
                request.onload = () => { 
                    let profiles = request.response
					let profile = profiles[myId]
					props.setProfiles(profiles)
                    props.setMyProfile(profile)
                    props.setProfile(profile)
					props.setAvatarSm(profile.avatar)
					props.setChallengers(profile[props.game].challengers.map((player) => profiles[player]))
					props.setChallenged(profile[props.game].challenged.map((player) => profiles[player]))
					let on = []
	        		let off = []
	        		for (let friend of profile.friends) {
	        		    if (profiles[friend].status === 'online')
	        		        on.push(profiles[friend])
	        		    else
	        		        off.push(profiles[friend])
	        		}
	        		props.setFriends(on.concat(off))
					if (props.game !== profile.game) {
						var ladderRequest = new XMLHttpRequest()
						ladderRequest.open("GET", "/data/ladder_".concat(profile.game, ".json"))
        				ladderRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
        				ladderRequest.responseType = 'json'
        				ladderRequest.send()
        				ladderRequest.onload = () => { props.setLadder(ladderRequest.response) }
						var tournamentsRequest = new XMLHttpRequest()
						tournamentsRequest.open("GET", "/data/tournaments_".concat(profile.game, ".json"))
        				tournamentsRequest.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
        				tournamentsRequest.responseType = 'json'
        				tournamentsRequest.send()
        				tournamentsRequest.onload = () => { props.setTournaments(tournamentsRequest.response) }
						props.setGame(profile.game)
					}
                }
                displayNewWindow("Profile")
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
        setWrongForm(true)
    }

    const toggleCookie = (e) => { setCookie(e.target.checked) }

    return (
        <div id="Login" className="customWindow d-flex align-items-center justify-content-center d-none">
            <div className="w-50 p-2 border border-3 border-black rounded bg-secondary d-flex flex-column justify-content-between align-items-center overflow-auto">
                <p className="fs-4 fw-bold">Please login</p>
                <form action="" className="d-flex flex-column align-items-center">
                    <div className="mb-2">
                        <label htmlFor="logAddress" className="form-label">Username</label>
                        <input onChange={typing} name="logAddress" type="text" className={"form-control ".concat(emptyLogin ? 'border border-3 border-danger' : '')} id="logAddress" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="logPassword" className="form-label">Password</label>
                        <input onChange={typing} name="logPassword" type="password" className={"form-control ".concat(emptyPW ? 'border border-3 border-danger' : '')} id="logPassword" />
                    </div>
                    <div className="text-danger-emphasis mt-2" hidden={wrongForm}>Wrong address or password</div>
                    <button onClick={login} type="button" className="btn btn-info mb-2">Login</button>
                </form>
                <p className="fw-bold px-2 text-center">If you don't have an account, you may <button onClick={addClick} className="nav-link d-inline text-info text-decoration-underline" data-link='Subscribe'>subscribe here</button></p>
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
    const [wrongPW, setWrongPW] = useState(true)
    const [wrongAdd, setWrongAdd] = useState(true)
    const [existing, setExisting] = useState(true)
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
        if (newProfile.passwordConfirm === '') {
            setEmptyPasswordConfirm(true)
            issue = true
        }
        // if (newProfile.address != '' && addressAlreadyExists(newProfile.address)) {
        //     setExisting(false)
        //     issue = true
        // }
        // if (newProfile.address != '' && wrongAddressFormat(newProfile.address)) {
        //     setWrongAdd(false)
        //     issue = true
        // }
        if (newProfile.password !== '' && newProfile.passwordConfirm !== '' && newProfile.password !== newProfile.passwordConfirm) {
            setWrongPW(false)
            issue = true
        }
        return issue
    }

    const subscribe = () => {
        if (!checkIssues()) {
            setWrongPW(true)
            setWrongAdd(true)
            setExisting(true)
            setEmptyAddress(false)
            setEmptyPassword(false)
            setEmptyPasswordConfirm(false)
            props.setGame('pong')
            // let myProfile = addUserToDb(newProfile)
            // sessionStorage.setItem('myId', myProfile.id)
            // props.setProfile(myProfile)
            displayNewWindow("Profile")
        }
    }

    const typing = (e) => {
        let {name, value} = e.target
        setNewProfile({
            ...newProfile,
            [name]: value
        })
        setWrongPW(true)
        setWrongAdd(true)
        setExisting(true)
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
                    <div className="text-danger-emphasis mt-2" hidden={existing}>This address is already used</div>
                    <div className="text-danger-emphasis mt-2" hidden={wrongAdd}>Invalid address</div>
                    <label htmlFor="subName" className="form-label">Username:</label>
                    <input onChange={typing} name='name' type="text" className={"form-control ".concat(emptyName ? 'border border-3 border-danger' : '')} id="subName" />
                    <div className="text-danger-emphasis mt-2" hidden={existing}>This username is already used</div>
                </div>
                <div className="mb-4">
                    <label htmlFor="subPassword" className="form-label">Password:</label>
                    <input onChange={typing} type="password" name='password' className={"form-control ".concat(emptyPassword ? 'border border-3 border-danger' : '')} id="subPassword" />
                    <label htmlFor="subPasswordConfirm" className="form-label">Password confirmation:</label>
                    <input onChange={typing} type="password" name='passwordConfirm' className={"form-control ".concat(emptyPasswordConfirm ? 'border border-3 border-danger' : '')} id="subPasswordConfirm" />
                    <div className="text-danger-emphasis mt-2" hidden={wrongPW}>The passwords do not match</div>
                </div>
                <button onClick={subscribe} type="button" className="btn btn-info">Create account</button>
            </form>
        </div>
    </div>)
}

export default Home