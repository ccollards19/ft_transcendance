import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

export default function Match({props}) {

	const [match, setMatch] = useState(undefined)
	const [opponent, setOpponent] = useState(undefined)
	const navigate = useNavigate()

	const matchId = parseInt(useParams().room, 10)

	useEffect(() => {
		if (!props.myProfile)
			navigate('/')
		else if (props.myProfile && props.myProfile.playing) {
			let xhr = new XMLHttpRequest()
			xhr.open('GET', '/game/room/' + props.myProfile.match)
			xhr.onload = () => navigate('/game/' + JSON.parse(xhr.response.game.name) + '/' + props.myProfile.match)
			xhr.send()
		}
		if (props.myProfile && !props.myProfile.playing && !match && !isNaN(matchId)) {
			let xhr = new XMLHttpRequest()
			xhr.open('GET', '/game/room/' + matchId)
			xhr.onload = () => {
				let response = JSON.parse(xhr.response)
				setOpponent(response.player1.id === props.myProfile.id ? response.player2 : response.player1)
				setMatch(response)
			}
			xhr.send()
		}
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data.item)
			else if (data.action === 'chat')
				props.socket.onChat(data)
			else if (data.action === 'hack')
				props.setHack(true)
			else if (data.action === 'start') {
				props.socket.send(JSON.stringify({
					component : 'match',
					action : 'startMatch',
					item : {match : matchId}
				}))
				navigate('/game/' + match.game.name + '/' + matchId)
			}
		}
	}, [props, props.socket, props.socket.onmessage, props.myProfile, matchId, navigate, match])

	if (isNaN(matchId))
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
		let xhr = new XMLHttpRequest()
		xhr.open('GET', '/game/room/' + matchId + '/delete/')
		xhr.onload = () => {
			if (xhr.status === 200) {
				props.setMyProfile({...props.myProfile, match : 0})
				navigate('/')
			}
		}
		xhr.send()
	}

	if (!match)
		return undefined
	
	let host = match.player1.id === props.myProfile.id

	return (
		<div style={props.customwindow}>
			<div className='d-flex justify-content-center align-items-center w-100' style={{height : '90%'}}>
				<div className={`d-flex flex-grow-1 align-items-center justify-content-between`} style={{height: '80%'}}>
        		    <div className={`border border-black border-3 rounded d-flex justify-content-center align-items-center`} style={{height: props.xxlg ? '100%' : '60%', width: '50%'}}>
						<div className="d-flex flex-column align-items-center">
							<img src={'/images/'.concat(host ? props.myProfile.avatar : opponent.avatar)} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{host ? props.myProfile.name : opponent.name}</span>
							<span className="d-flex gap-2 mt-3 fw-bold" style={{height : '35px'}}>
								{host &&
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
							<img src={'/images/'.concat(!host ? props.myProfile.avatar : opponent.avatar)} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{!host ? props.myProfile.name : opponent.name}</span>
							<span className="d-flex gap-2 mt-3 fw-bold" style={{height : '35px'}}>
								{host &&
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

