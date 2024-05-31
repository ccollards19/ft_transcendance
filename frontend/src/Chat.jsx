import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import * as Social from "./Social.js"

export default function Chat({ props }) {

	const getWhisp = (text) => {
		if (!text[2] || text[2] !== ' ')
			return undefined
		let nameStart = text.indexOf('"', 3)
		if (nameStart < 0)
			return undefined
		let nameEnd = text.indexOf('"', nameStart + 1)
		if (nameEnd < 0)
			return undefined
		let target = text.substring(nameStart + 1, nameEnd)
		if (target.trim() === '')
			return undefined
		if (!text[nameEnd + 1] || text[nameEnd + 1] !== ' ')
			return undefined
		let txt = text.substr(nameEnd + 2)
		if (txt.trim() === '')
			return undefined
		return {
			type : 'whisp',
			target : target,
			text : txt
		}
	}

	const isSpecialCommand = text => {
		let command = text.substring(0, 2)
		if (command === '/h' || command === '/m' || command === '/b') {
			if (text[2] && text.substring(2).trim() !== command)
				props.setChats(props.chats.map(chat => {
					if (chat.tag === props.chanTag)
						return {...chat, messages : [...chat.messages, {type : 'system', text : props.language.wrongCommand + command}]}
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
						return {...chat, messages : [...chat.messages, {type : 'system', text : props.language.wrongWhisp}]}
					else
						return chat
				}))
				document.getElementById('chatPrompt').value = ''
			}
			else {
				document.getElementById('chatPrompt').value = '/w "' + message.target + '" '
				props.socket.send(JSON.stringify({
					action : 'whisp',
					item : message
				}))
			}
			return true
		}
		if (command[0] === '/') {
			props.setChats(props.chats.map(chat => {
				if (chat.tag === props.chanTag)
					return {...chat, messages : [...chat.messages, {type : 'system', text : props.language.unknownCommand}]}
				else
					return chat
			}))
			document.getElementById('chatPrompt').value = ''
			return true
		}
		return false
	}

  const sendMessage = () => {
    let prompt = document.getElementById('chatPrompt')
    if (!isSpecialCommand(prompt.value)) {
      let message = {
        action : "message",
        item : {
          type : 'message',
          target : props.chanTag,
          text : prompt.value
        } 
      }
      props.socket.send(JSON.stringify(message))
      prompt.value = ''
    }
  }
	
	const leaveChan = e => {
		let tag = e.target.dataset.tag
		props.setChats(props.chats.filter(chat => chat.tag !== tag))
		if (props.chanTag === tag) {
			props.setChanTag('chat_general')
			props.setChanName('general')
		}
		props.socket.send(JSON.stringify({
    	  	action : 'leave_chat', 
    	  	item :{chat : tag}
    	}))
	}
    
	const captureKey = e => {
		if (e.keyCode === 13) {
			e.preventDefault()
			sendMessage()
		}
	}

	return (
        <div className={`h-100 ${props.xlg ? 'bg-dark-subtle' : 'bg-white'} d-flex flex-column`} style={{width: '300px', maxHeight: '100%'}}>
            <div className="d-flex justify-content-center py-2">
                <button 
					type='button' 
					className='nav-link' 
					data-bs-toggle='dropdown'>
						<h5 className="my-0 text-capitalize">
							<i>#</i> {props.chanName} {props.chats.length > 1 && <img src='/images/caret-down-fill.svg' alt='' />}
						</h5>
				</button>
				<ul className='dropdown-menu'>
					{props.chats.map(chat =>
						<li 
							onClick={() => {
								props.setChanTag(chat.tag)
								props.setChanName(chat.name)
							}}
							data-tag={chat.tag}
							data-name={chat.name} 
							key={chat.tag} 
							type='button' 
							className='px-2 fw-bold dropdown-item nav-link text-capitalize'>
								{chat.name}
						</li>
					)}
					{props.chats.length > 1 && 
						<li>
							<hr className="dropdown-divider" />
						</li>}
					{props.chats.length > 1 &&
						props.chats.map(chat =>
							<li 
								onClick={leaveChan} 
								key={chat.tag} 
								data-tag={chat.tag} 
								type='button' 
								className='px-2 fw-bold dropdown-item nav-link text-capitalize' 
								hidden={chat.tag === 'chat_general'}>
									{props.language.leave} "{chat.name}"
							</li>
						)
					}
				</ul>
            </div>
            <hr className="mx-5 mt-0 mb-2" />
            <div className="px-2 d-flex flex-column justify-content-end overflow-y-auto flex-grow-1" style={{maxWidth: '100%'}}>
					{props.chats.map(chat => { return <Channel key={chat.tag} props={props} chat={chat} />})}
            </div>
            <div className="w-100 ps-4 pe-5 pb-3 pt-2 align-self-end">
                <div className="d-flex gap-3 pt-1 row ps-3">
                    <div className="input-group p-0 m-0">
                        <span className="pt-1 me-2 m-0 border-0"><img src="/images/wechat.svg" alt="" /></span>
                        <input 
							onKeyDown={captureKey} 
							type="text" 
							name="chatPrompt" 
							id="chatPrompt" 
							className={`form-control ${props.xlg ? 'border-0' : 'border-1 border-black'} rounded`} 
							placeholder={props.myProfile ? props.language.chatIn : props.language.chatOut} 
							disabled={!props.myProfile || (props.chats[0].messages.length > 0 && props.chats[0].messages[props.chats[0].messages.length - 1].type === 'error')} />
                        <button 
							onClick={sendMessage} 
							className="pt-1 ms-2 nav-link" 
							disabled={!props.myProfile || (props.chats[0].messages.length > 0 && props.chats[0].messages[props.chats[0].messages.length - 1].type === 'error')}>
							<img src="/images/send.svg" alt="" />
						</button>
                      </div>                              
                </div>
            </div>
        </div>
    )
}

function Menu({props, id, name}) {

	const [profile, setProfile] = useState(undefined)

	if (!profile || profile.id !== id) {
		fetch('/profiles/' + id + '/').then(response => {
			if (response.status === 200)
				response.json().then(data => setProfile(data))
		})
	}

	if (!profile)
		return undefined

	let index = 1
	let menu = [
		<li key={index++} className='px-2'>{name}</li>,
		<li key={index++}><hr className="dropdown-divider" /></li>,
		<Link to={'/profile/' + id} key={index++} type='button' className='px-2 dropdown-item nav-link'>{props.language.seeProfile}</Link>
	]

	if (props.myProfile) {
		menu.push(<li onClick={() => props.setMuted([...props.muted, id])} key={index++} type='button' className='px-2 dropdown-item nav-link'>{props.language.mute}</li>)
		menu.push(<li onClick={() => Social.block(profile.id, props.myProfile, props.setMyProfile, props.language.delete1)} key={index++} type='button' className='px-2 dropdown-item nav-link'>{props.language.block}</li>)
		if (!props.myProfile.friends.includes(id))
			menu.push(<li onClick={() => Social.addFriend(profile.id, props.socket)} key={index++} type='button' className='px-2 dropdown-item nav-link'>{props.language.addFriend}</li>)
		else
			menu.push(<li onClick={() => Social.unfriend(profile.id, props.myProfile, props.setMyProfile, props.language.delete1)} key={index++} type='button' className='px-2 dropdown-item nav-link'>{props.language.removeFriend}</li>)
		if (profile.status === 'online') {
			menu.push(<li onClick={() => Social.directMessage(props.xlg, profile.name)} key={index++} type='button' className='px-2 dropdown-item nav-link'>{props.language.dm}</li>)
			if (!props.myProfile.pongChallengers.includes(id))
				menu.push(<li onClick={() => Social.challenge(profile.id, 'pong', props.chats, props.setChats, props.myProfile, props.setMyProfile, props.language.challenged)} key={index++} type='button' className='px-2 dropdown-item nav-link'>{props.language.challengePong}</li>)
			if (!props.myProfile.chessChallengers.includes(id))
				menu.push(<li onClick={() => Social.challenge(profile.id, 'chess', props.chats, props.setChats, props.myProfile, props.setMyProfile, props.language.challenged)} key={index++} type='button' className='px-2 dropdown-item nav-link'>{props.language.challengeChess}</li>)
		}
	}	

	return menu
}

function Channel({props, chat}) {

	const [menu, setMenu] = useState(undefined)

	useEffect(() => {
		const interval = setInterval(() => {
			if (document.getElementById(chat.tag) && chat.autoScroll) 
				document.getElementById(chat.tag).scrollTop = document.getElementById(chat.tag).scrollHeight
		}, 500)
		return () => clearInterval(interval)
	})

	function checkScrollDirectionIsUp(e) {
		if (e.wheelDelta) {
		  return e.wheelDelta > 0;
		}
		return e.deltaY < 0;
	  }

	const unScroll = e => {
		if (checkScrollDirectionIsUp(e))
			props.setChats(props.chats.map(item => {
				if (item.tag === chat.tag)
					return {...item, autoScroll : false}
				else
					return item
			}))
		}

	const toBottom = () => {
		document.getElementById(chat.tag).scrollTop = document.getElementById(chat.tag).scrollHeight
		props.setChats(props.chats.map(item => {
			if (item.tag === chat.tag)
				return {...item, autoScroll : true}
			else
				return item
		}))
	}

	const buildMenu = e => setMenu(<Menu props={props} id={parseInt(e.target.dataset.id, 10)} name={e.target.dataset.name} />)

	if (chat.messages.length > 0 && chat.messages[chat.messages.length - 1].type === 'error')
		return (
		<div key={chat.tag} hidden={props.chanTag !== chat.tag} style={{minHeight: '100%'}} className='fw-bold fs-3 d-flex align-items-center justify-content-center'>
			An error has occured
		</div>
		)

	let index = 1

	if (props.chanTag !== chat.tag)
		return undefined

	return (
		<>
			<div onWheel={unScroll} id={chat.tag} key={chat.tag} className='overflow-auto noScrollBar' style={{maxHeight: '100%'}}>
				<div className='text-primary'>{props.language.welcome1 + chat.name}</div>
				<div className="text-primary">{props.language.welcome2}</div>
				{chat.messages.map(message => {
					let id = parseInt(message.id, 10)
					if (message.type === 'help')
						return <Help key={index++} props={props} />
					if (message.type === 'mute')
						return <MuteList key={index++} props={props} />
					if (message.type === 'block')
						return <BlockList key={index++} props={props} />
					if (message.type === 'system') {
						if (message.subType === 'noUser')
							return <div key={index++} className='text-danger'>{message.name} : {props.language.noUser}</div>
						if (message.subType === 'dismissFriend')
							return <div key={index++} className='text-danger'>{message.name} {props.language.dismissed}</div>
						if (message.subType === 'acceptFriend')
							return <div key={index++} className='text-primary'>{message.name} {props.language.accepted}</div>
						if (message.subType === 'friendRequest')
							return <div key={index++} className='text-primary'>{message.name} {props.language.friendRequest}</div>
						if (message.subType === 'blocked')
							return <div key={index++} className='text-danger'> {message.name} {props.language.blocked}<br/></div>
						if (message.subType === 'requested')
							return <div key={index++} className='text-danger'>{props.language.requested} {message.name}<br/></div>
						if (message.subType === 'unavailable')
							return <div key={index++} className='text-danger'>{message.name} is playing with someone else.</div>
						if (message.subType === 'invitation')
							return <div key={index++} className='text-primary'>{message.name} invited you to play</div>
						if (message.subType === 'isOffline')
							return <div key={index++} className='text-danger'>{message.name} {props.language.isOffline}</div>
						if (message.subType === 'unfriended')
							return <div key={index++} className='text-danger'>{message.name} {props.language.unfriended}</div>
					}
					if ((message.type === 'whisp' || message.type === 'message') && !props.muted.includes(message.id) && (!props.myProfile || !props.myProfile.blocked.includes(id)))
						return (
						<div key={index++}>
							<button 
								onClick={buildMenu} 
								data-id={id} 
								data-name={message.name} 
								type='button' 
								data-bs-toggle='dropdown' 
								className={`nav-link d-inline ${props.myProfile && props.myProfile.id === id ? 'text-danger' : 'text-primary'}`} 
								disabled={props.myProfile && props.myProfile.id === id}>
									{message.type === 'message' && props.myProfile && id === props.myProfile.id && 'You'}
									{message.type === 'message' && (!props.myProfile || id !== props.myProfile.id) && message.name}
									{message.type === 'whisp' && props.myProfile && id === props.myProfile.id && 'To ' + message.target}
									{message.type === 'whisp' && id !== props.myProfile.id && message.name}
							</button> 
							{' :'} <span style={{color : message.type === 'whisp' ? '#107553' : '#000000'}}> {message.text}</span>
							<ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>{menu}</ul>
						</div>)
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

function MuteList({props}) {

	const [users, setUsers] = useState([])

	const newUser = id => {
		fetch('/profiles/chatList/' + id + '/').then(response => {
			if (response.status === 200)
				response.json().then(data => setUsers([...users, data]))
		})
	}

	if (users.length < props.muted.length)
		newUser(props.muted[users.length])

	let index = 1

	return (
		<div className='p-1 m-1 border border-2 border-primary rounded' style={{width : '90%'}}>
			<div className='text-primary'>{props.language.mutedList} :</div>
			{users && users.length === 0 ?
			<div className='text-primary'>{props.language.noMuted}</div> :
			users.map(user => {
				return (
					<div key={index++}>
						<button type='button' data-bs-toggle='dropdown' className='nav-link text-primary'>{user.name}</button>
						<ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>
							<li key='a' className='px-2'>{user.name}</li>
							<li key='b'><hr className="dropdown-divider" /></li>
							<li key='c' onClick={() => {
								props.setMuted(props.muted.filter(muted => muted !== user.id))
								setUsers(users.filter(item => item.id !== user.id))
							}} 
							type='button' 
							className='px-2 dropdown-item nav-link'>
								{props.language.unMute}
							</li>
						</ul>
					</div>
				)
			})}
		</div>
	)
}

function BlockList({props}) {

	const [users, setUsers] = useState([])

	const newUser = id => {
		fetch('/profiles/chatList/' + id + '/').then(response => {
			if (response.status === 200)
				response.json().then(data => setUsers([...users, data]))
		})
	}

	if (props.myProfile && users.length < props.myProfile.blocked.length)
		newUser(props.myProfile.blocked[users.length])

	let index = 1

	return (
		<div className='p-1 m-1 border border-2 border-primary rounded' style={{width : '90%'}}>
			<div className='text-primary'>{props.language.blockedList} :</div>
			{users && users.length === 0 ?
			<div className='text-primary'>{props.language.noBlocked}</div> :
			users.map(user => {
				return (
					<div key={index++}>
						<button type='button' data-bs-toggle='dropdown' className='nav-link text-primary'>{user.name}</button>
						<ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>
							<li key='a' className='px-2'>{user.name}</li>
							<li key='b'><hr className="dropdown-divider" /></li>
							<li key='c' onClick={() => Social.unblock(user.id, props.myProfile, props.setMyProfile, users, setUsers)}
							type='button'
							className='px-2 dropdown-item nav-link'>
								{props.language.unblock}
							</li>
						</ul>
					</div>
				)
			})}
		</div>
	)
}

function Help({props}) {

	return (
		<div className='p-1 m-1 border border-2 border-primary rounded' style={{width : '90%'}}>
			<div className='text-primary'>{props.language.helpWhisp}</div>
			<div className='text-primary'>{props.language.helpMute}</div>
			<div className='text-primary'>{props.language.helpBlock}</div>
			<div className='text-primary'>{props.language.help}</div>
		</div>
	)

}
