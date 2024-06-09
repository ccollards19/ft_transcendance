import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function PongRemote({props, socket, room}) {

	const [winner, setWinner] = useState(0)

	const navigate = useNavigate()

	const reset = () => {
		document.getElementById('scorePlayer1').innerHTML = 0
		document.getElementById('scorePlayer2').innerHTML = 0
		document.getElementById('startSign').hidden = false
		setWinner(0)
	}

	return (
		<div className="w-100 h-100 d-flex flex-column">
			<div className="w-100 d-flex justify-content-between pt-3 px-3">
				<div className="d-flex gap-3 align-items-center" style={{maxWidth : '35%'}}>
					<img type='button' title={props.language.seeProfile} onClick={() => navigate('/profile/' + room.player1.id)} src={room.player1.avatar} className="rounded-circle" alt="" style={{width : '100px', height : '100px'}} />
					{props.lg && <span className="fw-bold fs-4 bg-dark text-white rounded p-2">{room.player1.catchphrase}</span>}
				</div>
				<div className="d-flex gap-3 align-items-center" style={{maxWidth : '35%'}}>
					{props.lg && <span className="fw-bold fs-4 bg-dark text-white rounded p-2">{room.player2.catchphrase}</span>}
					<img type='button' title={props.language.seeProfile} onClick={() => navigate('/profile/' + room.player2.id)} src={room.player2.avatar} className="rounded-circle" alt="" style={{width : '100px', height : '100px'}} />
				</div>
			</div>
			<div className="d-flex justify-content-center align-items-center w-100 h-100 position-relative">
				<div id='startSign' className="rounded border border-2 border-white p-2 bg-dark-subtle fw-bold fs-1 position-absolute" style={{zIndex : '2'}} hidden={false}>{props.language.pressStart}</div>
				{winner > 0 ?
				<div className="w-100 d-flex justify-content-center align-items-center pb-5" style={{height : 'calc(100% - 60px)', zIndex : '2'}}>
					<div className="game-over d-flex flex-column justify-content-center align-items-center mt-3 p-5 gap-2 bg-dark-subtle w-50 rounded border border-2 border-black">
						<span className={`fw-bold ${props.md ? 'fs-2' : 'fs-6'}`}>{props.language.gameOver}</span>
						<span className={`fw-bold ${props.md ? 'fs-2' : 'fs-6'}`}>{props.language.winner} : {props.language.player} {winner}</span>
						<span className="fw-bold fs-4">{props.language.rematch}</span>
						<div className="button-group d-flex gap-3">
							<button onClick={reset} type='button' className="btn btn-success p-2">{props.language.yes}</button>
							<button onClick={() => navigate('/')} type='button' className="btn btn-danger p-2">{props.language.no}</button>
						</div>
					</div>
				</div> :
				<PongCanvasRemote setWinner={setWinner} socket={socket} />}
			</div>
		</div>
	)

}

function PongCanvasRemote({setWinner, socket}) {}