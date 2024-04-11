import { useState } from "react"
import { Help, MuteList, BlockList } from "./other"
import { Link } from "react-router-dom"
import { useEffect } from "react"

function Chat({ props, socket }) {

	const getWhisp = (text) => {
		if (!text[2] || text[2] !== ' ')
			return undefined
		let nameStart = text.indexOf('"', 3)
		if (nameStart < 0)
			return undefined
		let nameEnd = text.indexOf('"', nameStart + 1)
		if (nameEnd < 0)
			return undefined
		let name = text.substring(nameStart + 1, nameEnd)
		if (name.trim() === '')
			return undefined
		if (!text[nameEnd + 1] || text[nameEnd + 1] !== ' ')
			return undefined
		let txt = text.substr(nameEnd + 2)
		if (txt.trim() === '')
			return undefined
		return {
			type : 'whisp',
			target : name,
			myId : props.myProfile.id,
			name : props.myProfile.name,
			text : txt
		}
	}

	const isSpecialCommand = (text) => {
		let command = text.substring(0, 2)
		if (command === '/h' || command === '/m' || command === '/b') {
			if (text[2] && text.substring(2).trim() !== command)
				props.setChats(props.chats.map(chat => {
					if (chat.tag === props.chanTag)
						return {...chat, messages : [...chat.messages, {type : 'system', text : 'Wrong command. Use : ' + command}]}
					else
						return chat
				}))
			else if (command === '/h')
				props.setChats(props.chats.map(chat => {
					if (chat.tag === props.chanTag)
						return {...chat, messages : [...chat.messages.filter(message => message.type !== 'help'), {type : 'help'}]}
					else
						return chat
				}))
			else if (command === '/m')
				props.setChats(props.chats.map(chat => {
					if (chat.tag === props.chanTag)
						return {...chat, messages : [...chat.messages.filter(message => message.type !== 'mute'), {type : 'mute'}]}
					else
						return chat
				}))
			else if (command === '/b')
				props.setChats(props.chats.map(chat => {
					if (chat.tag === props.chanTag)
						return {...chat, messages : [...chat.messages.filter(message => message.type !== 'block'), {type : 'block'}]}
					else
						return chat
				}))
			document.getElementById('chatPrompt').value = ''
			return true
		}
		if (command === '/w') {
			let message = getWhisp(text)
			if (!message) {
				props.setChats(props.chats.map(chat => {
					if (chat.tag === props.chanTag)
						return {...chat, messages : [...chat.messages, {type : 'system', text : 'Wrong command. Use : /w "[username]" [message]'}]}
					else
						return chat
				}))
				document.getElementById('chatPrompt').value = ''
			}
			else {
				props.setChats(props.chats.map(chat => { return {...chat, messages : [...chat.messages, {...message, id : props.myProfile.id}]}}))
				document.getElementById('chatPrompt').value = '/w "' + message.target + '" '
				socket.send(message)
			}
			return true
		}
		return false
	}

    const sendMessage = () => {
		let prompt = document.getElementById('chatPrompt')
		if (!isSpecialCommand(prompt.value)) {
			let message = {
				type : 'message',
				target : props.chanTag,
				myId : props.myProfile.id,
				name : props.myProfile.name,
				text : prompt.value
			}
			props.setChats(props.chats.map(chat => {
				if (chat.tag === props.chanTag)
					return {...chat, messages : [...chat.messages, message]}
				else
					return chat
			}))
			socket.send(message)
			prompt.value = ''
		}
    }

	const toggleChan = (e) => {
		props.setChanTag(e.target.dataset.tag)
		props.setChanName(e.target.dataset.name)
	}
	
	const leaveChan = (e) => {
		let tag = e.target.dataset.tag
		props.setChats(props.chats.filter(chat => chat.tag !== tag))
		if (props.chanTag === tag) {
			props.setChanTag('lobby')
			props.setChanName('general')
		}
	}
    
	const captureKey = e => e.keyCode === 13 && sendMessage()

	let chanIndex = 1
	let leaveIndex = 1

	return (
        <div className={`h-100 ${props.xlg ? 'bg-dark-subtle' : 'bg-white'} d-flex flex-column`} style={{width: '300px', maxHeight: '100%'}}>
            <div className="d-flex justify-content-center py-2">
                <button type='button' className='nav-link' data-bs-toggle='dropdown'><h5 className="my-0 text-capitalize"><i>#</i> {props.chanName} {props.chats.length > 1 && <img src='/images/caret-down-fill.svg' alt='' />}</h5></button>
				<ul className='dropdown-menu'>
					{props.chats.map(chat =>
						<li onClick={toggleChan} key={chat.tag} data-tag={chat.tag} data-name={chat.name} type='button' className='px-2 fw-bold dropdown-item nav-link text-capitalize'>{chat.name}</li>
					)}
					{props.chats.length > 1 && <li><hr className="dropdown-divider" /></li>}
					{props.chats.length > 1 &&
						props.chats.map(chat =>
							<li onClick={leaveChan} key={chanIndex++} data-tag={chat.tag} type='button' className='px-2 fw-bold dropdown-item nav-link text-capitalize' hidden={chat.tag === 'lobby'}>Leave {chat.name}</li>
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
                        <input onKeyDown={captureKey} type="text" name="chatPrompt" id="chatPrompt" className={`form-control ${props.xlg ? 'border-0' : 'border-1 border-black'} rounded`} placeholder={props.myProfile ? 'Say something nice' : 'Log in to chat'} disabled={!props.myProfile || (props.chats[0].messages.length > 0 && props.chats[0].messages[props.chats[0].messages.length - 1].type === 'error')} />
                        <button onClick={sendMessage} className="pt-1 ms-2 nav-link" disabled={!props.myProfile || (props.chats[0].messages.length > 0 && props.chats[0].messages[props.chats[0].messages.length - 1].type === 'error')}><img src="/images/send.svg" alt="" /></button>
                      </div>                              
                </div>
            </div>
        </div>
    )
}

function Menu({props, id, name}) {

	const [profile, setProfile] = useState(undefined)

	if (!profile || profile.id !== id) {
		let xhr = new XMLHttpRequest()
		xhr.open('GET', '/aapi/user/' + id + '.json')
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 3)
				setProfile({id : id, status : JSON.parse(xhr.response).status})
		}
		xhr.send()
		return undefined
	}

	const directMessage = () => {
        let prompt = document.getElementById('chatPrompt')
        prompt.value = '/w '.concat('"', name, '" ')
        prompt.focus()
    }

	const mute = () => props.setMuted([...props.muted, id])

	const addFriend = () => {
		// var request = new XMLHttpRequest()
		// request.responseType = 'json'
		// request.open('POST', '/api/user/' + props.myProfile.id + '/addFriend/' + id, true, props.creds.name, props.creds.password)
		// request.send()
		// request.onload = () => {}
		props.setMyProfile({
			...props.myProfile,
			friends : [...props.myProfile.friends, id]
		})
	}

	const unfriend = (e) => {
		// var request = new XMLHttpRequest()
		// request.responseType = 'json'
		// request.open('POST', '/api/user/' + props.myProfile.id + '/removeFriend/' + id, true, props.creds.name, props.creds.password)
		// request.send()
		// request.onload = () => {}
		props.setMyProfile({
			...props.myProfile,
			friends : props.myProfile.friends.filter(friend => friend !== id)
		})
	}

	let index = 1
	let menu = [
		<li key={index++} className='px-2'>{name}</li>,
		<li key={index++}><hr className="dropdown-divider" /></li>,
		<Link to={'/profile/' + id} key={index++} type='button' className='px-2 dropdown-item nav-link'>See profile</Link>
	]

	if (props.myProfile) {
		menu.push(<li onClick={mute} key={index++} type='button' className='px-2 dropdown-item nav-link'>Mute</li>)
		if (!props.myProfile.friends.includes(id))
			menu.push(<li onClick={addFriend} key={index++} type='button' className='px-2 dropdown-item nav-link'>Add to friendlist</li>)
		else
			menu.push(<li onClick={unfriend} key={index++} type='button' className='px-2 dropdown-item nav-link'>Remove from friendlist</li>)
		if (profile.status === 'online') {
			menu.push(<li onClick={directMessage} key={index++} type='button' className='px-2 dropdown-item nav-link'>Direct message</li>)
			if (!props.myProfile['pong'].challenged.includes(id))
				menu.push(<li key={index++} type='button' className='px-2 dropdown-item nav-link'>Challenge to Pong</li>)
			if (!props.myProfile['chess'].challenged.includes(id))
				menu.push(<li key={index++} type='button' className='px-2 dropdown-item nav-link'>Challenge to Chess</li>)
		}
	}	

	return menu
}

export function Channel({props, chat}) {

	const [menu, setMenu] = useState(undefined)

	useEffect(() => {
		const interval = setInterval(() => {
			if (chat.autoscroll)
				document.getElementById(chat.tag).scrollTop = document.getElementById(chat.tag).scrollHeight
		}, 1000)
		return () => clearInterval(interval)
	})

	const unScroll = () => props.setChats(
		props.chats.map(item => {
		if (item.tag === chat.tag)
			return {...item, autoScroll : false}
		else
			return item
		}))

	const toBottom = () => {
		document.getElementById(chat.tag).scrollTop = document.getElementById(chat.tag).scrollHeight
		props.chats.map(item => {
			if (item.tag === chat.tag)
				return {...item, autoScroll : true}
			else
				return item
		})
	}

	const buildMenu = (e) => setMenu(<Menu props={props} id={parseInt(e.target.dataset.id, 10)} name={e.target.dataset.name} />)

	if (chat.messages.length > 0 && chat.messages[chat.messages.length - 1].type === 'error')
		return (
		<div key={chat.tag} hidden={props.chanTag !== chat.tag} style={{minHeight: '100%'}} className='fw-bold fs-3 d-flex align-items-center justify-content-center'>
			An error has occured
		</div>
		)

	let index = 1

	return (
		<>
			<div onScroll={unScroll} id={chat.tag} key={chat.tag} className='overflow-auto noScrollBar' hidden={props.chanTag !== chat.tag} style={{maxHeight: '100%'}}>
				<div className='text-primary'>Welcome on the {chat.name} chan</div>
				<div className="text-primary">Type /h for help</div>
				{chat.messages.map(message => {
					if (message.type === 'help')
						return <Help key={index++} />
					if (message.type === 'mute')
						return <MuteList key={index++} props={props} />
					if (message.type === 'block')
						return <BlockList key={index++} props={props} />
					if ((message.type === 'whisp' || message.type === 'message') && !props.muted.includes(message.id) && (!props.myProfile || !props.myProfile.blocked.includes(message.id)))
						return (
						<div key={index++}>
							<button onClick={buildMenu} data-id={message.id} data-name={message.name} type='button' data-bs-toggle='dropdown' className={`nav-link d-inline ${props.myProfile && props.myProfile.id === message.myId ? 'text-danger' : 'text-primary'}`} disabled={props.myProfile && props.myProfile.id === message.myId}>
								{message.type === 'message' && message.myId && 'You'}
								{message.type === 'message' && !message.myId && message.name}
								{message.type === 'whisp' && message.myId && 'To ' + message.target}
								{message.type === 'whisp' && !message.myId && message.name}
							</button> 
							{' :'} <span style={{color : message.type === 'whisp' ? '#107553' : '#000000'}}> {message.text}</span>
							<ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>{menu}</ul>
						</div>)
					if (message.type === 'system' || message.type === 'admin')
						return <div key={index++} style={{color : message.type === 'system' ? '#FF0000' : '#5E00FF'}}>{message.text}</div>
					else
						return undefined
				})}
			</div>
			<div className='d-flex align-items-center justify-content-center my-2' hidden={props.chanTag !== chat.tag}>
				<button onClick={toBottom} type='button' className='nav-link' hidden={props.chanTag !== chat.tag}>
					<img src="/images/arrow-down-circle.svg" alt="" hidden={props.chanTag !== chat.tag} />
				</button>
			</div>
        	<hr className="mx-5 mt-0 mb-2" hidden={props.chanTag !== chat.tag} />
		</>
	)
}

export default Chat