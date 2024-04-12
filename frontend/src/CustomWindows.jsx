import { useState, useEffect } from "react"
import { Friend, Local, Remote, Champion } from "./other.jsx"
import { SpecificTournament, AllTournaments } from "./Tournaments.jsx"
import { OverlayTrigger, Popover }  from 'react-bootstrap'
import { useParams, Link, useNavigate } from "react-router-dom"
import { Pong, Chess } from "./games.jsx"

export function Home({props}) {

	if (props.socket.page !== 'home' && props.socket.readyState === 1) {
		props.socket.send(JSON.stringify({component : 'home'}))
		props.socket.page = 'home'
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)	
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
		}
	}

    return (
        <div style={props.customwindow}>
            <h1 className="text-center pt-2">Welcome !!!</h1>
            <hr className="mx-5" />
            <h3 className="text-center mb-3">Fancy a game of pong ?</h3>
            <h4 className="text-center">How to use :</h4>
            <p className="text-center mb-2">
                First, you need to <Link to='/login' className={'nav-link d-inline '.concat(props.myProfile ? 'text-danger' : 'text-primary')} disabled={props.myProfile}>login</Link> if you already have an account.
            </p>
            <p className="text-center mb-2">
                You may also use your 42 login if you have one
            </p>
            <div className="d-flex justify-content-center">
                <button className="nav-link" title="Click to get to the 42 login page" disabled={props.myProfile}>
                    <img src="/images/42_logo.png" alt="" className="px-3 border border-black" />
                </button>
            </div>
            <p className="px-5 mt-2 text-center">
                or <Link to='/subscribe' className={'nav-link d-inline '.concat(props.myProfile ? 'text-danger' : 'text-primary')} disabled={props.myProfile}>create a new account</Link>.
            </p>
			<p className="px-5 mt-2 text-center">
				(You may also visit the website, and even play locally, without an account.)
			</p>
            <p className="text-center">
                Once you're in, take all your sweet time to complete your profile.
            </p>
            <p className="text-center">
                That's also where you will find a list of the users you added as friends.
            </p>
            <p className="text-center">
                Then, take a look at the 'Settings' page and adjust things to your liking.
            </p>
            <p className="text-center">
                The game you choose to play today affects everything game-related everywhere on the website.
            </p>
            <p className="text-center">
                That includes the background, the profiles display, the leaderboard, the tournaments list and whatever is displayed on the 'Play' page if you chose to play remotely.
            </p>
            <p className="text-center">
                You will find a chat, on the left or behind a button on the bottom right, depending on the width of your screen. You need to be connected to use it.
            </p>
            <p className="text-center">
                You may use it to speak with everyone who's connected to the website via the default 'General' channel. 
            </p>
            <p className="text-center">
                A unique channel is created for each game, for the exclusive use of contenders and potential viewers (if you allowed them in the settings).
            </p>
			<p className="text-center">
				Each tournament has its own chat too.
			</p>
            <p className="text-center">
                You may also click on any nickname (except yours) to display a small menu filled with self-explanatory options
            </p>
            <p className="text-center">
                On the 'Leaderboard' page, you will find the top [up to] 50 players, ranked by the ELO system, for the game you chose to display.
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

	if (props.socket.page !== 'about' && props.socket.readyState === 1) {
		props.socket.send(JSON.stringify({component : 'about'}))
		props.socket.page = 'about'
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
		}
	}

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
                <li className="mb-2"><i>Bootstrap and React were used to make the frontend</i></li>
                <li className="mb-2"><i>Django was used to make the backend</i></li>
                <li className="mb-2"><i>The game is handled by the server (API)</i></li>
                <li className="mb-2"><i>The website is linked to a database, so we don't lose anything when we shut it down (except for the chat, which is session dependant)</i></li>
                <li className="mb-2"><i>Another game is available (Chess)</i></li>
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
			<hr className="mx-5" />
			<h3 className="mx-5 text-center mb-4">
                F.A.Q.
            </h3>
			<p className="mx-5 text-center">
				What's the difference between muted and blocked users ?
			</p>
			<p className="mx-5 text-center">
				<strong>
					Mute will only prevent a specific user's messages to be displayed in your chat. It is session dependant, meaning if you logout / login or reload the page, all muted users will be displayed again.
					<br/>
					Blocking a user also shuts him down in the chat but not only. He will leave your friendlist if he was in it and won't be allowed to send you another friend request or challenge you. And he will stay blocked over a logout / login or reaload on your part.
				</strong>
			</p>
			<p className="mx-5 text-center">
				Why can't I challenge some of my friends ?
			</p>
			<p className="mx-5 text-center">
				<strong>
					They probably unchecked the 'Challengeable' option in their settings, meaning they are here to chat or watch games but not to play themselves.
				</strong>
			</p>
			<p className="mx-5 text-center">
				Why can't I watch some of my friend's matches ?
			</p>
			<p className="mx-5 text-center">
				<strong>
					At least one of the two contenders unchecked the 'Allow spectators ?' option, making the match private. However, they can agree upon having some special guests and send you an invitation link.
				</strong>
			</p>
			<p className="mx-5 text-center">
				Sometimes, I get a blank page. Why?
			</p>
			<p className="mx-5 text-center">
				<strong>
					That means the server has encountered a problem and you are not connected. That means you cannot access any page other than the home page and this one. Please try again later
				</strong>
			</p>
        </div>
    )
}

export function Profile({props}) {

    const [profile, setProfile] = useState(undefined)
	const [friends, setFriends] = useState(undefined)

	const id = parseInt(useParams().id, 10)

	useEffect (() => {
		if ((props.socket.page !== 'profile' || props.socket.id !== id) && props.socket.readyState === 1) {
			props.socket.send(JSON.stringify({component : 'profile', id : id}))
			props.socket.page = 'profile'
			props.socket.id = id
			setFriends(undefined)
		}
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
			else if (data.action === 'addFriend')
				setFriends([...friends, {id : data.item.id, item : data.item}])
			else if (data.action === 'removeFriend')
				setFriends(friends.filter(friend => friend.id !== data.id))
			else if (data.action === 'updateFriend')
				setFriends(friends.map(friend => {
					if (friend.id === data.id)
						return {...friend, item : data.item}
					else
						return friend
				}))
			else if (data.action === 'profile')
				setProfile(data.item)
		}
	}, [props.socket, id, friends, profile])

	if (isNaN(id))
		props.setHack(true)

	if (!profile)
		return <div className="d-flex justify-content-center align-items-center" style={props.customwindow}><img src="/images/loading.gif" alt="" /></div>

	const modifyName = () => { 
        document.getElementById('changeName').value = profile.name
        document.getElementById('name').hidden = !document.getElementById('name').hidden
        document.getElementById('nameForm').hidden = !document.getElementById('nameForm').hidden
		document.getElementById('tooltip').hidden = !document.getElementById('tooltip').hidden
    }
    const modifyCP = () => {
        document.getElementById('changeCP').value = profile.catchphrase
        document.getElementById('bioDiv').hidden = !document.getElementById('bioDiv').hidden
        document.getElementById('CP').hidden = !document.getElementById('CP').hidden
        document.getElementById('CPForm').hidden = !document.getElementById('CPForm').hidden
    }
    const modifyBio = () => {
        document.getElementById('changeBio').value = profile.bio
        document.getElementById('CPDiv').hidden = !document.getElementById('CPDiv').hidden
        document.getElementById('bio').hidden = !document.getElementById('bio').hidden
        document.getElementById('bioForm').hidden = !document.getElementById('bioForm').hidden
    }

	const modifyMyProfile = (e) => {
        let form = document.getElementById(e.target.name)
		var info = {
            name : form.name,
            value : form.value
        }
		var request = new XMLHttpRequest()
		request.open('POST', "/api/user/" + profile.id + '/', true, props.creds.name, props.creds.password)
		request.send(JSON.stringify(info))
		request.onload = () => {
			if (request.status === 404)
				window.alert("Couldn't reach DB")
		}
        form.name === 'bio' && modifyBio()
        form.name === 'catchphrase' && modifyCP()
        form.name === 'name' && modifyName()
	}

    const directMessage = () => {
        if (!props.xlg && document.getElementById('chat2').hidden)
			document.getElementById('chat2').hidden = false
        let prompt = document.getElementById('chatPrompt')
        prompt.value = '/w '.concat('"', profile.name, '" ')
        prompt.focus()
    }

	const addToFl = (e) => {
		props.setMyProfile({
			...props.myProfile,
			friends : [...props.myProfile.friends, id]
		})
	}

	const removeFromFl = () => {
		props.setMyProfile({
			...props.myProfile,
			friends : props.myProfile.friends.filter(item => item !== id)
		})
	}

	const unMute = () => props.setMuted(props.muted.filter(user => user !== profile.id))

	const challenge = (e) => {
		let game = e.target.dataset.game
		props.setMyProfile({
			...props.myProfile,
			[game] : {...props.myProfile[game], challenged : [...props.myProfile[game].challenged, id]}
		})
	}

	function buildMenu() {
		let profileMenuIndex = 1
        let menu = []
		if (!props.myProfile.friends.includes(id))
			menu.push(<li key={profileMenuIndex++} onClick={addToFl} type='button' className='px-2 dropdown-item nav-link'>Add to friendlist</li>)
		else
			menu.push(<li key={profileMenuIndex++} onClick={removeFromFl} type='button' className='px-2 dropdown-item nav-link'>Remove from friendlist</li>)
        if (props.muted.includes(id))
		    menu.push(<li key={profileMenuIndex++} onClick={unMute} type='button' className='ps-2 dropdown-item nav-link'>Unmute</li>)
		if (profile.status === 'online') {
            if (!props.muted.includes(id))
                menu.push(<li key={profileMenuIndex++} onClick={directMessage} data-name={profile.name} type='button' className='ps-2 dropdown-item nav-link'>Direct message</li>)
		    if (!props.myProfile['pong'].challenged.includes(id) && !props.myProfile['pong'].challengers.includes(id) && profile.challengeable)
                menu.push(<li key={profileMenuIndex++} onClick={challenge} data-game='pong' type='button' className='ps-2 dropdown-item nav-link'>Challenge to Pong</li>)
		    if (!props.myProfile['chess'].challenged.includes(id) && !props.myProfile['chess'].challengers.includes(id) && profile.challengeable)
                menu.push(<li key={profileMenuIndex++} onClick={challenge} data-game='chess' type='button' className='ps-2 dropdown-item nav-link'>Challenge to Chess</li>)
        }
        return menu
	}

    let index = 1

    return (
        <div className="d-flex flex-column" style={props.customwindow}>
            <div className={`w-100 pt-1 px-1 d-flex gap-2 ${props.md ? 'justify-content-between' : 'flex-column align-items-center'}`}>
                <label id={props.myProfile && profile.id === props.myProfile.id ? 'myAvatar' : undefined} htmlFor='avatarUpload' className="rounded-circle d-flex justify-content-center align-items-center position-relative" style={{height: '125px',width: '125px'}}>
                    <img id='avatarLarge' src={profile ? '/images/'.concat(profile.avatar) : ''} alt="" className="rounded-circle" style={{height: '100%',width: '100%'}} />
                    <span id='modifyAvatarLabel' className="text-white fw-bold position-absolute">Modify avatar</span>
                    <input id='avatarUpload' type="file" accept='image/jpeg, image/png' disabled={!props.myProfile || profile.id !== props.myProfile.id} style={{width: '10px'}} />
                </label>
                <h2 className={`d-flex justify-content-center align-items-center`}>
                    <button id='name' onClick={modifyName} className='nav-link' title={props.myProfile && profile.id === props.myProfile.id ? 'Modify name' : undefined} disabled={!props.myProfile || profile.id !== props.myProfile.id}>
                        <span className={`fs-1 fw-bold text-decoration-underline ${props.myProfile && profile.id === props.myProfile.id ? 'myProfile' : ''}`}>{profile.name}</span>
                    </button>
					{props.myProfile && profile.id === props.myProfile.id && 
						<OverlayTrigger trigger='click' overlay={<Popover className="p-2"><strong>Since it is your profile, you may click on your avatar, your name, or the catchphrase and bio titles to modify them.</strong></Popover>}>
							<button type='button' className="nav-link d-inline">
								<img id='tooltip' src='/images/question-lg.svg' className="ms-2 border border-black border-2 rounded-circle" alt='' style={{width : '20px', height : '20px'}} />
							</button>
						</OverlayTrigger>}
                    <div id='nameForm' style={{maxWidth: '300px'}} hidden>
                        <form className="d-flex flex-column align-self-center">
                            <div className="form-text fs-5">Max 20 characters</div>
                            <input id="changeName" type="text" name="name" className="fs-3" size="40" maxLength="20" />
                            <div className="d-flex flex-row gap-2">
                                <button type="button" onClick={modifyMyProfile} name='changeName' className="btn btn-success my-1">Save changes</button>
                                <button type="button" onClick={modifyName} className="btn btn-danger my-1">Cancel changes</button>
                            </div>
                        </form>
                    </div>
                </h2>
                <div className="border-start border-bottom border-black p-3 rounded-circle" style={{width: '125px',height: '125px'}}>
                    <img src={profile ? '/images/'.concat(profile[props.settings.game].rank) : ''} alt="" className="rounded-circle" style={{height: '100%',width: '100%'}} />
                </div>
            </div>
            <div className="mw-100 flex-grow-1 d-flex flex-column p-2" style={{maxHeight: '75%'}}>
                <p className={`d-flex ${props.md ? 'justify-content-around' : 'flex-column align-items-center'} text-uppercase fs-5 fw-bold`}>
                    <span className="text-success">wins - {profile[props.settings.game].wins}</span>
                    <span className="text-primary">Matches played - {profile[props.settings.game].matches}</span>
                    <span className="text-danger">loses - {profile[props.settings.game].loses}</span>
                </p>
				<div className="d-flex justify-content-center p-0" style={{minHeight: '40px'}}>
                    {props.myProfile && id !== props.myProfile.id && 
                        <>
                            <button type='button' data-bs-toggle='dropdown' className='btn btn-secondary ms-3'>Options</button>
                            <ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>{buildMenu()}</ul>
                        </>
                    }
                </div>
                <p className={`fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2 ${!props.md && 'd-flex justify-content-center'}`}>Friend List</p>
                <div className={`d-flex ${!props.md && 'flex-column align-items-center'} mt-1`} style={{maxHeight: '75%'}}>
                    {friends && friends.length === 0 ?
                        <div className="w-25 d-flex rounded border border-black d-flex align-items-center justify-content-center fw-bold" style={{minHeight: '300px', maxWidth : '280px'}}>
                            Nothing to display... Yet
                        </div> :
						<ul className="d-flex rounded w-100 list-group overflow-auto noScrollBar" style={{minHeight: '300px', maxWidth: '280px'}}>
						{friends && friends.map(friend => {
							if (friend.item.status === 'online')
								return <Friend key={index++} props={props} profile={friend.item} id={id} />
							else
								return undefined
						}).concat(
							friends.map(friend => {
								if (friend.item.status === 'offline')
									return <Friend key={index++} props={props} profile={friend.item} id={id} />
								else
									return undefined
							}
						))}</ul>}
                    <div className={`d-flex flex-column gap-3 ms-3 ${!props.md && 'mt-3 align-items-center'}`} style={{maxWidth: props.md ? 'calc(100% - 280px)' : '100%', height: '100%'}}>
                        <div id='CPDiv' className="ps-3" style={{minHeight: '20%'}}>
                            <p className={`d-flex gap-2 mt-1 ${!props.md && 'justify-content-center'}`}>
                                <button onClick={modifyCP} title={props.myProfile && profile.id === props.myProfile.id ? 'Modify catchphrase' : undefined} className={`nav-link text-decoration-underline fs-4 fw-bold ${props.myProfile && profile.id === props.myProfile.id ? 'myProfile' : ''}`} disabled={!props.myProfile || profile.id !== props.myProfile.id}>Catchphrase</button>
                            </p>
                            <div id='CP' className="w-100 m-0 fs-4">{profile.catchphrase}</div>
                            <div id='CPForm' style={{maxWidth : '300px'}} hidden>
                                <form className="d-flex flex-column" action='/modifyMyProfile.jsx'>
                                    <div className="form-text">Max 80 characters</div>
                                    <input id="changeCP" type="text" name="catchphrase" size="40" maxLength="80" />
                                    <span><button onClick={modifyMyProfile} name='changeCP' type="button" className="btn btn-success my-1">Save changes</button></span>
                                    <span><button onClick={modifyCP} type="button" className="btn btn-danger mb-3">Cancel changes</button></span>
                                </form>
                            </div>
                        </div>
                        <div id='bioDiv' className="ps-3" style={{maxHeight: '60%'}}>
                            <p className={`d-flex gap-2 mt-1 ${!props.md && 'justify-content-center'}`}>
                                <button onClick={modifyCP} title={props.myProfile && profile.id === props.myProfile.id ? 'Modify bio' : undefined} className={`nav-link text-decoration-underline fs-4 fw-bold ${props.myProfile && profile.id === props.myProfile.id ? 'myProfile' : ''}`} disabled={!props.myProfile || profile.id !== props.myProfile.id}>Bio</button>
                            </p>
                            <div id='bio' className="mt-1 flex-grow-1 fs-5 overflow-auto" style={{maxHeight: '100%'}}>{profile.bio}</div>
                            <div id='bioForm' style={{maxWidth : '300px'}} hidden>
                                <form className="d-flex flex-column" action='/modifyMyProfile.jsx'>
                                    <textarea id="changeBio" name="bio" cols="50" rows="5"></textarea>
                                    <span><button onClick={modifyMyProfile} name='changeBio' type="button" className="btn btn-success my-1">Save changes</button></span>
                                    <span><button onClick={modifyBio} type="button" className="btn btn-danger mb-3">Cancel changes</button></span>
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

	const navigate = useNavigate()

	useEffect(() => {
		if (!props.myProfile)
			navigate('/')
	})

	if (props.socket.page !== 'settings' && props.socket.readyState === 1) {
		props.socket.page = 'settings'
		props.socket.send(JSON.stringify({component : 'settings'}))
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
		}
	}

    const validateChanges = () => {
		props.setSettings({
			game : document.getElementById('game').value,
			device : document.getElementById('device').value,
			scope : document.getElementById('remote').checked ? 'remote' : 'local',
			challengeable : document.getElementById('challengeable').checked,
			queue : parseInt(document.getElementById('queue').value, 10),
			spectate : document.getElementById('spectate').checked
		})
    }

    return (
        <div className="d-flex flex-column align-items-center" style={props.customwindow}>
            <form className={`${props.md ? 'w-50' : 'w-100'} p-2 border border-3 border-black rounded bg-secondary d-flex flex-grow-1 flex-column justify-content-center align-items-center text-dark`}>
                <h2 className="text-center pt-2 fs-3 fw-bold">Settings</h2>
                <label htmlFor="game" className="form-label ps-2 pt-3">What game do you wish to play today ?</label>
                <select name="game" id="game" className="form-select w-50" defaultValue={props.settings.game}>
                    <option id='pong' value="pong">Pong</option>
                    <option id='chess' value="chess">Chess</option>
                </select>
                <span className="form-text">This will affect the display on some parts of the website</span>
                <label htmlFor="device" className="form-label ps-2 pt-3">What device will you use ?</label>
                <select name="device" id="device" className="form-select w-50" defaultValue={props.settings.device}>
                    <option value="keyboard">Keyboard</option>
                    <option value="mouse">Mouse</option>
                    <option value="touch">Touch-screen</option>
                </select>
                <div className="w-100 pt-4 d-flex justify-content-center gap-2">
                    <div className="w-50 form-check form-check-reverse d-flex justify-content-end">
                        <label className="form-check-label pe-2" htmlFor="remote">Remote
                            <input className="form-check-input" type="radio" name="scope" value='remote' id="remote" defaultChecked={props.settings.scope === 'remote'} />
                        </label>
                    </div>
                    <div className="w-50 form-check d-flex justify-content-start">
                        <label className="form-check-label ps-2" htmlFor="local">Local
                            <input className="form-check-input" type="radio" name="scope" value='local' id="local" defaultChecked={props.settings.scope === 'local'} />
                        </label>
                    </div>
                </div>
                <div className="w-25 pt-4 d-flex justify-content-center">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" name="challengeable" id="challengeable" defaultChecked={props.settings.challengeable} />
                      <label className="form-check-label" htmlFor="challengeable">Challengeable</label>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-center pt-4">
                    <div><label htmlFor="queueLength" className="form-label">Queue length</label></div>
                    <div><input type="text" id="queue" name="queue" className="form-control" defaultValue={props.settings.queue} /></div>
                    <div><span className="form-text">0 for no limit</span></div>
                </div>
                <div className="form-check py-3">
                    <input className="form-check-input" type="checkbox" name="spectate" id="spectate" defaultChecked={props.settings.spectate} />
                    <label className="form-check-label" htmlFor="spectator">Allow spectators</label>
                </div>
                <button id='validate' onClick={validateChanges} type="button" className="btn btn-primary">Save changes</button>
            </form>
        </div>
    )
}

export function Play({props}) {

    return (
		<div style={props.customwindow}>
			{props.myProfile && props.settings.scope === 'remote' ?
				<Remote props={props} /> :
				<Local props={props} />
			}
		</div>
	)
}

export function Leaderboard({props}) {

	const [champions, setChampions] = useState(undefined)

	var game = props.settings.game

	useEffect (() => {
		if ((props.socket.page !== 'leaderboard' || props.socket.game !== game) && props.socket.readyState === 1) {
			props.socket.send(JSON.stringify({component : 'leaderboard', game : game}))
			props.socket.page = 'leaderboard'
			props.socket.game = game
			setChampions(undefined)
		}
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
			else if (data.action === 'swap') {
				let tmp = Array.from(champions)
				let champ1 = tmp.find(champion => champion.id === data.id1)
				let champ2 = tmp.find(champion => champion.id === data.id2)
				tmp.splice(tmp.findIndex(champion => champion.id === data.id1), 1, champ2)
				tmp.splice(tmp.findIndex(champion => champion.id === data.id2), 1, champ1)
				setChampions(tmp)
			}
			else if (data.action === 'addChampion') {
				let tmp = Array.from(champions)
				tmp = tmp.filter(champion => champion.id !== data.id)
				tmp.push({id : data.new.id, item : data.new})
				setChampions(tmp)
			}
			else if (data.action === 'modifyChampion')
				setChampions(champions.map(champion => {
					if (champion.id === data.id)
						return {...champion, item : data.item}
					else
						return champion
				}))
			}
	}, [props.socket, champions, game])

	if (!champions)
		return <div className="d-flex justify-content-center align-items-center" style={props.customwindow}><img src="/images/loading.gif" alt="" /></div>

    const changeGame = e => props.setSettings({...props.settings, game : e.target.dataset.game})

	let rank = 1
	let index = 1

    return (
        <div style={props.customwindow}>
            <div className="d-flex mb-0 justify-content-center align-items-center fw-bold fs-2" style={{minHeight: '10%'}}>
                Leaderboard (<button type='button' className='nav-link text-primary text-capitalize' data-bs-toggle='dropdown'>{props.settings.game}</button>)
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
                    <span className={props.sm ? '' : 'ps-2'} style={{width: props.xxxlg ? '50%' : ' 60%'}}>Name</span>
                    {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">Matches</span>}
                    {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">Wins</span>}
                    {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">Loses</span>}
                    <span style={{width: '10%'}} className="d-flex justify-content-center">Level</span>
                </li>
            </ul>
            <div className="overflow-auto noScrollBar d-flex" style={{maxHeight: '70%'}}>
				<ul className="list-group mt-2 w-100">
					{champions && champions.map(champion => { return <Champion key={index++} props={props} profile={champion.item} rank={rank++} />})}
				</ul>
            </div>
        </div>
    )
}

export function Tournaments({props}) {

	const [tournaments, setTournaments] = useState(undefined)
	const id = parseInt(useParams().id, 10)

	useEffect (() => {
		if (id === 0 && props.socket.game !== props.settings.game && props.socket.readyState === 1) {
			props.socket.send(JSON.stringify({component : 'tournaments', game : props.settings.game}))
			props.socket.page = 'tournaments'
			props.socket.game = props.settings.game
		}
		if (id === 0) {
			props.socket.onmessage = e => {
				let data = JSON.parse(e.data)
				if (data.action === 'myProfile')
					props.socket.onMyProfile(data)
				else if (data.action === 'chat')
					props.socket.onChat(data)
				else if (data.action === 'addTournament')
					setTournaments([...tournaments, {id : data.id, item : data.item}])
				else if (data.action === 'modifyTournament')
					setTournaments(tournaments.map(tournament => {
						if (tournament.id === data.id)
							return {...tournament, item : data.item}
						else
							return tournament
					}))
				}
		}
	}, [props.socket, tournaments, id, props.settings])

	if (isNaN(id))
		props.setHack(true)

	if (id === 0 && !tournaments)
		return <div className="d-flex justify-content-center align-items-center" style={props.customwindow}><img src="/images/loading.gif" alt="" /></div>

	// useEffect(() => {
	// 	if (id === 0 && !source)
	// 		setSource(new EventSource('/aapi/tournaments/' + game + '/'))
	// 	else if (id === 0) {
	// 		source.onmessage = e => {
	// 			if (e.data.action === 'addTournament')
	// 				setTournaments([...tournaments, {id : e.data.id, item : e.data.item}])
	// 			else if (e.data.action === 'modifyTournament')
	// 				setTournaments(tournaments.map(tournament => {
	// 					if (tournament.id === e.data.id)
	// 						return {id : tournament.id, item : e.data.item}
	// 					else
	// 						return tournament
	// 				}))
	// 		}
	// 	}
	// }, [id, source, tournaments, game])

	// if (id === 0 && !tournaments) {
    //     let xhr = new XMLHttpRequest()
    //     xhr.open('GET', '/aapi/tournaments/' + props.settings.game + '.json')
    //     xhr.onreadystatechange = () => {
    //         if (xhr.readyState === 3)
	// 			setTournaments(JSON.parse(xhr.response).map(item => { return {id : item.id, item : item} }))
    //     }
    //     xhr.send()
	// 	return <div style={props.customwindow}></div>
	// }

	if (id > 0 && tournaments)
		setTournaments(undefined)

	return (
		<div style={props.customwindow}>
			{id > 0 ?
				<SpecificTournament props={props} id={id} /> :
                <AllTournaments props={props} list={tournaments} />
			}
		</div>
	)
}

export function NewTournament({props}) {

	const navigate = useNavigate()

	useEffect(() => {
		if (!props.myProfile)
			navigate('/')
	})

	if (props.socket.page !== 'newTournament' && props.socket.readyState === 1) {
		props.socket.send(JSON.stringify({component : 'NewTournament'}))
		props.socket.page = 'newTournament'
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
		}
	}

	const createTournament = () => {
		let newTournament = {
			game : document.getElementById('game').value,
			organizerId : props.myProfile.id,
			organizerName : props.myProfile.name,
			picture : '',
			title : document.getElementById('title').value,
			background : '',
			maxContenders : document.getElementById('maxContenders').value,
			timeout : document.getElementById('timeout').value,
			scope : '',
			selfContender : document.getElementById('selfContender').value
		}
		let xhr = new XMLHttpRequest()
		xhr.open('POST', '/api/newTournament/')
		xhr.onload = () => {
			if (xhr.response.detail && xhr.response.detail === 'Name already in use')
				document.getElementById('existingName').hidden = false
			else
				document.getElementById('tournaments').trigger('click')
		}
		xhr.send(newTournament)
	}

	return (
		<div className={`d-flex flex-column align-items-center`} style={props.customwindow}>
			<form className={`${props.md ? 'w-50' : 'w-100'} p-2 border border-3 border-black rounded bg-secondary d-flex flex-grow-1 flex-column justify-content-center align-items-center text-dark`}>
                <h2 className="text-center pt-2 fs-3 fw-bold">Creation of a brand new tournament</h2>
                <label htmlFor="game" className="form-label ps-2 pt-3">What game will the contenders play ?</label>
                <select name="game" id="game" className="form-select w-50" defaultValue='tournPong'>
                    <option id='tournPong' value="pong">Pong</option>
                    <option id='tournChess' value="chess">Chess</option>
                </select>
				<div className="d-flex flex-column align-items-center pt-3">
                    <label htmlFor="title" className="form-label">Title of the tournament</label>
                    <input type="text" id="title" name="title" className="form-control" />
					<p id='existingName' hidden>A tournament with this title already exists</p>
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
                    <select name="maxContenders" id="maxContenders" className="form-select w-50">
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
                    <input type="text" id="timeout" name="timeout" className="form-control" defaultValue={0} />
					<span className="form-text">Time before a victory by forfeit (in hours)</span>
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
                            <input className="form-check-input" type="radio" name="scope" value='public' id="public" checked />
                        </label>
                    </div>
                    <div className="w-50 form-check d-flex justify-content-start">
                        <label className="form-check-label ps-2" htmlFor="private">Private
                            <input className="form-check-input" type="radio" name="scope" value='private' id="private" />
                        </label>
                    </div>
                </div>
                <button onClick={createTournament} type="button" className="btn btn-primary mt-3">Create tournament</button>
            </form>
		</div>
	)

}

export function Match({props}) {

	const [match, setMatch] = useState(useParams().match)
	const navigate = useNavigate()

	useEffect(() => {
		if (!props.myProfile)
			navigate('/')
		else if (props.myProfile && props.myProfile.match > 0)
			navigate('/game/' + props.myProfile.match)
	})

	const host = useParams().match === 'new'
	const opponent = {id : parseInt(useParams().id, 10), name : useParams().name, avatar : useParams().avatar}
	const game = useParams().game

	if (match === 'new') {
		let xhr = new XMLHttpRequest()
		xhr.open('POST', '/game/room/create/')
		xhr.onload = () => setMatch(xhr.response)
		xhr.send({game : game, player1 : props.myProfile.id, player2 : opponent.id})
	}

	useEffect(() => {
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
			else if (data.player1 && data.player2) {
				let xhr = new XMLHttpRequest()
				xhr.open('POST', '/api/user/' + props.myProfile.id + '/')
				xhr.onload = () => navigate('/game/' + game + '/' + match)
				xhr.send()
			}
		}
	}, [props.socket, props.myProfile, match, navigate, game])

	const setReady = e => props.socket.send(JSON.stringify({match : match, player : (host ? 1 : 2), ready : e.target.checked}))

	const cancelGame = () => {
		props.socket.send(JSON.stringify({match : match, action : 'cancel'}))
		navigate('/play')
	}

	return (
		<div style={props.customwindow}>
			<div className='d-flex justify-content-center align-items-center w-100' style={{height : '90%'}}>
				<div className={`d-flex flex-grow-1 align-items-center justify-content-between`} style={{height: '80%'}}>
        		    <div className={`border border-black border-3 rounded d-flex justify-content-center align-items-center`} style={{height: props.xxlg ? '100%' : '60%', width: '50%', transform: props.xxlg ? 'rotate(0deg)' : 'rotate(90deg)'}}>
						<div className="d-flex flex-column align-items-center">
							<img src={'/images/'.concat(host ? props.myProfile.avatar : opponent.avatar)} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{host ? props.myProfile.name : opponent.name}</span>
							<span className="d-flex gap-2 mt-3 fw-bold" style={{height : '35px'}}>
								{host &&
									<>
										<input onClick={setReady} className="form-check-input" type="checkbox" name="player1" id="player1" />
										<label className="form-check-label" htmlFor="ready1">Ready ?</label>
									</>
								}
							</span>
						</div>
					</div>
        		    <img src="/images/versus.png" className="mx-3" alt="" style={{height: '150px',width: '100px'}} />
        		    <div className={`border border-black border-3 rounded d-flex justify-content-center align-items-center`} style={{height: props.xxlg ? '100%' : '60%', width: '50%', transform: props.xxlg ? 'rotate(0deg)' : 'rotate(-90deg)'}}>
						<div className="d-flex flex-column align-items-center">
							<img src={'/images/'.concat(!host ? props.myProfile.avatar : opponent.avatar)} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{!host ? props.myProfile.name : opponent.name}</span>
							<span className="d-flex gap-2 mt-3 fw-bold" style={{height : '35px'}}>
								{!host &&
									<>
										<input onClick={setReady} className="form-check-input" type="checkbox" name="player2" id="player2" />
										<label className="form-check-label" htmlFor="ready1">Ready ?</label>
									</>
								}
							</span>
						</div>
					</div>
        		</div>
			</div>
			<div className="mt-3 d-flex gap-2 justify-content-center">
                <button onClick={cancelGame} type="button" className="btn btn-danger">Cancel match</button>
            </div>
		</div>
	)

}

export function Game({props}) {

	const match = parseInt(useParams().match, 10)
	const game = useParams().game

	if (isNaN(match))
		props.setHack(true)

	return (
		<div className='w-100 h-100'>
			{game === 'pong' ?
				<Pong props={props} match={match} /> :
				<Chess props={props} match={match} />
			}
		</div>
	)
}

export function Login({props}) {

	const navigate = useNavigate()

	useEffect(() => {
		if (!props.myProfile)
			navigate('/')
		if (props.socket.page !== 'login' && props.socket.readyState === 1) {
			props.socket.send(JSON.stringify({component : 'login'}))
			props.socket.page = 'login'
		}
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
		}
	})

    const checkForms = () => {
		let issue = true
		let forms = ['nameInput', 'PWInput']
		for (let form of forms) {
			let input = document.getElementById(form)
			if (input.value === '') {
				input.setAttribute('class', 'form-control border border-3 border-danger')
				issue = false
			}
		}
		return issue
    }

    const login = () => {
        if (checkForms()) {
			let xhr = new XMLHttpRequest()
			xhr.logForm = {
				name : document.getElementById('nameInput').value,
				password : document.getElementById('PWInput').value
			}
			xhr.open('GET', "/authenticate/sign_in/", true, xhr.logForm.name, xhr.logForm.password)
			xhr.onload = () => {
				let response = JSON.parse(xhr.response)
				if ('details' in response && response.details === 'Wrong')
					document.getElementById('wrongForm').hidden = false
				else {
					if (document.getElementById('cookie').checked) {
						localStorage.setItem('ft_transcendenceLogin', xhr.logForm.login)
						localStorage.setItem('ft_transcendencePassword', xhr.logForm.password)
					}
					props.setMyProfile(response)
				}
			}
			xhr.send()
        }
    }

    const typing = e => {
		document.getElementById(e.target.id).setAttribute('class', 'form-control')
        document.getElementById('wrongForm').hidden = true
		if (e.keyCode === 13)
			login()
    }

    return (
        <div className="d-flex flex-column align-items-center" style={props.customwindow}>
            <div className={`${props.md ? 'w-50' : 'w-100'} p-2 border border-3 border-black rounded bg-secondary d-flex flex-grow-1 flex-column justify-content-center align-items-center`}>
                <p className="fs-4 fw-bold">Please login</p>
                <form action="" className="d-flex flex-column align-items-center">
                    <div className="mb-2">
                        <label htmlFor="nameInput" className="form-label">E-mail or username</label>
                        <input id='nameInput' onKeyDown={typing} name="name" type="text" className='form-control' />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="PWInput" className="form-label">Password</label>
                        <input id='PWInput' onKeyDown={typing} name="password" type="password" className="form-control" />
                    </div>
                    <div id='wrongForm' className="text-danger-emphasis my-2" hidden>Wrong address or password</div>
                    <button onClick={login} type="button" className="btn btn-info mb-2">Login</button>
                </form>
                <p className="fw-bold px-2 text-center">If you don't have an account, you may <button onClick={() => navigate('/subscribe')} className="nav-link d-inline text-info text-decoration-underline" data-link='Subscribe'>subscribe here</button></p>
                <p className="fw-bold">You may also use your 42 account</p>
                <button className="nav-link"><img src="/images/42_logo.png" alt="" className="border border-black px-3" /></button>
                <div className="form-check mt-3">
                  <input className="form-check-input" type="checkbox" name="cookie" id="cookie" defaultChecked={false} />
                  <label className="form-check-label" htmlFor="cookie">Remember me</label>
                </div>
            </div>
        </div>
    )
}

export function Subscribe({props}) {

	const navigate = useNavigate()

	useEffect(() => {
		if (!props.myProfile)
			navigate('/')
		if (props.socket.page !== 'subscribe' && props.socket.readyState === 1) {
			props.socket.send(JSON.stringify({component : 'subscribe'}))
			props.socket.page = 'subscribe'
		}
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
		}
	})

    const checkForms = () => {
		let issue = true
		let forms = ['subAddress', 'subName', 'subPassword', 'subPasswordConfirm']
		for (let form of forms) {
			let input = document.getElementById(form)
			if (input.value === '') {
				input.setAttribute('class', 'form-control border border-3 border-danger')
				issue = false
			}
		}
		return issue
    }

	const checkPW = () => {
		if (document.getElementById('subPassword').value !== document.getElementById('subPasswordConfirm').value) {
			document.getElementById('noMatch').hidden = false
			return false
		}
		return true
	}

    const subscribe = () => {
        if (checkForms() && checkPW()) {
			let newProfile = {
				address : document.getElementById('subAddress').value,
				name : document.getElementById('subName').value,
				password : document.getElementById('subPassword').value,
				passwordConfirm : document.getElementById('subPasswordConfirm').value
			}
			let xhr = new XMLHttpRequest()
			xhr.open('POST', "/authenticate/sign_up/")
			xhr.onload = () => {
				let response = JSON.parse(xhr.response)
				if ('details' in response) {
					if (response.details === 'Address alreddy exists')
						document.getElementById('existingAddr').hidden = false
					else if (response.details === 'Wrong Address')
						document.getElementById('wrongAddr').hidden = false
					else if (response.details === 'Username already exists')
						document.getElementById('existingName').hidden = false
				}
				else
					props.setMyProfile(response)
			}
			xhr.send(JSON.stringify(newProfile))
        }
    }

    const typing = (e) => {
		document.getElementById(e.target.id).setAttribute('class', 'form-control')
		document.getElementById('existingAddr').hidden = false
		document.getElementById('wrongAddr').hidden = false
		document.getElementById('existingName').hidden = false
		if (e.keyCode === 13)
			subscribe()
    }

    return (
    <div className="d-flex flex-column align-items-center" style={props.customwindow}>
        <div className={`${props.md ? 'w-50' : 'w-100'} p-2 border border-3 border-black rounded bg-secondary d-flex flex-grow-1 flex-column justify-content-center align-items-center`}>
            <p className="fs-4 fw-bold px-3 text-center">Welcome to ft_transcendence !</p>
            <form action="" className="d-flex flex-column align-items-center">
                <div className="mb-2">
                    <label htmlFor="subAddress" className="form-label">E-mail Address:</label>
                    <input onKeyDown={typing} name='address' type="email" className='form-control' id="subAddress" />
                    <div id='existingAddr' className="text-danger-emphasis mt-2" hidden>This address is already used</div>
                    <div id='wrongAddr' className="text-danger-emphasis mt-2" hidden>Invalid address</div>
                    <label htmlFor="subName" className="form-label">Username:</label>
                    <input onKeyDown={typing} name='name' type="text" className='form-control' id="subName" />
                    <div id='existingName' className="text-danger-emphasis mt-2" hidden>This username is already used</div>
                </div>
                <div className="mb-4">
                    <label htmlFor="subPassword" className="form-label">Password:</label>
                    <input onKeyDown={typing} type="password" name='password' className='form-control' id="subPassword" />
                    <label htmlFor="subPasswordConfirm" className="form-label">Password confirmation:</label>
                    <input onKeyDown={typing} type="password" name='passwordConfirm' className='form-control' id="subPasswordConfirm" />
                    <div id='noMatch' className="text-danger-emphasis mt-2" hidden>The passwords do not match</div>
                </div>
                <button onClick={subscribe} type="button" className="btn btn-info">Create account</button>
            </form>
        </div>
    </div>)
}

export function NoPage({props}) {

	useEffect(() => {
		if (props.socket.page !== 'noPage' && props.socket.readyState === 1) {
			props.socket.send(JSON.stringify({component : 'noPage'}))
			props.socket.page = 'noPage'
		}
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
		}
	})

	return (
		<div className="d-flex justify-content-center align-items-center fw-bold fs-1" style={props.customwindow}>This page does not exist. Please check url and try again</div>
	)

}

export default Home