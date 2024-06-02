import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

export default function Match({props}) {

	const [room, setRoom] = useState(undefined)
	const [socket, setSocket] = useState(undefined)
	const navigate = useNavigate()

	const roomId = parseInt(useParams().room, 10)

	useEffect(() => {
		if (!props.myProfile)
			navigate('/')
		else if (props.myProfile && props.myProfile.playing) {
			socket.close()
			if (room)
				navigate('/game/' + room.game.name + '/' + props.myProfile.room)
			else {
				fetch('/game/room/getGame/').then(response => {
					if (response.status === 200) {
						response.json().then(game => navigate('/game/' + game + '/' + props.myProfile.room))
					}
				})
			}
		}
		else if (props.myProfile && !props.myProfile.room) {
			socket.close()
			navigate('/play')
		}
		else if (props.myProfile && !props.myProfile.playing && !room && !isNaN(roomId) && !socket) {
			fetch('/game/room/' + roomId + '/').then(response => {
				if (response.status === 404)
					props.setMyProfile({...props.myprofile, room : 0})
				else if (response.status === 200) {
					setSocket(new WebSocket("ws://localhost/ws/room/" + roomId + '/'))
					response.json().then(data => setRoom(data))
				}
			})
		}
		else if (socket) {
			socket.onmessage = e => {
				let data = JSON.parse(e.data)
				if (data.action === 'updateReadyStatus')
					document.getElementById('otherPlayerStatus').innerHTML = data.status ? props.language.ready : props.language.notReady
				else if (data.action === 'startMatch')
					props.setMyProfile({...props.myProfile, playing : true})
				else if (data.action === 'cancel' || data.action === 'dismiss') {
					props.setChats(props.chats.map(chat => { return {...chat, messages : [...chat.messages, {type : 'system', subType : data.action, name : room.player2.name}]} }))
					props.setMyProfile({...props.myProfile, room : undefined})
				}
			}
			socket.onclose = () => setSocket(undefined)
		}
	}, [roomId, navigate, room, socket, props])

	if (isNaN(roomId))
		props.setHack(true)

	if (room && !socket)
		return <div className="d-flex text-center justify-content-center align-items-center fw-bold fs-1" style={props.customwindow}>You shouldn't be here</div>

	if (!props.xlg)
		return <div className="d-flex text-center justify-content-center align-items-center fw-bold fs-1" style={props.customwindow}>{props.language.smallScreen}</div>

	if (!room)
		return undefined

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
                <button onClick={() => socket.send(JSON.stringify({action : 'cancel'}))} type="button" className="btn btn-danger">{props.language.cancel}</button>
            </div>
		</div>
	)

}

