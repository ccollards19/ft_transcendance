import React from 'react'
import { useState, useEffect } from "react"
import { FriendList, Local, Remote } from "./other.jsx"
import { SpecificTournament, AllTournaments } from "./Tournaments.jsx"

var request = new XMLHttpRequest()
request.responseType = 'json'

export function Home({props}) {

	const addClick = (e) => props.setPage(e.target.dataset.link)

    let log = props.myProfile

    return (
        <div style={props.customwindow}>
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

export function About({props}) {
    return (
        <div style={props.customwindow}>
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
	const [profile, setProfile] = useState(undefined)
    const [friends, setFriends] = useState(undefined)

	let id = props.profileId

	if (!profile) {
		// request.open('GET', "/api/user/)
		request.open('GET', '/data/sampleProfile.json')
		request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
		request.send(JSON.stringify({info : 'friends', id : id}))
		request.onload = () => {
			setProfile(request.response.profile)
			var on = []
			var off = []
			for (let item of request.response.friends) {
				if (item.status === 'online')
					on.push(item)
				else
					off.push(item)
			}
			setFriends(on.concat(off))
		}
	}

	useEffect(() => {
		const inter = setInterval(() => {
		// request.open('GET', "/api/user/)
		request.open('GET', '/data/sampleProfile.json')
		request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
		request.send(JSON.stringify({info : 'friends', id : id}))
		request.onload = () => {
			setProfile(request.response.profile)
			var on = []
			var off = []
			for (let item of request.response.friends) {
				if (item.status === 'online')
					on.push(item)
				else
					off.push(item)
			}
			setFriends(on.concat(off))
		}
	}, 5000) 
	return () => clearInterval(inter)})

    if (!profile)
        return undefined

	const modifyName = () => { 
        document.getElementById('changeName').value = profile.name
        setHideName(!hideName) 
    }
    const modifyCP = () => {
        document.getElementById('changeCP').value = profile.catchphrase
        setHideBioDiv(!hideBioDiv)
        setHideCP(!hideCP)
    }
    const modifyBio = () => {
        document.getElementById('changeBio').value = profile.bio
        setHideCPDiv(!hideCPDiv)
        setHideBio(!hideBio)
    }

	var isMyProfile = false
	var profileAvatar = 'otherAvatar'
    var profileName = 'otherName'
    var myTitle = ''
	var isInMyFriendList = props.myProfile && profile.id !== props.myProfile.id && props.myProfile.friends.includes(profile.id)

    if (props.myProfile && profile.id === props.myProfile.id) {
		isMyProfile = true
		profileAvatar = 'myAvatar'
    	profileName = 'myName'
    	myTitle = 'Modify Name'
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
		request.open('POST', "/api/user/")
		request.send()
		request.onload = () => {
			if (request.status === '404')
				window.alert("Couldn't reach DB")
			else {
				setProfile({
					...profile,
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
        !props.xlg && props.setDisplayChat(true)
        let prompt = document.getElementById('chatPrompt')
        prompt.value = '/w '.concat('"', profile.name, '" ')
        prompt.focus()
    }

	const removeFromFl = () => {
		props.setMyProfile({
			...props.myProfile,
			friends : props.myProfile.friends.filter(item => item !== props.profileId)
		})
	}

	const unMute = (e) => {
		props.setMyProfile({
			...props.myProfile,
			muted : props.myProfile.muted.filter(user => user !== props.profileId)
		})
	}

	const challenge = (e) => {
		let game = e.target.dataset.game
		props.setMyProfile({
			...props.myProfile,
			[game] : {...props.myProfile[game], challenged : [...props.myProfile[game].challenged, props.profileId]}
		})
	}

    let challengePong = profile.challengeable && profile.status === 'online' && props.myProfile && !props.myProfile['pong'].challenged.includes(profile.id)
    let challengeChess = profile.challengeable && profile.status === 'online' && props.myProfile && !props.myProfile['chess'].challenged.includes(profile.id)
	let unmute = props.myProfile && props.myProfile.muted.includes(props.profileId)
	let message = profile.status === 'online' && props.myProfile

    return (
        <div className="d-flex flex-column" style={props.customwindow}>
            <div className={`w-100 pt-1 px-1 d-flex gap-2 ${props.md ? 'justify-content-between' : 'flex-column align-items-center'}`}>
                <label id={profileAvatar} htmlFor='avatarUpload' className="rounded-circle d-flex justify-content-center align-items-center position-relative" style={{height: '125px',width: '125px'}}>
                    <img id='avatarLarge' src={profile ? '/images/'.concat(profile.avatar) : ''} alt="" className="rounded-circle" style={{height: '100%',width: '100%'}} />
                    <span id='modifyAvatarLabel' className="text-white fw-bold position-absolute">Modify avatar</span>
                    <input id='avatarUpload' type="file" accept='image/jpeg, image/png' disabled={!isMyProfile} style={{width: '10px'}} />
                </label>
                <h2 className={`d-flex justify-content-center`}>
                    <button onClick={modifyName} className='nav-link' title={myTitle} disabled={!isMyProfile} hidden={hideName}>
                        <span id={profileName} className="fs-1 fw-bold text-decoration-underline">{profile.name}</span>
                    </button>
                    <div style={{maxWidth: '300px'}} hidden={!hideName}>
                        <form className="d-flex flex-column align-self-center">
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
                    <img src={profile ? '/images/'.concat(profile[props.game].rank) : ''} alt="" className="rounded-circle" style={{height: '100%',width: '100%'}} />
                </div>
            </div>
            <div className="mw-100 flex-grow-1 d-flex flex-column p-2" style={{maxHeight: '75%'}}>
                {profile &&
                    <p className={`d-flex ${props.md ? 'justify-content-around' : 'flex-column align-items-center'} text-uppercase fs-5 fw-bold`}>
                        <span className="text-success">wins - {profile[props.game].wins}</span>
                        <span className="text-primary">Matches played - {profile[props.game].matches}</span>
                        <span className="text-danger">loses - {profile[props.game].loses}</span>
                    </p>}
                <div className="d-flex justify-content-center" style={{height: '40px'}}>
                    <button type='button' data-bs-toggle='dropdown' className='btn btn-secondary ms-3' hidden={(!challengePong && !challengeChess && !message && !isInMyFriendList && !unmute) || isMyProfile}>Options</button>
                    <ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>
						{unmute && <li onClick={unMute} type='button' className='ps-2 dropdown-item nav-link'>Unmute</li>}
                        {challengePong && <li onclick={challenge} data-game='pong' type='button' className='ps-2 dropdown-item nav-link'>Challenge to Pong</li>}
                        {challengeChess &&<li onclick={challenge} data-game='chess' type='button' className='ps-2 dropdown-item nav-link'>Challenge to Chess</li>}
                        {message && <li onClick={directMessage} type='button' className='ps-2 dropdown-item nav-link'>Direct message</li>}
                        {isInMyFriendList && <li onClick={removeFromFl} type='button' className='px-2 dropdown-item nav-link'>Remove from friendlist</li>}
                    </ul>
                </div>
                <p className={`fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2 ${!props.md && 'd-flex justify-content-center'}`}>Friend List</p>
                <div className={`d-flex ${!props.md && 'flex-column align-items-center'} mt-1`} style={{maxHeight: '80%'}}>
                    {profile &&
                        friends.length > 0 ?
                            <FriendList props={props} friends={friends} /> :
                            <div className="w-25 d-flex rounded border border-black d-flex align-items-center justify-content-center fw-bold" style={{minHeight: '300px', maxWidth : '280px'}}>
                                Nothing to display... Yet
                            </div>
                    }
                    <div className={`d-flex flex-column gap-3 ms-3 ${!props.md && 'mt-3 align-items-center'}`} style={{maxWidth: props.md ? 'calc(100% - 280px)' : '100%', height: '100%'}}>
                        <div className="ps-3" style={{minHeight: '20%'}} hidden={hideCPDiv}>
                            <p className={`d-flex gap-2 mt-1 ${!props.md && 'justify-content-center'}`}>
                                <span className='text-decoration-underline fs-4 fw-bold text-danger-emphasis'>Catchphrase</span>
                                <button onClick={modifyCP} type="button" className="btn btn-secondary" hidden={!isMyProfile || hideCP}>Modify</button>
                            </p>
                            <div className="w-100 m-0 fs-4" hidden={hideCP}>{profile.catchphrase}</div>
                            <div style={{maxWidth : '300px'}} hidden={!hideCP}>
                                <form className="d-flex flex-column" action='/modifyMyProfile.jsx'>
                                    <div className="form-text">Max 80 characters</div>
                                    <input id="changeCP" type="text" name="modifyCPForm" size="40" maxLength="80" />
                                    <span><button onClick={modifyMyProfile} name='catchphrase' type="button" data-id="" className="btn btn-success my-1">Save changes</button></span>
                                    <span><button onClick={modifyCP} type="button" className="btn btn-danger mb-3">Cancel changes</button></span>
                                </form>
                            </div>
                        </div>
                        <div className="ps-3" style={{maxHeight: '60%'}} hidden={hideBioDiv}>
                            <p className={`d-flex gap-2 mt-1 ${!props.md && 'justify-content-center'}`}>
                                <span className='text-decoration-underline fs-4 fw-bold text-danger-emphasis'>Bio</span>
                                <button onClick={modifyBio} type="button" data-info='bio' className="btn btn-secondary" hidden={!isMyProfile || hideBio}>Modify</button>
                            </p>
                            <div className="mt-1 flex-grow-1 fs-5 overflow-auto" style={{maxHeight: '100%'}} hidden={hideBio}>{profile.bio}</div>
                            <div style={{maxWidth : '300px'}} hidden={!hideBio}>
                                <form className="d-flex flex-column" action='/modifyMyProfile.jsx'>
                                    <textarea id="changeBio" name="modifyBioForm" cols="50" rows="5"></textarea>
                                    <span><button onClick={modifyMyProfile} name='bio' type="button" className="btn btn-success my-1">Save changes</button></span>
                                    <span><button onClick={modifyBio} type="button" data-info='bio' className="btn btn-danger mb-3">Cancel changes</button></span>
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

    function checkChanges(newConfig) { setChanges(!configChanged(newConfig)) }

    const validateChanges = () => {
        // saveChangesInDb(config)
        setChanges(true)
		if (props.game !== config.game) 
            props.setGame(config.game)
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
        <div className="d-flex flex-column align-items-center" style={props.customwindow}>
            <form className={`${props.md ? 'w-50' : 'w-100'} p-2 border border-3 border-black rounded bg-secondary d-flex flex-grow-1 flex-column justify-content-center align-items-center text-dark`}>
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
                <div className="w-100 pt-4 d-flex justify-content-center gap-2">
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
                </div>
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
            </form>
        </div>
    )
}

export function Play({props}) {

	return (
		<div style={props.customwindow}>
			{props.myProfile && props.myProfile.scope === 'remote' ?
				<Remote props={props} /> :
				<Local props={props} />
			}
		</div>
	)
}

export function Leaderboard({props}) {

	const [ladder, setLadder] = useState(undefined)

	if (!ladder) {
		request.open('GET', '/data/sampleLadder.json')
		request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
		request.send()
		request.onload = () => setLadder(request.response)
	}

	useEffect(() => {
		const inter = setInterval(() => {
		// request.open('GET', "/api/user/)
		request.open('GET', '/data/sampleLadder.json')
		request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
		request.send()
		request.onload = () => setLadder(request.response)
	}, 5000) 
	return () => clearInterval(inter)})

	const seeProfile = (e) => {
		props.setProfileId(parseInt(e.target.dataset.id, 10))
        props.setPage("Profile")
	}

    const changeGame = (e) => {
        props.myProfile && props.setMyProfile({
            ...props.myProfile,
            game : e.target.dataset.game
        })
		props.setGame(e.target.dataset.game)
	}

	let style = {width: '5%'}
	if (!props.xxlg && props.xlg)
		style.width = '10%'
	if (!props.md)
		style.width = '15%'

	let rank = 1

    return (
        <div style={props.customwindow}>
            <div className="d-flex mb-0 justify-content-center align-items-center fw-bold fs-2" style={{minHeight: '10%'}}>
                Leaderboard (<button type='button' className='nav-link text-primary text-capitalize' data-bs-toggle='dropdown'>{props.game}</button>)
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
                <li id="leaderhead" className="list-group-item w-100 d-flex p-1 pt-2 gap-3 pe-4">
                    <span className="d-flex justify-content-center" style={{width: props.xxxlg ? '5%' : '10%'}}><i>#</i></span>
                    <span style={{width: props.xxxlg ? '5%' : '10%'}}>Avatar</span>
                    <span style={{width: props.xxxlg ? '50%' : ' 60%'}}>{props.sm ? 'Name' : ''}</span>
                    {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">Matches</span>}
                    {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">Wins</span>}
                    {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">Loses</span>}
                    <span style={{width: '10%'}} className="d-flex justify-content-center">Level</span>
                </li>
            </ul>
            <div className="overflow-auto noScrollBar d-flex" style={{maxHeight: '70%'}}>
                <ul className="w-100 list-group" style={{maxHeight: '100%'}}>
				{ladder &&
                    ladder[props.game].map((profile) => 
				    	<li className={`list-group-item w-100 d-flex align-items-center p-1 gap-3 pe-4 ${rank % 2 === 0 && 'bg-light'}`} style={{minHeight: '50px'}} key={profile.id}>
        		    	    <span style={{width: props.xxxlg ? '5%' : '10%'}} className="d-flex justify-content-center">{rank++}</span>
        		    	    <span style={{width: props.xxxlg ? '5%' : '10%'}} className="h-100">
        		    	        <img onClick={(seeProfile)} src={'/images/'.concat(profile.avatar)} className="profileLink rounded-circle" data-id={profile.id} alt="" title='See profile' style={{height: '45px', width: '45px'}} />
        		    	    </span>
        		    	    <span style={{width: props.xxxlg ? '50%' : '60%'}}>{props.sm ? profile.name : ''}</span> 
        		    	    {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">{profile.matches}</span>}
        		    	    {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">{profile.wins}</span>}
        		    	    {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">{profile.loses}</span>}
        		    	    <span style={{width: '10%'}} className="d-flex justify-content-center">{profile.level}</span>
        		    	</li>)}
                </ul>
            </div>
        </div>
    )
}

export function Tournaments({props}) {

	return (
		<div style={props.customwindow}>
			{props.tournamentId !== 0 ?
				<SpecificTournament props={props} /> :
                <AllTournaments props={props} />
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
                props.setTournamentId(request.response.id)
                props.setPage('Tournament')
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

    const applyChanges = (e) => {
        const {name, value} = e.target
        setNewTournament({
            ...newTournament,
            [name]: value
        })
    }

    const applyChangesCheckBox = (e) => {
        const {name, checked} = e.target
        setNewTournament({
            ...newTournament,
            [name]: checked
        })
    }

	return (
		<div className={`d-flex flex-column align-items-center`} style={props.customwindow}>
			<form className={`${props.md ? 'w-50' : 'w-100'} p-2 border border-3 border-black rounded bg-secondary d-flex flex-grow-1 flex-column justify-content-center align-items-center text-dark`}>
                <h2 className="text-center pt-2 fs-3 fw-bold">Creation of a brand new tournament</h2>
                <label htmlFor="tournGame" className="form-label ps-2 pt-3">What game will the contenders play ?</label>
                <select onChange={applyChanges} name="game" id="tournGame" className="form-select w-50" defaultValue={newTournament.game}>
                    <option id='tournPong' value="pong">Pong</option>
                    <option id='tournChess' value="chess">Chess</option>
                </select>
				<div className="d-flex flex-column align-items-center pt-3">
                    <label htmlFor="tournamentName" className="form-label">Title of the tournament</label>
                    <input onChange={applyChanges} type="text" id="tournamentName" name="title" className="form-control" />
					<p hidden={!existingName}>A tournament with this title already exists</p>
                </div>
				<div className='d-flex flex-column align-items-center mt-1'>
					<label htmlFor="tournamentPic" className='form-label'>Choose a picture for the tournament</label>
					<input id='tournamentPic' type="file" accept='image/jpeg, image/png' />
					<label htmlFor="tournamentPic">Upload</label>
				</div>
				<div className='d-flex flex-column align-items-center mt-2'>
					<label htmlFor="tournamentBG" className="form-label">You may add a background image for the tournament</label>
					<input id='tournamentBG' type="file" accept='image/jpeg, image/png' style={{width: '100px'}} />
                    <label htmlFor="tournamentBG">Upload</label>
				</div>
				<div className="d-flex flex-column align-items-center pt-4">
                    <label htmlFor="maxContenders" className="form-label">Max number of contenders</label>
                    <select onChange={applyChanges} name="maxContenders" id="maxContenders" className="form-select w-50">
                        <option value="4">4</option>
                        <option value="8">8</option>
                        <option value="12">12</option>
                        <option value="16">16</option>
                        <option value="20">20</option>
                        <option value="24">24</option>
                        <option value="28">28</option>
                        <option value="32">32</option>
                    </select>
                </div>
                <div className="d-flex flex-column align-items-center pt-3">
                    <label htmlFor="timeout" className="form-label">Timeout</label>
                    <input onChange={applyChanges} type="text" id="timeout" name="timeout" className="form-control" defaultValue={newTournament.timeout} />
					<span className="form-text">Time before a victory by forfeit (in hours)</span>
                    <span className="form-text">0 for no limit</span>
                </div>
				<div className="w-50 pt-4 d-flex justify-content-center">
                    <div className="form-check">
                      <input onChange={applyChangesCheckBox} className="form-check-input" type="checkbox" name="selfContender" id="selfContender" />
                      <label className="form-check-label" htmlFor="selfContender">Will you be a contender yourself ?</label>
                    </div>
                </div>
                <div className="w-100 pt-4 d-flex justify-content-center gap-2">
                    <div className="w-50 form-check form-check-reverse d-flex justify-content-end">
                        <label className="form-check-label pe-2" htmlFor="public">Public
                            <input onChange={applyChanges} className="form-check-input" type="radio" name="scope" value='public' id="public" checked={newTournament.scope === 'public'} />
                        </label>
                    </div>
                    <div className="w-50 form-check d-flex justify-content-start">
                        <label className="form-check-label ps-2" htmlFor="private">Private
                            <input onChange={applyChanges} className="form-check-input" type="radio" name="scope" value='private' id="private" checked={newTournament.scope === 'private'} />
                        </label>
                    </div>
                </div>
                <button onClick={createTournament} type="button" className="btn btn-primary mt-3">Create tournament</button>
            </form>
		</div>
	)

}

export function Login({props}) {

    const [cookie, setCookie] = useState(false)
    const [logForm, setLogForm] = useState({
        name: '',
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
			request.open('GET', "/authenticate/sign_in/")
			request.responseType = 'json'
			request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0', "Content-Type", "application/json;charset=UTF-8")
			console.log(JSON.stringify(logForm))
			request.send(JSON.stringify(logForm))
			request.onload = () => {
				console.log(request.response)
				var response = request.response
				if ('details' in response)
					setWrongForm(true)
				else {
					if (cookie) {
						localStorage.setItem('ft_transcendenceLogin', logForm.login)
						localStorage.setItem('ft_transcendencePassword', logForm.password)
					}
					props.setMyProfile(response.profile)
					props.setAvatarSm(response.profile.avatar)
					props.setProfile(response.profile)
					props.setProfileId(response.profile.id)
					if (response.profile.game !== props.game)
						props.setGame(response.profile.game)
                    props.setPage('Profile')
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

	const toSubscribe = () => props.setPage('Subscribe')

    const toggleCookie = (e) => setCookie(e.target.checked) 

    return (
        <div className="d-flex flex-column align-items-center" style={props.customwindow}>
            <div className={`${props.md ? 'w-50' : 'w-100'} p-2 border border-3 border-black rounded bg-secondary d-flex flex-grow-1 flex-column justify-content-center align-items-center`}>
                <p className="fs-4 fw-bold">Please login</p>
                <form action="" className="d-flex flex-column align-items-center">
                    <div className="mb-2">
                        <label htmlFor="logAddress" className="form-label">E-mail or username</label>
                        <input onChange={typing} name="name" type="text" className={"form-control ".concat(emptyLogin && 'border border-3 border-danger')} id="logAddress" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="logPassword" className="form-label">Password</label>
                        <input onChange={typing} name="password" type="password" className={"form-control ".concat(emptyPW && 'border border-3 border-danger')} id="logPassword" />
                    </div>
                    <div className="text-danger-emphasis my-2" hidden={!wrongForm}>Wrong address or password</div>
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
			request.open('POST', "/authenticate/sign_up/")
			request.responseType = 'json'
			request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0', "Content-Type", "application/json;charset=UTF-8")
			request.send(JSON.stringify(newProfile))
			request.onload = () => {
				console.log(request.response)
				if ('detail' in request.response) {
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
                    props.setPage('Profile')
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
    <div className="d-flex flex-column align-items-center" style={props.customwindow}>
        <div className={`${props.md ? 'w-50' : 'w-100'} p-2 border border-3 border-black rounded bg-secondary d-flex flex-grow-1 flex-column justify-content-center align-items-center`}>
            <p className="fs-4 fw-bold px-3 text-center">Welcome to ft_transcendence !</p>
            <form action="" className="d-flex flex-column align-items-center">
                <div className="mb-2">
                    <label htmlFor="subAddress" className="form-label">E-mail Address:</label>
                    <input onChange={typing} name='address' type="email" className={"form-control ".concat(emptyAddress && 'border border-3 border-danger')} id="subAddress" />
                    <div className="text-danger-emphasis mt-2" hidden={!existingAddr}>This address is already used</div>
                    <div className="text-danger-emphasis mt-2" hidden={!wrongAdd}>Invalid address</div>
                    <label htmlFor="subName" className="form-label">Username:</label>
                    <input onChange={typing} name='name' type="text" className={"form-control ".concat(emptyName && 'border border-3 border-danger')} id="subName" />
                    <div className="text-danger-emphasis mt-2" hidden={!existingName}>This username is already used</div>
                </div>
                <div className="mb-4">
                    <label htmlFor="subPassword" className="form-label">Password:</label>
                    <input onChange={typing} type="password" name='password' className={"form-control ".concat(emptyPassword && 'border border-3 border-danger')} id="subPassword" />
                    <label htmlFor="subPasswordConfirm" className="form-label">Password confirmation:</label>
                    <input onChange={typing} type="password" name='passwordConfirm' className={"form-control ".concat(emptyPasswordConfirm && 'border border-3 border-danger')} id="subPasswordConfirm" />
                    <div className="text-danger-emphasis mt-2" hidden={!wrongPW}>The passwords do not match</div>
                </div>
                <button onClick={subscribe} type="button" className="btn btn-info">Create account</button>
            </form>
        </div>
    </div>)
}

export default Home