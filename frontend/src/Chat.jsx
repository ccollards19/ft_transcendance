import { useState, useEffect } from 'react'
import { displayNewWindow } from './other'

function Chat({ props }) {

    const sendMessage = () => {
		let prompt = document.getElementById('chatPrompt')
		let isWhisp = prompt.value.startsWith('/w "') && prompt.value[4] !== ' ' && prompt.value[4] !== '"'
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
			// props.sockets[props.chan].send(JSON.stringify(message))
		}
        prompt.value = isWhisp ? prompt.value.substring(0, prompt.value.indexOf('"', 4) + 2) :  ''
    }
	const toggleChan = (e) => {
		document.getElementById(props.chan).classList.add('d-none')
		document.getElementById(e.target.dataset.chan).classList.remove('d-none')
		props.setChan(e.target.dataset.chan)
	}
	const leaveChan = (e) => {
		props.setChanList(props.chanList.filter(chan => chan !== e.target.dataset.chan))
		document.getElementById('general').classList.remove('d-none')
		props.setChan('general')
	}
    const captureKey = (e) => e.keyCode === 13 && sendMessage()

	let chanIndex = 1

	return (
        <div className={`h-100 ${props.xlg ? 'bg-dark-subtle' : 'bg-white'} d-flex flex-column`} style={{width: '300px', maxHeight: '100%'}}>
            <div className="d-flex justify-content-center py-2">
                <button type='button' className='nav-link' data-bs-toggle='dropdown'><h5 className="my-0 text-capitalize"><i>#</i> {props.chan} {props.chanList.length > 1 && <img src='/images/caret-down-fill.svg' alt='' />}</h5></button>
				<ul className='dropdown-menu'>
					{props.chanList.map((chan) =>
						<li onClick={toggleChan} key={chan} data-chan={chan} type='button' className='px-2 fw-bold dropdown-item nav-link text-capitalize'>{chan}</li>
					)}
					{props.chanList.length > 1 && <li><hr className="dropdown-divider" /></li>}
					{props.chanList.length > 1 &&
						props.chanList.map((chan) =>
							<li onClick={leaveChan} key={chanIndex++} data-chan={chan} type='button' className='px-2 fw-bold dropdown-item nav-link text-capitalize' hidden={chan === 'general'}>Leave {chan}</li>
						)
					}
				</ul>
            </div>
            <hr className="mx-5 mt-0 mb-2" />
            <div id='chatContent' className="px-2 d-flex flex-column justify-content-end overflow-y-auto flex-grow-1" style={{maxWidth: '100%'}}>
				{props.chanList.map((channel) => { 
					return <Channel key={chanIndex++} props={props} name={channel} /> 
				})}
            </div>
            <hr className="mx-5 mt-2 mb-2" />
            <div className="w-100 ps-4 pe-5 pb-3 pt-2 align-self-end">
                <div className="d-flex gap-3 pt-1 row ps-3">
                    <div className="input-group p-0 m-0">
                        <span className="pt-1 me-2 m-0 border-0"><img src="/images/wechat.svg" alt="" /></span>
                        <input onKeyDown={captureKey} type="text" name="chatPrompt" id="chatPrompt" className={`form-control ${props.xlg ? 'border-0' : 'border-1 border-black'} rounded`} placeholder={props.myProfile !== 'none' ? 'Say something nice' : 'Log in to chat'} disabled={props.myProfile === 'none'} />
                        <button onClick={sendMessage} className="pt-1 ms-2 nav-link"><img src="/images/send.svg" alt="" /></button>
                      </div>                              
                </div>
            </div>
        </div>
    )
}

export function Channel({props, name}) {

	const [messages, setMessages] = useState([])
	const [menu, setMenu] = useState([<li type='button' className='ps-2 dropdown-item nav-link'>See profile</li>])
	const chanName = name

	if (messages.length === 0 && name === 'general') {
		var request = new XMLHttpRequest()
		request.open('GET', '/data/sampleChat.json')
		request.responseType = 'json'
		request.send()
		request.onload = () => {setMessages(request.response)}
	}

	useEffect(() => {
		const socket = new WebSocket('ws://ws/chat/'.concat(name))
		socket.onopen = () => {
			setMessages([...messages, 'Welcome to the ' + name + ' channel'])
			props.setSockets([...props.sockets, {name : socket}])
		}
		
		  socket.onmessage = (event) => {
			const receivedMessage = JSON.parse(event.data);
			setMessages([...messages, receivedMessage]);
			document.getElementById(chanName).scrollTop = document.getElementById(chanName).scrollHeight
		  };
		return () => socket.close()
	}, [messages, chanName, name, props])

	const seeProfile = (e) => {
		let id = parseInt(e.target.dataset.id, 10)
		props.setProfileId(id)
		displayNewWindow({props}, 'Profile', 0)
	}

	const createMenu = (e) => {
		let id = parseInt(e.target.dataset.id, 10)
		let menuIndex = 1
		let menu = [[<li key={menuIndex++} onClick={seeProfile} data-id={id} type='button' className='px-2 dropdown-item nav-link'>See profile</li>]]
		if (props.myProfile !== 'none') {
			menu.push(<li key={menuIndex++} data-id={id} type='button' className='px-2 dropdown-item nav-link'>Direct message</li>)
			menu.push(<li key={menuIndex++} data-id={id} type='button' className='px-2 dropdown-item nav-link'>Mute</li>)
			if (!props.myProfile.friends.includes(id))
				menu.push(<li key={menuIndex++} data-id={id} type='button' className='px-2 dropdown-item nav-link'>Add to friendlist</li>)
			else
				menu.push(<li key={menuIndex++} data-id={id} type='button' className='px-2 dropdown-item nav-link'>Remove from friendlist</li>)
			if (!props.myProfile[props.game].challenged.includes(id))
				menu.push(<li key={menuIndex++} data-id={id} type='button' className='px-2 dropdown-item nav-link'>Challenge to <span className='text-capitalize'>{props.game}</span></li>)
		}
		setMenu(menu)
	}

	let index = 1

	return (
		<div id={name} key={name} className='overflow-auto noScrollBar' style={{maxHeight: '100%'}}>
			<p className='text-primary'>
				HOW TO USE :
				<br />
				'/w' "[username]" to send a direct message
				<br />
				'/m' to display muted users
				<br />
				'/h' to display this help
			</p>
			{messages.map((message) => 
				props.myProfile !== 'none' && !props.myProfile.muted.includes(parseInt(message.id, 10)) &&
				<div key={index++}>
					<button onClick={createMenu} data-id={message.id} type='button' data-bs-toggle='dropdown' className={`nav-link d-inline text-primary`}>{message.name}</button> 
					<span className={`${message.whisp && 'text-success'}`}> : {message.text}</span>
					<ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>{menu}</ul>
				</div>
			)}
		</div>
	)
}

export default Chat