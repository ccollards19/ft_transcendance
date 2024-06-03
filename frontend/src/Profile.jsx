import { useState, useEffect } from "react"
import { OverlayTrigger, Popover }  from 'react-bootstrap'
import { Link, useParams } from "react-router-dom"
import { History } from "./Tournaments.jsx"
import * as Social from "./Social.js"

export default function Profile({props}) {

    const [profile, setProfile] = useState(undefined)
	const [display, setDisplay] = useState('friends')

	let id = useParams().id
	let idInt = parseInt(id, 10)

	useEffect (() => {
		if (id !== 'none' && !isNaN(idInt) && (!profile || profile.id !== idInt)) {
			fetch('/profiles/' + id + '/' + props.settings.game + '/').then(response => {
				if (response.status === 404)
					setProfile('none')
				else
					response.json().then(profile => setProfile(profile))
			})
		}
		const interval = setInterval(() => {
			if (id !== 'none' && !isNaN(idInt) && profile !== 'none')
				fetch('/profiles/' + id + '/' + props.settings.game + '/').then(response => {
					if (response.status === 404)
						setProfile('none')
					else
						response.json().then(profile => setProfile(profile))
			})
		}, 3000)
		return () => clearInterval(interval)
	}, [props.socket, props.socket.onmessage, id, idInt, profile, display, props.settings.game])

	if (id === 'none' || profile === 'none') {
		return <div className="d-flex justify-content-center align-items-center fw-bold fs-1" style={props.customwindow}>{props.language.noProfile}</div>
	}

	if (isNaN(idInt))
		props.setHack(true)

	if (!profile)
		return <div className="d-flex justify-content-center align-items-center noScrollBar" style={props.customwindow}><img src="/images/loading.gif" alt="" /></div>

	const modifyName = () => { 
        document.getElementById('name').value = profile.name
        document.getElementById('nameDisplay').hidden = !document.getElementById('nameDisplay').hidden
        document.getElementById('nameForm').hidden = !document.getElementById('nameForm').hidden
		document.getElementById('tooltip').hidden = !document.getElementById('tooltip').hidden
    }
    const modifyCP = () => {
        document.getElementById('catchphrase').value = profile.catchphrase
        document.getElementById('bioDiv').hidden = !document.getElementById('bioDiv').hidden
        document.getElementById('CPDisplay').hidden = !document.getElementById('CPDisplay').hidden
        document.getElementById('CPForm').hidden = !document.getElementById('CPForm').hidden
    }
    const modifyBio = () => {
        document.getElementById('bio').value = profile.bio
        document.getElementById('CPDiv').hidden = !document.getElementById('CPDiv').hidden
        document.getElementById('bioDisplay').hidden = !document.getElementById('bioDisplay').hidden
        document.getElementById('bioForm').hidden = !document.getElementById('bioForm').hidden
    }

	const modifyMyProfile = e => {
		let key = e.target.name
		let value = document.getElementById(key).value
		fetch('/profiles/modify/', {
			method : 'POST',
			body : JSON.stringify({key : key, value : value})
		}).then(() => {
      			key === 'name' && modifyName()
      			key === 'catchphrase' && modifyCP()
      			key === 'bio' && modifyBio()
				setProfile({...profile, [key] : value})
			})
  	}

	const modifyAvatar = () => {
		if (window.confirm(props.language.delete1)) {
			const avatar = new FormData()
			avatar.set("avatar", document.getElementById('avatarUpload').files[0])
			fetch('/profiles/updateAvatar/', {
				method : 'POST', 
				body : avatar
			}).then(response => {
				if (response.status === 200) {
					response.json().then(data => {
						props.setMyProfile({...props.myProfile, avatar : data})
						setProfile({...profile, avatar : data})
					})
				}
			})
		}
	}

	const captureKey = e => {
		if (e.keyCode === 13) {
			e.preventDefault()
			modifyMyProfile(e)
		}
	}

	function buildMenu() {
		let profileMenuIndex = 1
        let menu = []
		if (!props.myProfile.blocked.includes(profile.id))
			menu.push(<li key={profileMenuIndex++} onClick={() => Social.block(profile.id, props.socket, props.myProfile, props.setMyProfile, undefined, undefined, props.language.delete1)} type='button' className='px-2 dropdown-item nav-link'>{props.language.block}</li>)
		else
			menu.push(<li key={profileMenuIndex++} onClick={() => Social.unblock(profile.id, props.myProfile, props.setMyProfile)} type='button' className='px-2 dropdown-item nav-link'>{props.language.unblock}</li>)
		if (!props.myProfile.friends.includes(profile.id))
			menu.push(<li key={profileMenuIndex++} onClick={() => Social.addFriend(profile.id, props.socket)} type='button' className='px-2 dropdown-item nav-link'>{props.language.addFriend}</li>)
		else
			menu.push(<li key={profileMenuIndex++} onClick={() => Social.unfriend(profile.id, props.socket, props.myProfile, props.setMyProfile, props.language.delete1)} type='button' className='px-2 dropdown-item nav-link'>{props.language.removeFriend}</li>)
        if (props.muted.includes(profile.id))
		    menu.push(<li key={profileMenuIndex++} onClick={() => props.setMuted(props.muted.filter(user => user !== profile.id))} type='button' className='ps-2 dropdown-item nav-link'>{props.language.unMute}</li>)
		else
			menu.push(<li key={profileMenuIndex++} onClick={() => props.setMuted([...props.muted, profile.id])} type='button' className='ps-2 dropdown-item nav-link'>{props.language.mute}</li>)
		if (profile.status === 'online') {
            if (!props.muted.includes(profile.id))
                menu.push(<li key={profileMenuIndex++} onClick={() => Social.directMessage(props.xlg, profile.name)} type='button' className='ps-2 dropdown-item nav-link'>{props.language.dm}</li>)
		    if (!props.myProfile.pongChallengers.includes(profile.id) && profile.challengeable)
                menu.push(<li key={profileMenuIndex++} onClick={() => Social.challenge(profile.id, 'pong', props.myProfile, props.setMyProfile, props.socket)} type='button' className='ps-2 dropdown-item nav-link'>{props.language.challengePong}</li>)
		    if (!props.myProfile.chessChallengers.includes(profile.id) && profile.challengeable)
                menu.push(<li key={profileMenuIndex++} onClick={() => Social.challenge(profile.id, 'chess', props.myProfile, props.setMyProfile, props.socket)} type='button' className='ps-2 dropdown-item nav-link'>{props.language.challengeChess}</li>)
			if (profile.room > 0)
				menu.push(<Link to={'/game/' + profile.game + '/' + profile.room + '/'} key={profileMenuIndex++} type='button' className='ps-2 dropdown-item nav-link'>{props.language.watchGame}</Link>)

        }
        return menu
	}

    let index = 1

    return (
        <div className="d-flex flex-column noScrollBar" style={props.customwindow}>
            <div className={`w-100 pt-1 px-1 d-flex gap-2 ${props.md ? 'justify-content-between' : 'flex-column align-items-center'}`}>
                <label id={props.myProfile && profile.id === props.myProfile.id ? 'myAvatar' : undefined} htmlFor='avatarUpload' className={`rounded-circle d-flex justify-content-center align-items-center position-relative`} style={{height: '125px',width: '125px'}}>
                    <img id='avatarLarge' src={profile.avatar} alt="" className="rounded-circle" style={{height: '100%',width: '100%'}} />
                    <span id='modifyAvatarLabel' className="text-white fw-bold position-absolute">{props.language.modifyAvatar}</span>
                    <input onChange={modifyAvatar} id='avatarUpload' type="file" accept='image/*' disabled={!props.myProfile || profile.id !== props.myProfile.id} style={{width: '10px'}} />
                </label>
                <h2 className={`d-flex justify-content-center align-items-center`}>
                    <button id='nameDisplay' onClick={modifyName} className='nav-link' title={props.myProfile && profile.id === props.myProfile.id ? 'Modify name' : undefined} disabled={!props.myProfile || profile.id !== props.myProfile.id}>
                        <span className={`fs-1 fw-bold text-decoration-underline ${props.myProfile && profile.id === props.myProfile.id ? 'myProfile' : ''}`}>{profile.name}</span>
                    </button>
					{(!props.myProfile || props.myProfile.id !== profile.id) && <span className={`pt-4 ps-2 fs-6 text-capitalize fw-bold ${profile.status === 'online' ? 'text-success' : 'text-danger'}`}>({profile.status === 'online' ? props.language.online : props.language.offline})</span>}
					{props.myProfile && profile.id === props.myProfile.id &&
						<OverlayTrigger trigger='click' overlay={<Popover className="p-2"><strong>{props.language.myProfile}</strong></Popover>}>
							<button type='button' className="nav-link d-inline">
								<img id='tooltip' src='/images/question-lg.svg' className="ms-2 border border-black border-2 rounded-circle" alt='' style={{width : '20px', height : '20px'}} />
							</button>
						</OverlayTrigger>}
                    <div id='nameForm' style={{maxWidth: '300px'}} hidden>
                        <form className="d-flex flex-column align-self-center">
                            <div className="form-text fs-5">{props.language.maxChar}</div>
                            <input onKeyDown={captureKey} id='name' type="text" name="name" className="fs-3" size="40" maxLength="20" />
                            <div className="d-flex flex-row gap-2">
                                <button type="button" onClick={modifyMyProfile} name='name' className="btn btn-success my-1">{props.language.saveChange}</button>
                                <button type="button" onClick={modifyName} className="btn btn-danger my-1">{props.language.cancelChange}</button>
                            </div>
                        </form>
                    </div>
                </h2>
                <div className="border-start border-bottom border-black p-3 rounded-circle" style={{width: '125px',height: '125px'}}>
                    <img src={'/images/pirate-symbol-mark-svgrepo-com.svg'} alt="" className="rounded-circle" style={{height: '100%',width: '100%'}} />
                </div>
            </div>
            <div className="mw-100 flex-grow-1 d-flex flex-column p-2" style={{maxHeight: '75%'}}>
                <p className={`d-flex ${props.md ? 'justify-content-around' : 'flex-column align-items-center'} text-uppercase fs-5 fw-bold`}>
                    <span className="text-success">{props.language.wins} - {profile.gameStat.wins}</span>
                    <span className="text-primary">Matches - {profile.gameStat.matches}</span>
                    <span className="text-danger">{props.language.losses} - {profile.gameStat.losses}</span>
                </p>
				<div className="d-flex justify-content-center p-0" style={{minHeight: '40px'}}>
                    {props.myProfile && profile.id !== props.myProfile.id && 
                        <>
                            <button type='button' data-bs-toggle='dropdown' className='btn btn-secondary ms-3'>Options</button>
                            <ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>{buildMenu()}</ul>
                        </>
                    }
                </div>
                <p className={`fs-4 fw-bold text-danger-emphasis ms-1 ${!props.md && 'd-flex justify-content-center'}`}>
					<button onClick={() => setDisplay('friends')} type='button' className={`nav-link d-inline me-3 ${display === 'friends' && 'text-decoration-underline'}`}>{props.language.friendlist}</button>
					<button onClick={() => setDisplay('history')} type='button' className={`nav-link d-inline ${display === 'history' && 'text-decoration-underline'}`}>{props.language.lastMatches} ({profile.matches.length})</button>
				</p>
                <div className={`d-flex ${!props.md && 'flex-column align-items-center'} mt-1`} style={{maxHeight: '75%'}}>
					{display === 'friends' ?
                    	profile.friends.length === 0 && profile.friend_requests.length === 0 ?
                    	    <div className="w-25 d-flex rounded border border-black d-flex align-items-center justify-content-center fw-bold px-1" style={{minHeight: '300px', minWidth : '280px', maxWidth : '280px'}}>
                    	        {props.language.noFriend}
                    	    </div> :
							<ul className={`d-flex rounded w-100 list-group overflow-auto noScrollBar ${!props.xlg && 'border border-black'}`} style={{minHeight: '300px', minWidth : '280px', maxWidth: '280px'}}>
								{profile.friend_requests.map(request => <Request key={index++} props={props} request={request} profile={profile} setProfile={setProfile} />)}
								{profile.friends.filter(friend => friend.status === 'online').map(friend => <Friend key={index++} props={props} friend={friend} profile={profile} setProfile={setProfile} />)}
								{profile.friends.filter(friend => friend.status === 'offline').map(friend => <Friend key={index++} props={props} friend={friend} profile={profile} setProfile={setProfile} />)}
							</ul> :
						profile.matches.length === 0 ?
							<div className="w-25 d-flex rounded border border-black d-flex align-items-center justify-content-center fw-bold" style={{minHeight: '300px', minWidth : '280px', maxWidth : '280px'}}>
								{props.language.noMatch}
							</div> :
							<ul className={`d-flex rounded w-100 list-group overflow-auto noScrollBar ${!props.xlg && 'border border-black'}`} style={{minHeight: '300px', minWidth : '280px', maxWidth: '280px'}}>
								{profile.matches.map(match => <History key={index++} props={props} match={match} />)}
							</ul>
					}
                    <div className={`d-flex flex-column gap-3 ms-3 ${!props.md && 'mt-3 align-items-center'}`} style={{maxWidth: props.md ? 'calc(100% - 280px)' : '100%', height: '100%'}}>
                        <div id='CPDiv' className="ps-3" style={{minHeight: '20%'}}>
                            <p className={`d-flex gap-2 mt-1 ${!props.md && 'justify-content-center'}`}>
                                <button onClick={modifyCP} title={props.myProfile && profile.id === props.myProfile.id ? 'Modify catchphrase' : undefined} className={`nav-link text-decoration-underline fs-4 fw-bold ${props.myProfile && profile.id === props.myProfile.id ? 'myProfile' : ''}`} disabled={!props.myProfile || profile.id !== props.myProfile.id}>{props.language.catchphrase}</button>
                            </p>
                            <div id='CPDisplay' className="w-100 m-0 fs-4">{profile.catchphrase}</div>
                            <div id='CPForm' style={{maxWidth : '300px'}} hidden>
                                <form className="d-flex flex-column" action='/modifyMyProfile.jsx'>
                                    <div className="form-text">Max 80 characters</div>
                                    <input onKeyDown={captureKey} id="catchphrase" type="text" name="catchphrase" size="40" maxLength="80" />
                                    <span><button onClick={modifyMyProfile} name='catchphrase' type="button" className="btn btn-success my-1">{props.language.saveChange}</button></span>
                                    <span><button onClick={modifyCP} type="button" className="btn btn-danger mb-3">{props.language.cancelChange}</button></span>
                                </form>
                            </div>
                        </div>
                        <div id='bioDiv' className="ps-3" style={{maxHeight: '60%'}}>
                            <p className={`d-flex gap-2 mt-1 ${!props.md && 'justify-content-center'}`}>
                                <button onClick={modifyBio} title={props.myProfile && profile.id === props.myProfile.id ? 'Modify bio' : undefined} className={`nav-link text-decoration-underline fs-4 fw-bold ${props.myProfile && profile.id === props.myProfile.id ? 'myProfile' : ''}`} disabled={!props.myProfile || profile.id !== props.myProfile.id}>Bio</button>
                            </p>
                            <div id="bioDisplay" className="mt-1 flex-grow-1 fs-5 overflow-auto" style={{maxHeight: '100%'}}>{profile.bio}</div>
                            <div id='bioForm' style={{maxWidth : '300px'}} hidden>
                                <form className="d-flex flex-column" action='/modifyMyProfile.jsx'>
                                    <textarea onKeyDown={captureKey} id="bio" name="bio" cols="50" rows="5"></textarea>
                                    <span><button onClick={modifyMyProfile} name='bio' type="button" className="btn btn-success my-1">{props.language.saveChange}</button></span>
                                    <span><button onClick={modifyBio} type="button" className="btn btn-danger mb-3">{props.language.cancelChange}</button></span>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Request({props, request, profile, setProfile}) {

	const accept = () => {
		props.socket.send(JSON.stringify({
			action : "friend",
			item : {type : 'accept', id : request.id}
		}))
		props.setMyProfile({...props.myProfile, friends : [...props.myProfile.friends, request.id]})
		setProfile({
			...profile,
			friend_requests : profile.friend_requests.filter(f_q => f_q.id !== request.id),
			friends : [...profile.friends, request]
		})
	}

	const dismiss = () => {
		props.socket.send(JSON.stringify({
			action : 'friend',
			item : {type : 'dismiss', id : request.id}
		}))
	}

	return (
		<li className='list-group-item d-flex ps-2'>
			<div style={{height: '70px', width: '70px'}}>
                <img className='rounded-circle' style={{height: '70px', width: '70px'}} src={request.avatar} alt="" />
            </div>
			<div className='d-flex flex-wrap align-items-center ms-3'>
                <span className='w-100 fw-bold'>{request.name}</span>
				<div className='w-100 d-flex justify-content-between align-items-center pe-2'>
                	<button onClick={accept} type='button' className='btn btn-success'>{props.language.acceptFriend}</button>
                	<button onClick={dismiss} type='button' className='btn btn-danger ms-2'>{props.language.dismissFriend}</button>
				</div>
            </div>
		</li>
	)

}

function Friend({props, friend, profile, setProfile}) {

	const buildMenu = () => {
		let index = 1
		let menu = [<Link to={'/profile/' + friend.id} key={index++} className='px-2 dropdown-item nav-link'>{props.language.seeProfile}</Link>]
		if (props.myProfile && friend.id !== props.myProfile.id) {
			if (!props.myProfile.blocked.includes(friend.id))
				menu.push(<li onClick={() => Social.block(friend.id, props.socket, props.myProfile, props.setMyProfile, profile, setProfile, props.language.delete1)} key={index++} type='button' className='px-2 dropdown-item nav-link'>{props.language.block}</li>)
			else
				menu.push(<li onClick={() => Social.unblock(friend.id, props.myProfile, props.setMyProfile)} key={index++} type='button' className='px-2 dropdown-item nav-link'>{props.language.unblock}</li>)
			if (profile.id === props.myProfile.id && props.myProfile.friends.includes(friend.id))
				menu.push(<li onClick={() => Social.unfriend(friend.id, props.socket, props.myProfile, props.setMyProfile, profile, setProfile, props.language.delete1)} key={index++} type='button' className='px-2 dropdown-item nav-link'>{props.language.removeFriend}</li>)
			if (props.myProfile && !props.myProfile.friends.includes(friend.id))
				menu.push(<li onClick={() => Social.addFriend(friend.id, props.socket)} key={index++} type='button' className='px-2 dropdown-item nav-link'>{props.language.addFriend}</li>)
			if (props.muted.includes(friend.id))
				menu.push(<li onClick={() => props.setMuted(props.muted.filter(user => user !== friend.id))} key={index++} type='button' className='px-2 dropdown-item nav-link'>{props.language.unMute}</li>)
			else
				menu.push(<li onClick={() => props.setMuted([...props.muted, friend.id])} key={index++} type='button' className='px-2 dropdown-item nav-link'>{props.language.mute}</li>)
			if (profile.status === 'online') {
				if(!props.muted.includes(friend.id))
					menu.push(<li onClick={() => Social.directMessage(props.xlg, friend.name)} key={index++} type='button' className='px-2 dropdown-item nav-link'>{props.language.dm}</li>)
				if (friend.challengeable && !props.myProfile.pongChallengers.includes(friend.id))
					menu.push(<li onClick={() => Social.challenge(friend.id, 'pong', props.myProfile, props.setMyProfile, props.socket)} key={index++} type='button' className='px-2 dropdown-item nav-link'>{props.language.challengePong}</li>)
				if (friend.challengeable && !props.myProfile.chessChallengers.includes(friend.id))
					menu.push(<li onClick={() => Social.challenge(friend.id, 'chess', props.myProfile, props.setMyProfile, props.socket)} key={index++} type='button' className='px-2 dropdown-item nav-link'>{props.language.challengeChess}</li>)
				if (friend.room > 0)
					menu.push(<Link to={'/game/' + friend.game + '/' + friend.room + '/'} key={index++} type='button' className='ps-2 dropdown-item nav-link'>{props.language.watchGame}</Link>)
			}
		}
		return menu
	}

	return (
		<li className='list-group-item d-flex ps-2' key={friend.id}>
            <div style={{height: '70px', width: '70px'}}>
                <img className='rounded-circle' style={{height: '70px', width: '70px'}} src={friend.avatar} alt="" />
            </div>
            <div className='d-flex flex-wrap align-items-center ms-3'>
                <span className='w-100 fw-bold'>{friend.name}</span>
				<div className='w-100 d-flex justify-content-between align-items-center pe-2'>
                	<span className={'fw-bold text-capitalize '.concat(friend.status === "online" ? 'text-success' : 'text-danger')}>
                	    {props.language[friend.status]}
                	</span>
                	<button type='button' data-bs-toggle='dropdown' className='btn btn-secondary ms-3'>Options</button>
                	<ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>
						{buildMenu()}
					</ul>
				</div>
            </div>
        </li>
	)
}
