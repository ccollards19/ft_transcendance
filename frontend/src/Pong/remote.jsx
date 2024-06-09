import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function PongLocal({props}) {

	const [winner, setWinner] = useState(0)

	const navigate = useNavigate()

	const reset = () => {
		document.getElementById('scorePlayer1').innerHTML = 0
		document.getElementById('scorePlayer2').innerHTML = 0
		setWinner(0)
		document.getElementById('startSign').hidden = false
	}

	return (
		<div className="w-100 h-100 d-flex flex-column">
			<div className="d-flex justify-content-between px-5" style={{height : '100px'}}>
				<div id='scorePlayer1' className="fw-bold fs-1 bg-dark-subtle rounded border border-white d-flex justify-content-center align-items-center mt-3" style={{width : '80px', height : '80px'}}>0</div>
				<div id='scorePlayer2' className="fw-bold fs-1 bg-dark-subtle rounded border border-white d-flex justify-content-center align-items-center mt-3" style={{width : '80px', height : '80px'}}>0</div>
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
				<PongCanvasLocal setWinner={setWinner} />}
			</div>
		</div>
	)

}