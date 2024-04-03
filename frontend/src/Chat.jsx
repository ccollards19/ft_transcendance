import { useState, useEffect } from 'react'

function Chat({ props }) {

    const sendMessage = () => {
		let prompt = document.getElementById('chatPrompt')
		let isWhisp = prompt.value.startsWith('/w "') && prompt.value.substring(4, prompt.value.indexOf('"', 4)).trim.length !== 0
		var info = 'none'
		if (prompt.value.trim === '/m')
			info = props.myProfile.muted
		if (prompt.value.trim !== '') {
			let message = {
				name : props.myProfile.name,
				id : props.myProfile.id,
				text : prompt.value,
				whisp : isWhisp,
				info : info
			}
			// console.log(message.whisp)
			// props.sockets[props.chan].send(JSON.stringify(message))
		}
        prompt.value = isWhisp ? prompt.value.substring(0, prompt.value.indexOf('"', 4) + 2) :  ''
    }
	const toggleChan = (e) => props.setChan(e.target.dataset.chan)
	const leaveChan = (e) => {
		props.setChanList(props.chanList.filter(chan => chan !== e.target.dataset.chan))
		if (e.target.dataset.chan === props.chan)
			props.setChan('general')
	}
    const captureKey = (e) => e.keyCode === 13 && sendMessage()

	let chanIndex = 1
	let leaveIndex = 1

	return (
        <div className={`h-100 ${props.xlg ? 'bg-dark-subtle' : 'bg-white'} d-flex flex-column`} style={{width: '300px', maxHeight: '100%'}}>
            <div className="d-flex justify-content-center py-2">
                <button type='button' className='nav-link' data-bs-toggle='dropdown'><h5 className="my-0 text-capitalize"><i>#</i> {props.chan} {props.chats.length > 1 && <img src='/images/caret-down-fill.svg' alt='' />}</h5></button>
				<ul className='dropdown-menu'>
					{props.chats.map(chat =>
						<li onClick={toggleChan} key={chat.tag} data-chat={chat.tag} type='button' className='px-2 fw-bold dropdown-item nav-link text-capitalize'>{chat.name}</li>
					)}
					{props.chats.length > 1 && <li><hr className="dropdown-divider" /></li>}
					{props.chats.length > 1 &&
						props.chats.map(chat =>
							<li onClick={leaveChan} key={chanIndex++} data-chat={chat.tag} type='button' className='px-2 fw-bold dropdown-item nav-link text-capitalize' hidden={chat.tag === 'lobby'}>Leave {chat.name}</li>
						)
					}
				</ul>
            </div>
            <hr className="mx-5 mt-0 mb-2" />
            <div className="px-2 d-flex flex-column justify-content-end overflow-y-auto flex-grow-1" style={{maxWidth: '100%'}}>
				{props.chats.map(chat => {
					return <Channel key={leaveIndex++} props={props} chat={chat} />
				})}
            </div>
            <div className="w-100 ps-4 pe-5 pb-3 pt-2 align-self-end">
                <div className="d-flex gap-3 pt-1 row ps-3">
                    <div className="input-group p-0 m-0">
                        <span className="pt-1 me-2 m-0 border-0"><img src="/images/wechat.svg" alt="" /></span>
                        <input onKeyDown={captureKey} type="text" name="chatPrompt" id="chatPrompt" className={`form-control ${props.xlg ? 'border-0' : 'border-1 border-black'} rounded`} placeholder={props.myProfile ? 'Say something nice' : 'Log in to chat'} disabled={!props.myProfile} />
                        <button onClick={sendMessage} className="pt-1 ms-2 nav-link" disabled={!props.myProfile}><img src="/images/send.svg" alt="" /></button>
                      </div>                              
                </div>
            </div>
        </div>
    )
}

export function Channel({props, chat}) {

	const [menu, setMenu] = useState([])
	
	// useEffect(() => {
	// 	const inter = setInterval(() => {
	// 	var request = new XMLHttpRequest()
	// 	request.responseType = 'json'
	// 	// request.open('GET', "/api/user/)
	// 	request.open('GET', '/data/sampleMessage.json')
	// 	request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
	// 	request.send()
	// 	request.onload = () => {
	// 		setMessages([...messages, request.response])
	// 		let chat = document.getElementById(name)
	// 		if (chat.scrollTop + chat.clientHeight === chat.scrollHeight)
	// 			chat.scrollTop = chat.scrollHeight
	// 	}
	// }, 100) 
	// return () => clearInterval(inter)})

	// if (messages.length === 1 && name === 'general') {
	// 	var request = new XMLHttpRequest()
	// 	request.open('GET', '/data/sampleChat.json')
	// 	request.responseType = 'json'
	// 	request.send()
	// 	request.onload = () => setMessages(request.response)
	// }

	// useEffect(() => {
	// 	const socket = new WebSocket('ws://ws/chat/'.concat(name))
	// 	socket.onopen = () => {
	// 		setMessages([...messages, 'Welcome to the ' + name + ' channel'])
	// 		props.setSockets([...props.sockets, {name : socket}])
	// 	}
		
	// 	socket.onmessage = (event) => {
	// 		const receivedMessage = JSON.parse(event.data);
	// 		setMessages([...messages, receivedMessage]);
	// 		document.getElementById(name).scrollTop = document.getElementById(name).scrollHeight
	// 		if (receivedMessage.id === 0 && receivedMessage.text === 'No such user')
	// 			document.getElementById('chatPrompt').value = ''
	// 	}
	// 	return () => socket.close()
	// }, [messages, name, props])

	const seeProfile = (e) => {
		props.setProfileId(parseInt(e.target.dataset.id, 10))
		props.setPage('Profile')
	}

	const directMessage = (e) => {
        let prompt = document.getElementById('chatPrompt')
        prompt.value = '/w '.concat('"', e.target.dataset.name, '" ')
        prompt.focus()
    }

	const mute = (e) => {
		let id = parseInt(e.target.dataset.id, 10)
		var request = new XMLHttpRequest()
		request.responseType = 'json'
		request.open('POST', '/api/user/' + props.myProfile.id + '/mute/' + id)
		request.send()
		request.onload = () => {
			props.setMyProfile({
				...props.myProfile,
				muted : [...props.myProfile.muted, id]
			})
		}
	}

	const addFriend = (e) => {
		props.setMyProfile({
			...props.myProfile,
			friends : [...props.myProfile.friends, parseInt(e.target.dataset.id, 10)]
		})
		// let id = parseInt(e.target.dataset.id, 10)
		// var request = new XMLHttpRequest()
		// request.responseType = 'json'
		// request.open('POST', '/api/user/' + props.myProfile.id + '/addFriend/' + id)
		// request.send()
		// request.onload = () => {
		// 	props.setMyProfile({
		// 		...props.myProfile,
		// 		friends : [...props.myProfile.friends, id]
		// 	})
		// }
	}
	const unfriend = (e) => {
		let id = parseInt(e.target.dataset.id, 10)
		var request = new XMLHttpRequest()
		request.responseType = 'json'
		request.open('POST', '/api/user/' + props.myProfile.id + '/unfriend/' + id)
		request.send()
		request.onload = () => {
			props.setMyProfile({
				...props.myProfile,
				friends : props.myProfile.friends.filter(friend => friend !== id)
			})
		}
		if (props.page === 'Profile' && props.profileId === props.myProfile.id)
			props.setFriends(props.friends.filter(item => item.id !== parseInt(e.target.dataset.id)))
	}

	const toBottom = () => document.getElementById(chat.name).scrollTop = document.getElementById(chat.name).scrollHeight

	const createMenu = (e) => {
		let id = parseInt(e.target.dataset.id, 10)
		let xhr = new XMLHttpRequest()
		xhr.open('GET', '/aapi/user/' + id + '.json')
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 3) {
				let status = JSON.parse(xhr.response).status
				let menuIndex = 1
				let menu = [
					<li key={menuIndex++} className='px-2'>{e.target.dataset.name}</li>,
					<li key={menuIndex++}><hr className="dropdown-divider" /></li>,
					<li key={menuIndex++} onClick={seeProfile} data-id={id} type='button' className='px-2 dropdown-item nav-link'>See profile</li>
				]
				if (props.myProfile) {
					if (status === 'online')
						menu.push(<li onClick={directMessage} key={menuIndex++} data-name={e.target.dataset.name} type='button' className='px-2 dropdown-item nav-link'>Direct message</li>)
					menu.push(<li onClick={mute} key={menuIndex++} data-id={id} type='button' className='px-2 dropdown-item nav-link'>Mute</li>)
					if (!props.myProfile.friends.includes(id))
						menu.push(<li onClick={addFriend} key={menuIndex++} data-id={id} type='button' className='px-2 dropdown-item nav-link'>Add to friendlist</li>)
					else
						menu.push(<li onClick={unfriend} key={menuIndex++} data-id={id} type='button' className='px-2 dropdown-item nav-link'>Remove from friendlist</li>)
					if (status === 'online') {
						if (!props.myProfile['pong'].challenged.includes(id))
							menu.push(<li key={menuIndex++} data-id={id} type='button' className='px-2 dropdown-item nav-link'>Challenge to Pong</li>)
						if (!props.myProfile['chess'].challenged.includes(id))
							menu.push(<li key={menuIndex++} data-id={id} type='button' className='px-2 dropdown-item nav-link'>Challenge to Chess</li>)
					}
				}
				setMenu(menu)
			}
		}
		// let menuIndex = 1
		// let menu = [
		// 	<li key={menuIndex++} className='px-2'>{e.target.dataset.name}</li>,
		// 	<li key={menuIndex++}><hr className="dropdown-divider" /></li>,
		// 	<li key={menuIndex++} onClick={seeProfile} data-id={id} type='button' className='px-2 dropdown-item nav-link'>See profile</li>
		// ]
		// if (props.myProfile) {
		// 	menu.push(<li onClick={directMessage} key={menuIndex++} data-name={e.target.dataset.name} type='button' className='px-2 dropdown-item nav-link'>Direct message</li>)
		// 	menu.push(<li onClick={mute} key={menuIndex++} data-id={id} type='button' className='px-2 dropdown-item nav-link'>Mute</li>)
		// 	if (!props.myProfile.friends.includes(id))
		// 		menu.push(<li onClick={addFriend} key={menuIndex++} data-id={id} type='button' className='px-2 dropdown-item nav-link'>Add to friendlist</li>)
		// 	else
		// 		menu.push(<li onClick={unfriend} key={menuIndex++} data-id={id} type='button' className='px-2 dropdown-item nav-link'>Remove from friendlist</li>)
		// 	if (!props.myProfile['pong'].challenged.includes(id))
		// 		menu.push(<li key={menuIndex++} data-id={id} type='button' className='px-2 dropdown-item nav-link'>Challenge to Pong</li>)
		// 	if (!props.myProfile['chess'].challenged.includes(id))
		// 		menu.push(<li key={menuIndex++} data-id={id} type='button' className='px-2 dropdown-item nav-link'>Challenge to Chess</li>)
		// }
		// setMenu(menu)
	}

	let index = 1

	return (
		<>
			<div id={chat.tag} key={chat.tag} className='overflow-auto noScrollBar' hidden={props.chan !== chat.name} style={{maxHeight: '100%'}}>
				<span className='text-primary'>Welcome on the {chat.name} chan</span>
				{chat.messages.map(message => 
					(!props.myProfile || !props.myProfile.muted.includes(message.id)) &&
					<div key={index++}>
						<button onClick={createMenu} data-id={message.id} data-name={message.name} type='button' data-bs-toggle='dropdown' className={`nav-link d-inline ${props.myProfile && props.myProfile.id === message.id ? 'text-danger' : 'text-primary'}`} disabled={props.myProfile && props.myProfile.id === message.id}>{props.myProfile && props.myProfile.id === message.id ? 'You' : message.name}</button> 
						<span className={`${message.whisp && 'text-success'}`}> : {message.text}</span>
						<ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>{menu}</ul>
					</div>
				)}
			</div>
			<div className='d-flex align-items-center justify-content-center my-2' hidden={props.chan !== chat.name}><button onClick={toBottom} type='button' className='nav-link' hidden={props.chan !== chat.name}><img src="/images/arrow-down-circle.svg" alt="" /></button></div>
        	<hr className="mx-5 mt-0 mb-2" hidden={props.chan !== chat.name} />
		</>
	)
}

export default Chat