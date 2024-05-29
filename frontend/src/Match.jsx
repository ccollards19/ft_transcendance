import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

export default function Match({props}) {

	const [room, setRoom] = useState(undefined)
	const navigate = useNavigate()

	const roomId = parseInt(useParams().room, 10)

	useEffect(() => {
		if (!props.myProfile)
			navigate('/')
		else if (props.myProfile && props.myProfile.playing) {
			fetch('/game/room/getGame/').then(response => {
				if (response.status === 200) {
					response.json().then(game => navigate('/game/' + game + '/' + props.myProfile.room))
				}
			})
		}
		if (props.myProfile && !props.myProfile.playing && !room && !isNaN(roomId)) {
			fetch('/game/room/' + roomId + '/').then(response => {
				if (response.status === 404)
					props.setMyProfile({...props.myprofile, room : 0})
				else if (response.status === 200) {
					response.json().then(data => setRoom(data))
				}
			})
		}
	}, [roomId, navigate, room])

	if (isNaN(roomId))
		props.setHack(true)

	if (!props.xlg)
		return <div className="d-flex text-center justify-content-center align-items-center fw-bold fs-1" style={props.customwindow}>{props.language.smallScreen}</div>

	const setReady = e => 
		props.socket.send(JSON.stringify({
			component : 'match',
			action : 'ready',
			item : {status : e.target.checked}
		}))

	const cancelGame = () => {
		let otherPlayerId = room.player1.id === props.myProfile.id ? room.player1.id : room.player2.id
		fetch('/game/cancel/' + props.myProfile.room + '/' + otherPlayerId + '/', {method : 'POST'}).then(response => {
			if (response.status === 200) {
				props.setMyProfile({...props.myprofile, room : 0})
				navigate('/play')
			}
		})
	}

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
								{room.player1.id === props.myProfile.id &&
									<>
										<input onClick={setReady} className="form-check-input" type="checkbox" name="player1" id="player1" />
										<label className="form-check-label" htmlFor="ready1">{props.language.ready} ?</label>
									</>
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
								{room.player2.id === props.myProfile.id &&
									<>
										<input onClick={setReady} className="form-check-input" type="checkbox" name="player2" id="player2" />
										<label className="form-check-label" htmlFor="ready1">{props.language.ready} ?</label>
									</>
								}
							</span>
						</div>
					</div>
        		</div>
			</div>
			<div className="mt-3 d-flex gap-2 justify-content-center">
                <button onClick={cancelGame} type="button" className="btn btn-danger">{props.language.cancel}</button>
            </div>
		</div>
	)

}

