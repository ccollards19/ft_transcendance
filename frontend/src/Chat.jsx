import React from 'react'
import { useState } from 'react'
// import { useEffect } from 'react'

function Chat({ props }) {

	const [chan, setChan] = useState('general')
	// const [messages, setMessages] = useState([]);

	// useEffect(() => {
	// 	let url = chan === 'match' ? 'match='.concat(props.myProfile.match) : 'general'
	// 	const socket = new WebSocket('ws://localhost?'.concat(url))
	// 	socket.onopen = () => {
	// 		document.getElementById.append(
	// 			<div>Welcome in the chat</div>
	// 		);
	// 	  };
		
	// 	  socket.onmessage = (event) => {
	// 		const receivedMessage = JSON.parse(event.data);
	// 		setMessages([...messages, receivedMessage]);
	// 	  };
	// 	return () => {socket.close();};
	// }, [chan, messages, props.myProfile.match]);

    // const sendMessage = () => {
	// 	let prompt = document.getElementById('chatPrompt') 
	// 	if (prompt.value.trim !== '') {
	// 		let message = {
	// 			id : props.myProfile.id,
	// 			name : props.myProfile.name,
	// 			text : prompt.value
	// 		}
	// 		socket.send(JSON.stringify(message));
	// 	}
    //     prompt.value = prompt.value.startsWith('/w "') ? prompt.value.substring(0, prompt.value.indexOf('"', 4) + 2) :  ''
    // }
	const toggleChan = (e) => setChan(e.target.dataset.chan)
    // const captureKey = (e) => e.keyCode === 13 && sendMessage()

	return (
        <div className={`h-100 ${props.xlg ? 'bg-dark-subtle' : 'bg-white'} d-flex flex-column`} style={{minWidth: '300px'}}>
            <div className="d-flex justify-content-center py-2">
                <button type='button' className='nav-link' data-bs-toggle='dropdown' disabled={props.myProfile.match === 0}><h5 className="my-0 text-capitalize"><i>#</i> {chan} {props.myProfile.match !== 0 && <img src='/images/caret-down-fill.svg' alt='' />}</h5></button>
				<ul className='dropdown-menu'>
					<li onClick={toggleChan} data-chan='general' type='button' className='ps-2 fw-bold dropdown-item nav-link'>General</li>
					<li onClick={toggleChan} data-chan='match' type='button' className='ps-2 fw-bold dropdown-item nav-link'>Match</li>
				</ul>
            </div>
            <hr className="mx-5 mt-0 mb-2" />
            <div id='chatContent' className="w-100 px-2 d-flex flex-column justify-content-end overflow-y-auto flex-grow-1">
                {/* <ChatContent props={props} chan={chan} /> */}
            </div>
            <hr className="mx-5 mt-2 mb-2" />
            <div className="w-100 ps-4 pe-5 pb-3 pt-2 align-self-end">
                <div className="d-flex gap-3 pt-1 row ps-3">
                    <div className="input-group p-0 m-0">
                        <span className="pt-1 me-2 m-0 border-0"><img src="/images/wechat.svg" alt="" /></span>
                        <input type="text" name="chatPrompt" id="chatPrompt" className={`form-control ${props.xlg ? 'border-0' : 'border-1 border-black'} rounded`} placeholder={props.myProfile !== 'none' ? 'Say something nice' : 'Log in to chat'} disabled={props.myProfile === 'none'} />
                        <button className="pt-1 ms-2 nav-link"><img src="/images/send.svg" alt="" /></button>
                      </div>                              
                </div>
            </div>
        </div>
    )
}

// function ChatContent({ props, chan }) {

// 	useEffect(() => {
// 		let url = chan === 'match' ? 'match='.concat(props.myProfile.match) : 'general'
// 		const socket = new WebSocket('localhost?'.concat(url))
// 		socket.onopen = () => {
// 			console.log('WebSocket connection established.');
// 		  };
		
// 		  socket.onmessage = (event) => {
// 		  };
// 		return () => {socket.close();};
// 	}, [chan, props.myProfile.match]);
// }

export default Chat