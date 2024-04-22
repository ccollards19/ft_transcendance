import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

export default function Match({props}) {

	const [match, setMatch] = useState(useParams().match)
	const navigate = useNavigate()

	useEffect(() => {
		if (!props.myProfile)
			navigate('/')
		else if (props.myProfile && props.myProfile.match > 0)
			navigate('/game/' + props.myProfile.match)
	})

	const host = useParams().match === 'new'
	const opponent = {id : parseInt(useParams().id, 10), name : useParams().name, avatar : useParams().avatar}
	const game = useParams().game

	if (match === 'new') {
		let xhr = new XMLHttpRequest()
		xhr.open('POST', '/game/room/create/')
		xhr.onload = () => setMatch(xhr.response)
		xhr.send({game : game, player1 : props.myProfile.id, player2 : opponent.id})
	}

	useEffect(() => {
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
			else if (data.player1 && data.player2) {
				let xhr = new XMLHttpRequest()
				xhr.open('POST', '/api/user/' + props.myProfile.id + '/')
				xhr.onload = () => navigate('/game/' + match)
				xhr.send()
			}
		}
	}, [props.socket, props.myProfile, match, navigate, game])

	const setReady = e => props.socket.send(JSON.stringify({match : match, player : (host ? 1 : 2), ready : e.target.checked}))

	const cancelGame = () => {
		props.socket.send(JSON.stringify({match : match, action : 'cancel'}))
		navigate('/play')
	}

	return (
		<div style={props.customwindow}>
			<div className='d-flex justify-content-center align-items-center w-100' style={{height : '90%'}}>
				<div className={`d-flex flex-grow-1 align-items-center justify-content-between`} style={{height: '80%'}}>
        		    <div className={`border border-black border-3 rounded d-flex justify-content-center align-items-center`} style={{height: props.xxlg ? '100%' : '60%', width: '50%', transform: props.xxlg ? 'rotate(0deg)' : 'rotate(90deg)'}}>
						<div className="d-flex flex-column align-items-center">
							<img src={'/images/'.concat(host ? props.myProfile.avatar : opponent.avatar)} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{host ? props.myProfile.name : opponent.name}</span>
							<span className="d-flex gap-2 mt-3 fw-bold" style={{height : '35px'}}>
								{host &&
									<>
										<input onClick={setReady} className="form-check-input" type="checkbox" name="player1" id="player1" />
										<label className="form-check-label" htmlFor="ready1">Ready ?</label>
									</>
								}
							</span>
						</div>
					</div>
        		    <img src="/images/versus.png" className="mx-3" alt="" style={{height: '150px',width: '100px'}} />
        		    <div className={`border border-black border-3 rounded d-flex justify-content-center align-items-center`} style={{height: props.xxlg ? '100%' : '60%', width: '50%', transform: props.xxlg ? 'rotate(0deg)' : 'rotate(-90deg)'}}>
						<div className="d-flex flex-column align-items-center">
							<img src={'/images/'.concat(!host ? props.myProfile.avatar : opponent.avatar)} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{!host ? props.myProfile.name : opponent.name}</span>
							<span className="d-flex gap-2 mt-3 fw-bold" style={{height : '35px'}}>
								{!host &&
									<>
										<input onClick={setReady} className="form-check-input" type="checkbox" name="player2" id="player2" />
										<label className="form-check-label" htmlFor="ready1">Ready ?</label>
									</>
								}
							</span>
						</div>
					</div>
        		</div>
			</div>
			<div className="mt-3 d-flex gap-2 justify-content-center">
                <button onClick={cancelGame} type="button" className="btn btn-danger">Cancel match</button>
            </div>
		</div>
	)

}

