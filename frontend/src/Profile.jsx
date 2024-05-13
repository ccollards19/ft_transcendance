import { useState, useEffect } from "react"
import { OverlayTrigger, Popover }  from 'react-bootstrap'
import { Link, useParams } from "react-router-dom"
import { History } from "./Tournaments.jsx"
import * as Social from "./Social.js"

export default function Profile({props}) {

    const [profile, setProfile] = useState(undefined)
	const [friends, setFriends] = useState([])
	const [matches, setMatches] = useState([])
	const [requests, setRequests] = useState([])
	const [display, setDisplay] = useState('friends')

	let id = useParams().id
	let idInt = parseInt(id, 10)

	useEffect (() => {
		if (id !== 'none' && !isNaN(idInt) && (!profile || profile.id !== idInt)) {
			props.socket.send(JSON.stringify({
				component : 'profile',
				action : undefined,
				item : {id : id}
			}))
			if (display === 'history')
				setDisplay('friends')
			if (friends.length > 0)
				setFriends([])
			if (matches.length > 0)
				setMatches([])
			if (requests.length > 0)
				setRequests([])
		}
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data.item)
			else if (data.action === 'chat')
				props.socket.onChat(data)
			else if (data.action === 'setMatches') 
				setMatches(data.item)
			else if (data.action === 'setFriends')
				setFriends(data.item)
			else if (data.action === 'setRequests')
				setRequests(data.item)
			else if (data.action === 'setProfile')
				setProfile(data.item)
		}
		const interval = setInterval(() => {
			if (id !== 'none' && !isNaN(idInt))
				props.socket.send(JSON.stringify({
						component : 'profile',
						action : undefined,
						item : {id : id}
					}))
		}, 3000)
		return () => clearInterval(interval)
	}, [props.socket, props.socket.onmessage, id, idInt, friends, profile, matches, requests, display])

	if (id === 'none')
		return <div className="d-flex justify-content-center align-items-center fw-bold fs-1" style={props.customwindow}>This user never existed or deleted his account</div>

	if (isNaN(idInt))
		props.setHack(true)

	if (!profile || !friends || !matches)
		return <div className="d-flex justify-content-center align-items-center noScrollBar" style={props.customwindow}><img src="/images/loading.gif" alt="" /></div>

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

	const modifyMyProfile = name => {
      	props.socket.send(JSON.stringify({component : "profile", action : name, item : document.getElementById(name).value}))
      	name === 'changeName' && modifyName()
      	name === 'changeCP' && modifyCP()
      	name === 'changeBio' && modifyBio()	
  	}

	const modifyAvatar = async e => {
		if (e.target.files) {
			const formData = new FormData()
			formData.append('file', e.target.files[0])
			try {
				await fetch('/api/files', {
					method : 'POST',
					body : formData
				})
				props.socket.send(JSON.stringify({component : 'profile', action : 'changeAvatar', item : e.target.files[0].name}))
			}
			catch (error) {
				window.alert('An error has occured. Try again')
			}
		}
	}

	const captureKey = e => {
		if (e.keyCode === 13) {
			e.preventDefault()
			modifyMyProfile(e.target.name)
		}
	}

	function buildMenu() {
		let profileMenuIndex = 1
        let menu = []
		if (props.myProfile.blocked.includes(profile.id))
			menu.push(<li key={profileMenuIndex++} onClick={() => Social.block(props.socket, profile.id)} type='button' className='px-2 dropdown-item nav-link'>Block</li>)
		else
			menu.push(<li key={profileMenuIndex++} onClick={() => Social.unblock(props.socket, profile.id)} type='button' className='px-2 dropdown-item nav-link'>Unblock</li>)
		if (!props.myProfile.friends.includes(profile.id))
			menu.push(<li key={profileMenuIndex++} onClick={() => Social.addFriend(props.socket, profile.id)} type='button' className='px-2 dropdown-item nav-link'>Add to friendlist</li>)
		else
			menu.push(<li key={profileMenuIndex++} onClick={() => Social.unfriend(props.socket, profile.id)} type='button' className='px-2 dropdown-item nav-link'>Remove from friendlist</li>)
        if (props.muted.includes(profile.id))
		    menu.push(<li key={profileMenuIndex++} onClick={() => props.setMuted(props.muted.filter(user => user !== profile.id))} type='button' className='ps-2 dropdown-item nav-link'>Unmute</li>)
		else
			menu.push(<li key={profileMenuIndex++} onClick={() => props.setMuted([...props.muted, profile.id])} type='button' className='ps-2 dropdown-item nav-link'>Mute</li>)
		if (profile.status === 'online') {
            if (!props.muted.includes(profile.id))
                menu.push(<li key={profileMenuIndex++} onClick={() => Social.directMessage(props.xlg, document.getElementById('chat2').hidden, profile.name)} type='button' className='ps-2 dropdown-item nav-link'>Direct message</li>)
		    if (!props.myProfile['pong'].challenged.includes(profile.id) && !props.myProfile['pong'].challengers.includes(profile.id) && profile.challengeable)
                menu.push(<li key={profileMenuIndex++} onClick={() => Social.challenge(props.socket, profile.id, 'pong')} type='button' className='ps-2 dropdown-item nav-link'>Challenge to Pong</li>)
		    if (!props.myProfile['chess'].challenged.includes(profile.id) && !props.myProfile['chess'].challengers.includes(profile.id) && profile.challengeable)
                menu.push(<li key={profileMenuIndex++} onClick={() => Social.challenge(props.socket, profile.id, 'chess')} type='button' className='ps-2 dropdown-item nav-link'>Challenge to Chess</li>)
        }
        return menu
	}

    let index = 1

    return (
        <div className="d-flex flex-column noScrollBar" style={props.customwindow}>
            <div className={`w-100 pt-1 px-1 d-flex gap-2 ${props.md ? 'justify-content-between' : 'flex-column align-items-center'}`}>
                <label id={props.myProfile && profile.id === props.myProfile.id ? 'myAvatar' : undefined} htmlFor='avatarUpload' className={`rounded-circle d-flex justify-content-center align-items-center position-relative`} style={{height: '125px',width: '125px'}}>
                    <img id='avatarLarge' src={profile ? '/images/'.concat(profile.avatar) : ''} alt="" className="rounded-circle" style={{height: '100%',width: '100%'}} />
                    <span id='modifyAvatarLabel' className="text-white fw-bold position-absolute">Modify avatar</span>
                    <input onChange={modifyAvatar} id='avatarUpload' type="file" accept='image/*' disabled={!props.myProfile || profile.id !== props.myProfile.id} style={{width: '10px'}} />
                </label>
                <h2 className={`d-flex justify-content-center align-items-center`}>
                    <button id='name' onClick={modifyName} className='nav-link' title={props.myProfile && profile.id === props.myProfile.id ? 'Modify name' : undefined} disabled={!props.myProfile || profile.id !== props.myProfile.id}>
                        <span className={`fs-1 fw-bold text-decoration-underline ${props.myProfile && profile.id === props.myProfile.id ? 'myProfile' : ''}`}>{profile.name}</span>
                    </button>
					{(!props.myProfile || props.myProfile.id !== profile.id) && <span className={`pt-4 ps-2 fs-6 text-capitalize fw-bold ${profile.status === 'online' ? 'text-success' : 'text-danger'}`}>({profile.status})</span>}
					{props.myProfile && profile.id === props.myProfile.id &&
						<OverlayTrigger trigger='click' overlay={<Popover className="p-2"><strong>Since it is your profile, you may click on your avatar, your name, or the catchphrase and bio titles to modify their values.</strong></Popover>}>
							<button type='button' className="nav-link d-inline">
								<img id='tooltip' src='/images/question-lg.svg' className="ms-2 border border-black border-2 rounded-circle" alt='' style={{width : '20px', height : '20px'}} />
							</button>
						</OverlayTrigger>}
                    <div id='nameForm' style={{maxWidth: '300px'}} hidden>
                        <form className="d-flex flex-column align-self-center">
                            <div className="form-text fs-5">Max 20 characters</div>
                            <input onKeyDown={captureKey} id="changeName" type="text" name="changeName" className="fs-3" size="40" maxLength="20" />
                            <div className="d-flex flex-row gap-2">
                                <button type="button" onClick={modifyMyProfile} name='changeName' className="btn btn-success my-1">Save changes</button>
                                <button type="button" onClick={modifyName} className="btn btn-danger my-1">Cancel changes</button>
                            </div>
                        </form>
                    </div>
                </h2>
                <div className="border-start border-bottom border-black p-3 rounded-circle" style={{width: '125px',height: '125px'}}>
                    <img src={'/images/'.concat(profile[props.settings.game].rank !== '' ? profile[props.settings.game].rank : 'pirate-symbol-mark-svgrepo-com.svg')} alt="" className="rounded-circle" style={{height: '100%',width: '100%'}} />
                </div>
            </div>
            <div className="mw-100 flex-grow-1 d-flex flex-column p-2" style={{maxHeight: '75%'}}>
                <p className={`d-flex ${props.md ? 'justify-content-around' : 'flex-column align-items-center'} text-uppercase fs-5 fw-bold`}>
                    <span className="text-success">Wins - {profile[props.settings.game].wins}</span>
                    <span className="text-primary">Matches played - {profile[props.settings.game].matches}</span>
                    <span className="text-danger">Losses - {profile[props.settings.game].loses}</span>
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
					<button onClick={() => setDisplay('friends')} type='button' className={`nav-link d-inline me-3 ${display === 'friends' && 'text-decoration-underline'}`}>Friend List</button>
					<button onClick={() => setDisplay('history')} type='button' className={`nav-link d-inline ${display === 'history' && 'text-decoration-underline'}`}>{'Last ' + matches.length + ' match' + (matches.length > 1 ? 'es' : '')}</button>
				</p>
                <div className={`d-flex ${!props.md && 'flex-column align-items-center'} mt-1`} style={{maxHeight: '75%'}}>
					{display === 'friends' ?
                    	friends.length === 0 && requests.length === 0 ?
                    	    <div className="w-25 d-flex rounded border border-black d-flex align-items-center justify-content-center fw-bold" style={{minHeight: '300px', maxWidth : '280px'}}>
                    	        Nothing to display... Yet
                    	    </div> :
							<ul className="d-flex rounded w-100 list-group overflow-auto noScrollBar" style={{minHeight: '300px', maxWidth: '280px'}}>
								{requests.map(request => { return <Request key={index++} props={props} profile={request.item} id={request.id} requests={requests} setRequests={setRequests} /> }).concat(
								friends.filter(friend => friend.item.status === 'online').map(friend => { return <Friend key={index++} props={props} profile={friend.item} id={idInt} /> })).concat(
								friends.filter(friend => friend.item.status === 'offline').map(friend => { return <Friend key={index++} props={props} profile={friend.item} id={idInt} /> }))}
							</ul> :
						matches.length === 0 ?
							<div className="w-25 d-flex rounded border border-black d-flex align-items-center justify-content-center fw-bold" style={{minHeight: '300px', maxWidth : '280px'}}>
								Are you new or just lazy?
							</div> :
							<ul className="d-flex rounded w-100 list-group overflow-auto noScrollBar" style={{minHeight: '300px', maxWidth: '280px'}}>
								{matches.map(match => { return <History key={index++} props={props} item={match.item} /> })}
							</ul>
					}
                    <div className={`d-flex flex-column gap-3 ms-3 ${!props.md && 'mt-3 align-items-center'}`} style={{maxWidth: props.md ? 'calc(100% - 280px)' : '100%', height: '100%'}}>
                        <div id='CPDiv' className="ps-3" style={{minHeight: '20%'}}>
                            <p className={`d-flex gap-2 mt-1 ${!props.md && 'justify-content-center'}`}>
                                <button onClick={modifyCP} title={props.myProfile && profile.id === props.myProfile.id ? 'Modify catchphrase' : undefined} className={`nav-link text-decoration-underline fs-4 fw-bold ${props.myProfile && profile.id === props.myProfile.id ? 'myProfile' : ''}`} disabled={!props.myProfile || profile.id !== props.myProfile.id}>Catchphrase</button>
                            </p>
                            <div id='CP' className="w-100 m-0 fs-4">{profile.catchphrase}</div>
                            <div id='CPForm' style={{maxWidth : '300px'}} hidden>
                                <form className="d-flex flex-column" action='/modifyMyProfile.jsx'>
                                    <div className="form-text">Max 80 characters</div>
                                    <input onKeyDown={captureKey} id="changeCP" type="text" name="changeCP" size="40" maxLength="80" />
                                    <span><button onClick={modifyMyProfile} name='changeCP' type="button" className="btn btn-success my-1">Save changes</button></span>
                                    <span><button onClick={modifyCP} type="button" className="btn btn-danger mb-3">Cancel changes</button></span>
                                </form>
                            </div>
                        </div>
                        <div id='bioDiv' className="ps-3" style={{maxHeight: '60%'}}>
                            <p className={`d-flex gap-2 mt-1 ${!props.md && 'justify-content-center'}`}>
                                <button onClick={modifyBio} title={props.myProfile && profile.id === props.myProfile.id ? 'Modify bio' : undefined} className={`nav-link text-decoration-underline fs-4 fw-bold ${props.myProfile && profile.id === props.myProfile.id ? 'myProfile' : ''}`} disabled={!props.myProfile || profile.id !== props.myProfile.id}>Bio</button>
                            </p>
                            <div id='bio' className="mt-1 flex-grow-1 fs-5 overflow-auto" style={{maxHeight: '100%'}}>{profile.bio}</div>
                            <div id='bioForm' style={{maxWidth : '300px'}} hidden>
                                <form className="d-flex flex-column" action='/modifyMyProfile.jsx'>
                                    <textarea onKeyDown={captureKey} id="changeBio" name="changeBio" cols="50" rows="5"></textarea>
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

function Request({props, profile, id, requests, setRequests}) {

	const accept = () => {
		props.socket.send(JSON.stringify({
			component : 'app',
			action : 'acceptRequest',
			item : {id : id}
		}))
		setRequests(requests.filter(request => request.id !== id))
	}

	const dismiss = () => {
		props.socket.send(JSON.stringify({
			component : 'app',
			action : 'dismissRequest',
			item : {id : id}
		}))
		setRequests(requests.filter(request => request.id !== id))
	}

	return (
		<li className='list-group-item d-flex ps-2'>
			<div style={{height: '70px', width: '70px'}}>
                <img className='rounded-circle' style={{height: '70px', width: '70px'}} src={'/images/'.concat(profile.avatar)} alt="" />
            </div>
			<div className='d-flex flex-wrap align-items-center ms-3'>
                <span className='w-100 fw-bold'>{profile.name}</span>
				<div className='w-100 d-flex justify-content-between align-items-center pe-2'>
                	<button onClick={accept} type='button' className='btn btn-success ms-3'>Accept</button>
                	<button onClick={dismiss} type='button' className='btn btn-danger ms-3'>Dismiss</button>
				</div>
            </div>
		</li>
	)

}

function Friend({props, profile, id}) {

	const buildMenu = () => {
		let index = 1
		let menu = [<Link to={'/profile/' + profile.id} key={index++} className='px-2 dropdown-item nav-link'>See profile</Link>]
		if (props.myProfile && profile.id !== props.myProfile.id) {
			menu.push(<li onClick={() => Social.block(props.socket, profile.id)} key={index++} type='button' className='px-2 dropdown-item nav-link'>Block</li>)
			if (id === props.myProfile.id && props.myProfile.friends.includes(profile.id))
				menu.push(<li onClick={() => Social.unfriend(props.socket, profile.id)} key={index++} type='button' className='px-2 dropdown-item nav-link'>Remove from friendlist</li>)
			if (!props.myProfile.friends.includes(profile.id))
				menu.push(<li onClick={() => Social.addFriend(props.socket, profile.id)} key={index++} type='button' className='px-2 dropdown-item nav-link'>Add to friendlist</li>)
			if (props.muted.includes(profile.id))
				menu.push(<li onClick={() => props.setMuted(props.muted.filter(user => user !== profile.id))} key={index++} type='button' className='px-2 dropdown-item nav-link'>Unmute</li>)
			else
				menu.push(<li onClick={() => props.setMuted([...props.muted, profile.id])} key={index++} type='button' className='px-2 dropdown-item nav-link'>Mute</li>)
			if (profile.status === 'online') {
				if(!props.muted.includes(profile.id))
					menu.push(<li onClick={() => Social.directMessage(props.xlg, document.getElementById('chat2').hidden, profile.name)} key={index++} type='button' className='px-2 dropdown-item nav-link'>Direct message</li>)
				if (profile.challengeable && !props.myProfile['pong'].challenged.includes(profile.id))
					menu.push(<li onClick={() => Social.challenge(props.socket, profile.id, 'pong')} key={index++} type='button' className='px-2 dropdown-item nav-link'>Challenge to Pong</li>)
				if (profile.challengeable && !props.myProfile['chess'].challenged.includes(profile.id))
					menu.push(<li onClick={() => Social.challenge(props.socket, profile.id, 'chess')} key={index++} type='button' className='px-2 dropdown-item nav-link'>Challenge to Chess</li>)
			}
		}
		return menu
	}

	// console.log(profile)

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
                	<button type='button' data-bs-toggle='dropdown' className='btn btn-secondary ms-3'>Options</button>
                	<ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>
						{buildMenu()}
					</ul>
				</div>
            </div>
        </li>
	)
}
