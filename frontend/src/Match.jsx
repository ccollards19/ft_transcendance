import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Match({props}) {

	const [room, setRoom] = useState(undefined)
	const [socket, setSocket] = useState(undefined)
	const navigate = useNavigate()

	useEffect(() => {
		if (!props.myProfile)
			navigate('/')
		else if (props.myProfile && !props.myProfile.room)
			navigate('/play')
		else if (props.myProfile && props.myProfile.playing) {
			fetch('/game/myRoom/').then(response => {
				if (response.status === 200)
					response.json().then(data => navigate('/game/' + data.id))
			})
		}
		else if (props.myProfile && !props.myProfile.playing && !room && !socket) {
			fetch('/game/myRoom/').then(response => {
				if (response.status === 404)
					props.setMyProfile({...props.myProfile, room : undefined})
				else if (response.status === 200) {
					response.json().then(data => {
						if (data.player1Ready && data.player2Ready) {
							props.setMyProfile({...props.myProfile, playing : true})
							navigate('/game/' + data.id)
						}
						else {
							setSocket(new WebSocket("ws://" + window.location.host + "/ws/room/" + data.id + '/'))
							setRoom(data)
						}
					})
				}
			})
		}
		else if (socket) {
			socket.onmessage = e => {
				let data = JSON.parse(e.data)
				if (data.action === 'updateReadyStatus' && document.getElementById('otherPlayerStatus'))
					document.getElementById('otherPlayerStatus').innerHTML = data.status ? props.language.ready : props.language.notReady
				else if (data.action === 'startMatch') {
					props.setMyProfile({...props.myProfile, playing : true})
					navigate('/game/' + room.id)
				}
				else if (data.action === 'cancelled') {
					props.setChats(props.chats.map(chat => { return {...chat, messages : [...chat.messages, {
						type : 'system', 
						subType : 'cancelled',
						name : data.name
					}]} }))
					props.setMyProfile({...props.myProfile, room : undefined})
				}
			}
		}
		return () => {
			if (socket)
				socket.close()
		}
	}, [navigate, room, socket, props])

	if (room && !socket)
		return <div className="d-flex text-center justify-content-center align-items-center fw-bold fs-1" style={props.customwindow}>You shouldn't be here</div>

	if (!props.xlg)
		return <div className="d-flex text-center justify-content-center align-items-center fw-bold fs-1" style={props.customwindow}>{props.language.smallScreen}</div>

	if (!room)
		return undefined

	const cancel = () => {
		socket.send(JSON.stringify({action : 'cancel', item : {}}))
		props.setMyProfile({...props.myProfile, room : undefined})
		socket.close(1000)
	}

	return (
		<div style={props.customwindow}>
			<div className='d-flex justify-content-center align-items-center w-100' style={{height : '90%'}}>
				<div className={`d-flex flex-grow-1 align-items-center justify-content-between`} style={{height: '80%'}}>
        		    <div className={`border border-black border-3 rounded d-flex justify-content-center align-items-center`} style={{height: props.xxlg ? '100%' : '60%', width: '50%'}}>
						<div className="d-flex flex-column align-items-center">
							<img src={room.player1.avatar} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{room.player1.name}</span>
							<span className="d-flex gap-2 mt-3 fw-bold" style={{height : '35px'}}>
								{room.player1.id === props.myProfile.id ?
									<>
										<input onClick={e => socket.send(JSON.stringify({action : 'setReady', status : e.target.checked}))} className="form-check-input" type="checkbox" name="player1" id="player1" />
										<label className="form-check-label" htmlFor="ready1">{props.language.ready} ?</label>
									</> :
									<span id='otherPlayerStatus'></span>
								}
							</span>
						</div>
					</div>
        		    <img src="/images/versus.png" className="mx-3" alt="" style={{height: '150px',width: '100px'}} />
        		    <div className={`border border-black border-3 rounded d-flex justify-content-center align-items-center`} style={{height: props.xxlg ? '100%' : '60%', width: '50%'}}>
						<div className="d-flex flex-column align-items-center">
							<img src={room.player2.avatar} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{room.player2.name}</span>
							<span className="d-flex gap-2 mt-3 fw-bold" style={{height : '35px'}}>
								{room.player2.id === props.myProfile.id ?
									<>
										<input onClick={e => socket.send(JSON.stringify({action : 'setReady', status : e.target.checked}))} className="form-check-input" type="checkbox" name="player2" id="player2" />
										<label className="form-check-label" htmlFor="ready1">{props.language.ready} ?</label>
									</> : 
									<span id='otherPlayerStatus'></span>
								}
							</span>
						</div>
					</div>
        		</div>
			</div>
			<div className="mt-3 d-flex gap-2 justify-content-center">
                <button onClick={cancel} type="button" className="btn btn-danger">{props.language.cancel}</button>
            </div>
		</div>
	)

}

