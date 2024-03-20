import { useState, useEffect } from 'react'
import { unmountComponentAtNode } from 'react-dom'

function Chat({ props }) {

    const sendMessage = () => {
		let prompt = document.getElementById('chatPrompt')
		if (prompt.value.trim !== '') {
			let message = {
				id : props.myProfile.id,
				name : props.myProfile.name,
				text : prompt.value,
				target : prompt.value.startsWith('/w "') ? 'whisp' : props.chan
			}
			// socket.send(JSON.stringify(message));
		}
		if (prompt.value === 'close') {
			unmountComponentAtNode(document.getElementById(props.chan))
			// props.channels.splice(props.channels.findIndex((element) => element.props.id === chan))
		}
        prompt.value = prompt.value.startsWith('/w "') ? prompt.value.substring(0, prompt.value.indexOf('"', 4) + 2) :  ''
    }
	const toggleChan = (e) => props.setChan(e.target.dataset.chan)
    const captureKey = (e) => e.keyCode === 13 && sendMessage()

	return (
        <div className={`h-100 ${props.xlg ? 'bg-dark-subtle' : 'bg-white'} d-flex flex-column`} style={{minWidth: '300px'}}>
            <div className="d-flex justify-content-center py-2">
                <button type='button' className='nav-link' data-bs-toggle='dropdown' disabled={props.myProfile.match !== 0}><h5 className="my-0 text-capitalize"><i>#</i> {props.chan} {props.myProfile.match === 0 && <img src='/images/caret-down-fill.svg' alt='' />}</h5></button>
				<ul className='dropdown-menu'>
					<li onClick={toggleChan} data-chan='general' type='button' className='ps-2 fw-bold dropdown-item nav-link'>General</li>
					<li onClick={toggleChan} data-chan='match' type='button' className='ps-2 fw-bold dropdown-item nav-link'>Match</li>
				</ul>
            </div>
            <hr className="mx-5 mt-0 mb-2" />
            <div id='chatContent' className="w-100 px-2 d-flex flex-column justify-content-end overflow-y-auto flex-grow-1">
				{props.channels}
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

export function Channel ({chan}, id) {

	const [messages, setMessages] = useState([id])

	useEffect(() => {
		const socket = new WebSocket('ws://localhost?'.concat(id))
		socket.onopen = () => {
			document.getElementById(id).append(
				<div>Welcome in the {id} chat</div>
			);
		  };
		
		  socket.onmessage = (event) => {
			const receivedMessage = JSON.parse(event.data);
			setMessages([...messages, receivedMessage]);
		  };
		return () => {
			console.log('close');
			socket.close();
		};
	}, [id, messages]);

	return <div id={id} key={id} className={`${id !== chan && 'd-none'}`}>
		{messages.map((message) => 
			<div key={message}>{message}</div>
		)}
	</div>
}

export default Chat