import { useState, useEffect } from "react"
import { Friend } from "./other.jsx"
import { OverlayTrigger, Popover }  from 'react-bootstrap'
import { useParams } from "react-router-dom"
import { History } from "./Tournaments.jsx"

export default function Profile({props}) {

    const [profile, setProfile] = useState(undefined)
	const [friends, setFriends] = useState(undefined)
	const [matches, setMatches] = useState(undefined)

	const id = parseInt(useParams().id, 10)

	/*
	Attendu :
	{
		"action" : "profile",
		"item" : {
			...profile que je consulte en entier
		}
		//
		"action" : "addFriend" / "updateFriend",
		"item" : {
			"avatar",
			"name",
			"id",
			"status"
		}
		//
		"action" : "removeFriend",
		"id" :  "id"
	}
	*/

	useEffect (() => {
		if ((props.socket.page !== 'profile' || (props.socket.id && props.socket.id !== id)) && props.socket.readyState === 1) {
			props.socket.send(JSON.stringify({
				component : 'profile',
				action : '',
				item : {id : id}
			}))
			props.socket.page = 'profile'
			props.socket.id = id
			setFriends(undefined)
			setMatches(undefined)
		}
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
       console.log(data)
       console.log(props.myProfile)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
			else if (data.action === 'addMatch') {
				let history = [...matches, {id : data.item.id, item : data.item}]
				if (history.length > 11)
					history.shift()
				setMatches(history)
			}
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
	}, [props.socket, props.socket.readyState, props.socket.onmessage, props.socket.page, props.socket.id, props.myProfile, id, friends, profile, matches])

	if (isNaN(id))
		props.setHack(true)

	if (!profile)
		return <div className="d-flex justify-content-center align-items-center noScrollBar" style={props.customwindow}><img src="/images/loading.gif" alt="" /></div>

	if (profile.error === 'No such profile')
		return <div className="d-flex justify-content-center align-items-center" style={props.customwindow}>This user doesn't exist</div>

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

	const displayFriends = () => {
		document.getElementById('friendList').hidden = false
		document.getElementById('history').hidden = true
	}

	const displayHistory = () => {
		document.getElementById('friendList').hidden = true
		document.getElementById('history').hidden = false
	}

    const directMessage = () => {
        if (!props.xlg && document.getElementById('chat2').hidden)
			document.getElementById('chat2').hidden = false
        let prompt = document.getElementById('chatPrompt')
        prompt.value = '/w '.concat('"', profile.name, '" ')
        prompt.focus()
    }

	const addToFl = () => {
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
        <div className="d-flex flex-column noScrollBar" style={props.customwindow}>
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
                <p className={`fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2 ${!props.md && 'd-flex justify-content-center'}`}>
					<button onClick={displayFriends} type='button' className="nav-link d-inline me-3">Friend List</button>
					<button onClick={displayHistory} type='button' className="nav-link d-inline">{'Last ' + matches.length + ' match' + (matches.length > 1 && 'es')}</button>
					</p>
                <div className={`d-flex ${!props.md && 'flex-column align-items-center'} mt-1`} style={{maxHeight: '75%'}}>
                    {friends && friends.length === 0 ?
                        <div id='friendList' className="w-25 d-flex rounded border border-black d-flex align-items-center justify-content-center fw-bold" style={{minHeight: '300px', maxWidth : '280px'}}>
                            Nothing to display... Yet
                        </div> :
						<ul id='friendList' className="d-flex rounded w-100 list-group overflow-auto noScrollBar" style={{minHeight: '300px', maxWidth: '280px'}}>
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
					{matches && matches.length === 0 ?
					<div id='history' className="w-25 d-flex rounded border border-black d-flex align-items-center justify-content-center fw-bold" style={{minHeight: '300px', maxWidth : '280px'}} hidden>
						Are you new or just lazy?
					</div> :
					<ul id='history' className="d-flex rounded w-100 list-group overflow-auto noScrollBar" style={{minHeight: '300px', maxWidth: '280px'}} hidden>
						{matches && matches.map(match => { return <History props={props} item={match.item} /> })}
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

