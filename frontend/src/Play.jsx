import { Link, useNavigate } from "react-router-dom"
import React, { useState, useEffect, useRef } from "react"
import { Tournament } from "./Tournaments"
import * as Social from "./Social.js"
// import PongLocal from "./Pong/local.jsx"

export default function Play({props}) {
	
	const navigate = useNavigate()

	useEffect(() => {
		if (props.myProfile && props.myProfile.room) {
			if (props.myProfile.playing) {
				fetch('/game/room/getGame/').then(response => {
					if (response.status === 200) {
						response.json().then(game => navigate('/game/' + game + '/' + props.myProfile.room))
					}
				})
			}
			else
				navigate('/match/' + props.myProfile.room)
		}
	}, [props, navigate])

	if (props.myProfile && props.myProfile.room > 0 && props.myProfile.playing)
		return <div className="d-flex justify-content-center align-items-center noScrollBar" style={props.customwindow}><img src="/images/loading.gif" alt="" /></div>

    if (!props.myProfile || props.settings.scope === 'local') {
		if (!props.md)
			return <div className="d-flex text-center justify-content-center align-items-center fw-bold fs-2" style={props.c2stomwindow}>{props.language.smallScreen}</div>
		else if (props.settings.game === 'pong')
			return <PongLocal props={props} />
	}
	
	return (
		<div style={props.customwindow} className="noScrollBar">
			<Remote props={props} />
		</div>
	)
}

function PongLocal({props}) {

	const [canvas, setCanvas] = useState(undefined)
	const [winner, setWinner] = useState(0)
	const [startSign, setStartSign] = useState(true)

	const navigate = useNavigate()

	useEffect(() => {
		if (!canvas && winner === 0)
			setCanvas(<PongCanvasLocal setWinner={setWinner} setStartSign={setStartSign} />)
		if (winner > 0)
			setCanvas(undefined)
	})

	const reset = () => {
		document.getElementById('scorePlayer1').innerHTML = 0
		document.getElementById('scorePlayer2').innerHTML = 0
		setWinner(0)
		setCanvas(undefined)
		setStartSign(true)
	}

	return (
		<div className="w-100 h-100 d-flex flex-column">
			<div className="d-flex justify-content-between px-5" style={{height : '100px'}}>
				<div id='scorePlayer1' className="fw-bold fs-1 bg-dark-subtle rounded border border-white d-flex justify-content-center align-items-center mt-3" style={{width : '80px', height : '80px'}}>0</div>
				<div id='scorePlayer2' className="fw-bold fs-1 bg-dark-subtle rounded border border-white d-flex justify-content-center align-items-center mt-3" style={{width : '80px', height : '80px'}}>0</div>
			</div>
			<div className="d-flex justify-content-center align-items-center w-100 h-100 position-relative">
				{startSign && <div className="rounded border border-2 border-white p-2 bg-dark-subtle fw-bold fs-1 position-absolute" style={{zIndex : '2'}}>{props.language.pressStart}</div>}
				{winner > 0 ?
				<div className="w-100 d-flex justify-content-center align-items-center pb-5" style={{height : 'calc(100% - 60px)'}}>
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
				<canvas id='gameCanvas' className="rounded border border-3 border-white" style={{width : 'calc(100% - 300px)', height : 'calc(100% - 150px)'}}>
					{canvas}
				</canvas>}
			</div>
		</div>
	)

}

function PongCanvasLocal({setWinner, setStartSign}) {

	const canvas = document.getElementById("gameCanvas")
	const context = canvas.getContext("2d")
	const [start, setStart] = useState(false)

	const user1 = {
    	x: 0,
    	y: canvas.height/2 - 100/2,
    	width: 10,
    	height: 50,
    	color: "WHITE",
		score : 0
	}

	const user2 = {
	    x: canvas.width - 10,
	    y: canvas.height/2 - 100/2,
	    width: 10,
	    height: 50,
	    color: "WHITE",
		score : 0
	}

	const ball = {
	    x: canvas.width/2,
	    y: canvas.height/2,
	    radius: 10,
	    speed: 5,
	    velocityX: 5,
	    velocityY: 5,
	    color: "WHITE"
	}

	const net = {
	    x: canvas.width/2 - 1,
	    y: 0,
	    width: 2,
	    height: 10,
	    color: "WHITE"
	}

	const drawNet = () => {
		for(let i = 0; i <= canvas.height; i+=15){
		        drawRect(net.x, net.y + i, net.width, net.height, net.color)
		}
	}

	const drawRect = (x,y,w,h,color) => {
	    context.fillStyle = color
	    context.fillRect(x,y,w,h)
	}

	const drawCircle = (x,y,r,color) => {
	    context.fillStyle = color
	    context.beginPath()
	    context.arc(x,y,r,0,Math.PI*2,false)
	    context.closePath()
	    context.fill()
	}

	const handleKeyDown = e => {
		if (e.key === 'ArrowUp')
			user2.y -= 25
		else if (e.key === 'ArrowDown')
			user2.y += 25
		else if (e.key === 'z')
			user1.y -= 25
		else if (e.key === 's')
			user1.y += 25
		else if (e.key === ' ' && !start) {
			setStartSign(false)
			setStart(true)
			window.removeEventListener('keydown', handleKeyDown)
		}
		else
			return
	}

	window.addEventListener('keydown', handleKeyDown)

	const collision = (b,p) => {
	    b.top = b.y - b.radius
	    b.bottom = b.y + b.radius
	    b.left = b.x - b.radius
	    b.right = b.x + b.radius

	    p.top = p.y
	    p.bottom = p.y + p.height
	    p.left = p.x
	    p.right = p.x + p.width

	    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom
	}

	const resetBall = () => {
	    ball.x = canvas.width/2
	    ball.y = canvas.height/2
	    ball.velocityX = -ball.velocityX
	    ball.speed = 5
	}

	const update = () => {

		if (user1.score === 5 || user2.score === 5)
			return
    
        if (ball.x - ball.radius < 0) {
            user2.score++ 
			document.getElementById('scorePlayer2').innerHTML = user2.score
			if (user2.score === 5)
				setWinner(2)
            resetBall()
        }
		else if (ball.x + ball.radius > canvas.width) {
            user1.score++
			document.getElementById('scorePlayer1').innerHTML = user1.score
			if (user1.score === 5)
				setWinner(1)
            resetBall()
        }
        
        ball.x += ball.velocityX
        ball.y += ball.velocityY
        
        if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height)
            ball.velocityY = -ball.velocityY
        
        let player = (ball.x + ball.radius < canvas.width/2) ? user1 : user2
        
        if (collision(ball,player)) {
            let collidePoint = (ball.y - (player.y + player.height/2))

            collidePoint = collidePoint / (player.height/2)
            
            let angleRad = (Math.PI/4) * collidePoint
            
            let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1
            ball.velocityX = direction * ball.speed * Math.cos(angleRad)
            ball.velocityY = ball.speed * Math.sin(angleRad)
            
            ball.speed += 0.5
        }
        
        if (ball.speed >= 30) {
                ball.speed = 30
        }
    }

	const render = () => {

        drawRect(0,0, canvas.clientWidth, canvas.clientHeight, "BLACK")

        drawNet()

        drawRect(user1.x, user1.y, user1.width, user1.height, user1.color)
        drawRect(user2.x, user2.y, user2.width, user2.height, user2.color)

        drawCircle(ball.x, ball.y, ball.radius, ball.color)
	}

	const game = () => {
        update()
        render()
	}

	const framePerSecond = 60
	if (!start)
		render()
	else
		setInterval(game, 1000/framePerSecond)
}

// function PongLocal({props}) {
// 	const initialBallState = { x: 300, y: 200, speedX: 5, speedY: 5 };
// 	const initialPaddleState = { left: 150, right: 150 };
// 	const [ball, setBall] = useState(initialBallState);
// 	const [paddles, setPaddles] = useState(initialPaddleState);
// 	const [gameOver, setGameOver] = useState(false);
// 	const [gameRunning, setGameRunning] = useState(false);
// 	const ballRef = useRef(null);
   
// 	useEffect(() => {
// 	  if (gameRunning) {
// 		const handleKeyPress = (e) => {
// 		  switch (e.key) {
// 			case 'ArrowUp':
// 			  setPaddles((prev) => ({ ...prev, right: Math.max(prev.right - 10, 0) }));
// 			  break;
// 			case 'ArrowDown':
// 			  setPaddles((prev) => ({ ...prev, right: Math.min(prev.right + 10, 300) }));
// 			  break;
// 			case 'z':
// 			  setPaddles((prev) => ({ ...prev, left: Math.max(prev.left - 10, 0) }));
// 			  break;
// 			case 's':
// 			  setPaddles((prev) => ({ ...prev, left: Math.min(prev.left + 10, 300) }));
// 			  break;
// 			default:
// 			  break;
// 		  }
// 		};
   
// 		const updateGame = () => {
// 		  setBall((prevBall) => ({
// 			...prevBall,
// 			x: prevBall.x + prevBall.speedX,
// 			y: 200,
// 		  }));
   
// 		  const ballRect = ballRef.current.getBoundingClientRect();
// 		  const paddleLeftRect = document.getElementById('paddle-left').getBoundingClientRect();
// 		  const paddleRightRect = document.getElementById('paddle-right').getBoundingClientRect();
   
// 		  // Check for collisions with paddles
// 		  if (
// 			(ballRect.left <= paddleLeftRect.right &&
// 			  ballRect.right >= paddleLeftRect.left &&
// 			  ballRect.top <= paddleLeftRect.bottom &&
// 			  ballRect.bottom >= paddleLeftRect.top) ||
// 			(ballRect.left <= paddleRightRect.right &&
// 			  ballRect.right >= paddleRightRect.left &&
// 			  ballRect.top <= paddleRightRect.bottom &&
// 			  ballRect.bottom >= paddleRightRect.top)
// 		  ) {
// 			setBall((prevBall) => ({ ...prevBall, speedX: -prevBall.speedX }));
// 		  }
   
// 		  // Check for collisions with top and bottom walls
// 		  if (ball.y <= 0 || ball.y >= 380) {
// 			setBall((prevBall) => ({ ...prevBall, speedY: -prevBall.speedY }));
// 		  }
   
// 		  // Check for game over
// 		  if (ball.x < 0 || ball.x > 600) {
// 			setGameOver(true);
// 			pauseGame();
// 		  }
// 		};
// 		const intervalId = setInterval(updateGame, 50);
   
// 		window.addEventListener('keydown', handleKeyPress);
   
// 		return () => {
// 		  clearInterval(intervalId);
// 		  window.removeEventListener('keydown', handleKeyPress);
// 		};
// 	  }
// 	}, [gameRunning, ball]);
   
// 	const startGame = () => {
// 	  setGameRunning(true);
// 	};
   
// 	const restartGame = () => {
// 	  setBall(initialBallState);
// 	  setPaddles(initialPaddleState);
// 	  setGameOver(false);
// 	};
   
// 	const pauseGame = () => {
// 	  setGameRunning(false);
// 	};
   
// 	return (
// 	  <div className="ping-pong-container" tabIndex="0">
// 		<div
// 		  className={`paddle paddle-left ${gameRunning ? '' : 'paused'}`}
// 		  id="paddle-left"
// 		  style={{ top: `${paddles.left}px` }}
// 		/>
// 		<div
// 		  className={`paddle paddle-right ${gameRunning ? '' : 'paused'}`}
// 		  id="paddle-right"
// 		  style={{ top: `${paddles.right}px`, left: '580px' }}
// 		/>
// 		<div
// 		  className={`ball ${gameRunning ? '' : 'paused'}`}
// 		  ref={ballRef}
// 		  style={{ top: `${ball.y}px`, left: `${ball.x}px` }}
// 		/>
// 		<div className="controls">
// 		  <button onClick={startGame}>Start</button>
// 		  <button onClick={restartGame}>Restart</button>
// 		  <button onClick={pauseGame}>Pause</button>
// 		</div>
// 		{gameOver && <div className="game-over">Game Over</div>}
// 	  </div>
// 	);
//   };

// function PongLocal({props}) {

// 	const [gameState, setGameState] = useState(null);
//   const navigate = useNavigate();

//   const keyState = {};

//   useEffect(() => {
//     if (!gameState) {
//       setGameState({
//         ball: { x: 50, y: 50, dx: 1, dy: 1 },
//         paddle1: { x: 0, y: 50 },
//         paddle2: { x: 100, y: 50 },
//         score: { player1: 0, player2: 0 },
//         game_over: false,
//         winner: null,
//       });
//     } else {
//       window.addEventListener("keydown", handleKeyDown);
//       window.addEventListener("keyup", handleKeyUp);
//     }
//     const interval = setInterval(updateGameState, 10);
//     return () => {
//       clearInterval(interval);
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   }, [gameState]);

//   const updateGameState = () => {
//     if (gameState.game_over) return;

//     let { ball, paddle1, paddle2, score } = gameState;

//     ball.x += ball.dx;
//     ball.y += ball.dy;

//     if (ball.y <= 0 || ball.y >= 100) {
//       ball.dy = -ball.dy;
//     }

//     if (
//       (ball.x <= 10 && paddle1.y <= ball.y && ball.y <= paddle1.y + 20) ||
//       (ball.x >= 90 && paddle2.y <= ball.y && ball.y <= paddle2.y + 20)
//     ) {
//       ball.dx = -ball.dx;
//     }

//     if (ball.x <= 0) {
//       score.player2 += 1;
//       resetBall(ball);
//       if (score.player2 >= 5) {
//         gameState.game_over = true;
//         gameState.winner = props.language.player + " 2";
//       }
//     } else if (ball.x >= 100) {
//       score.player1 += 1;
//       resetBall(ball);
//       if (score.player1 >= 5) {
//         gameState.game_over = true;
//         gameState.winner = props.language.player + " 1";
//       }
//     }

//     if (keyState['ArrowUp']) {
//       paddle2.y = Math.max(0, paddle2.y - 5);
//     }
//     if (keyState['ArrowDown']) {
//       paddle2.y = Math.min(80, paddle2.y + 5);
//     }
//     if (keyState['z']) {
//       paddle1.y = Math.max(0, paddle1.y - 5);
//     }
//     if (keyState['s']) {
//       paddle1.y = Math.min(80, paddle1.y + 5);
//     }

//     setGameState({ ...gameState, ball, paddle1, paddle2, score });
//   };

//   const resetBall = (ball) => {
//     ball.x = 50;
//     ball.y = 50;
//     ball.dx = 1;
//     ball.dy = 1;
//   };

//   const handleKeyDown = (e) => {
//     keyState[e.key] = true;
//   };

//   const handleKeyUp = (e) => {
//     keyState[e.key] = false;
//   };

// 	if (!gameState)
// 		return undefined

// 	return (
// 		<div className="w-100 h-100 pt-2">
// 			<div className="d-flex justify-content-between gap-4 px-3" style={{height : '60px'}}>
// 				<span className="fw-bold fs-1 bg-dark-subtle px-2 rounded border border-2 border-black">{props.language.player} 1 : {gameState.score.player1}</span>
// 				<span className="fw-bold fs-1 bg-dark-subtle px-2 rounded border border-2 border-black">{props.language.player} 2 : {gameState.score.player2}</span>
// 			</div>
// 			{gameState.game_over ? 
// 				<div className="w-100 d-flex justify-content-center align-items-center pb-5" style={{height : 'calc(100% - 60px)'}}>
// 					<div className="game-over d-flex flex-column justify-content-center align-items-center mt-3 p-5 gap-2 bg-dark-subtle w-50 rounded border border-2 border-black">
// 						<span className={`fw-bold ${props.md ? 'fs-2' : 'fs-6'}`}>{props.language.gameOver}</span>
// 						<span className={`fw-bold ${props.md ? 'fs-2' : 'fs-6'}`}>{props.language.winner} : {gameState.winner}</span>
// 						<span className="fw-bold fs-4">{props.language.rematch}</span>
// 						<div className="button-group d-flex gap-3">
// 							<button onClick={() => setGameState(null)} type='button' className="btn btn-success p-2">{props.language.yes}</button>
// 							<button onClick={() => navigate('/')} type='button' className="btn btn-danger p-2">{props.language.no}</button>
// 						</div>
// 					</div>
// 				</div> : 
// 				<div className="game-area mt-3 rounded" style={{height : 'calc(100% - 100px)', width : '75%', margin : 'auto'}}>
// 					<div className="ball" style={{ top: gameState.ball.y, left: gameState.ball.x }}></div>
// 					<div className="paddle paddle1" style={{ top: gameState.paddle1.y }}></div>
// 					<div className="paddle paddle2" style={{ top: gameState.paddle2.y }}></div>
// 		  		</div>
// 			}
// 		</div>
// 	  )
// }

function ChessLocal({props}) {}

// function Local({props}) {
	
// 	const [profile1, setProfile1] = useState(props.myProfile)
// 	const [profile2, setProfile2] = useState(undefined)

// 	if (!props.xlg)
// 		return <div className="d-flex text-center justify-content-center align-items-center fw-bold fs-1 h-100 w-100">{props.language.smallScreen}</div>

// 	const checkReady = () => {
// 		let check1 = profile1 ? document.getElementById('ready1').checked : document.getElementById('guest1').checked
// 		let check2 = profile2 ? document.getElementById('ready2').checked : document.getElementById('guest2').checked
// 		if (check1 && check2)
// 			document.getElementById('launchButton').disabled = false
// 		else
// 			document.getElementById('launchButton').disabled = true
// 	}

//     function checkIssue(form, player) {
//         let issue = false
//         if (form.login === '') {
// 			document.getElementById('logAddressLocal' + player).setAttribute('class', 'form-control border border-3 border-danger')
//             issue = true
//         }
//         if (form.password === '') {
//             document.getElementById('logPasswordLocal' + player).setAttribute('class', 'form-control border border-3 border-danger')
//             issue = true
//         }
//         return issue
//     }

// 	const loginLocal = e => {
//         let player = e.target.dataset.player
//         let form = {
// 			login : document.getElementById('logAddressLocal' + player).value,
// 			password : document.getElementById('logPasswordLocal' + player).value
// 		}
//         if (!checkIssue(form, player)) {
// 			let xhr = new XMLHttpRequest()
// 			xhr.open('GET', "/authenticate/sign_in/local/")
// 			xhr.send(JSON.stringify(form))
// 			xhr.onload = () => {
// 				if ('details' in xhr.response)
// 					document.getElementById('error' + player).hidden = false
// 				else {
// 					player === '1' ? setProfile1(xhr.response) : setProfile2(xhr.response)
// 					document.getElementById('error' + player).hidden = true
// 				}
//         	}
// 		}
// 	}

// 	const launchGame = () => {
// 		let info = {
// 			game : props.settings.game,
// 			profile1 : profile1 ? profile1 : 'guest',
// 			profile2 : profile2 ? profile2 : 'guest'
// 		}
// 		var request = new XMLHttpRequest()
// 		request.open('POST', "game/room/create/")
// 		request.send(JSON.stringify(info))
// 		request.onload = () => {}
// 	}

// 	const logout = () => {
// 		Social.leaveAllChats(props.socket, props.chats, props.setChats, props.setChanName, props.setChanTag)
// 		setProfile1(undefined)
//         props.setMyProfile(undefined)
//     	props.socket.close()
// 		let xhr = new XMLHttpRequest()
// 		xhr.open("POST", "/authenticate/sign_out/" + props.myProfile.id + '/')
// 		xhr.onload = () => props.setSocket(new WebSocket('ws://' + window.location.host + '/ws/'))
// 		xhr.send()
// 	}

// 	const logoutLocal = e => {
// 		if (e.target.dataset.profile) {
// 			if(window.confirm('Warning ! You will be disconnected from the website'))
// 				logout()
// 		}
// 		e.target.dataset.player === '1' ? setProfile1(undefined) : setProfile2(undefined)
// 	}

//     const typing = e => {
//         let player = e.target.dataset.player
// 		document.getElementById('logAddressLocal' + player).setAttribute('class', 'form-control')
// 		document.getElementById('logPasswordLocal' + player).setAttribute('class', 'form-control')
// 		document.getElementById('error' + player).hidden = true
// 		if (e.keyCode === 13) {
// 			e.preventDefault()
// 			loginLocal(e)
// 		}
//     }

// 	return (
// 		<>
// 			{props.myProfile ?
// 				<div className='d-flex justify-content-center fs-1 fw-bold text-success'>{props.settings.game === 'pong' ? props.language.letsPlayPong : props.language.letsPlayChess} !!!</div> :
//             	<div className="w-100 text-center dropdown-center mb-4">
//             	    <button type="button" className="btn btn-success" data-bs-toggle="dropdown">{props.language.whatGame} (<span className='fw-bold text-capitalize'>{props.settings.game === 'pong' ? 'Pong' : props.language.chess}</span>)</button>
//             	    <ul className="dropdown-menu">
//             	    	<li type='button' onClick={() => props.setSettings({...props.settings, game : 'pong'})} data-game='pong' className="dropdown-item d-flex align-items-center">
//             	    	    <img data-game='pong' src="/images/joystick.svg" alt="" />
//             	    	    <span data-game='pong' className="ms-2">Pong</span>
//             	    	</li>
//             	    	<li type='button' onClick={() => props.setSettings({...props.settings, game : 'chess'})} data-game='chess' className="dropdown-item d-flex align-items-center">
//             	    	    <img data-game='chess' src="/images/hourglass.svg" alt="" />
//             	    	    <span data-game='chess' className="ms-2">{props.language.chess}</span>
//             	    	</li>
//             	    </ul>
//             	</div>
// 			}
//             <div className={`d-flex flex-grow-1 align-items-center justify-content-between`} style={{height: '80%'}}>
//                 <div className={`${props.xxlg && 'border border-black border-3 rounded'} d-flex justify-content-center align-items-center`} style={{height: props.xxlg ? '100%' : '60%', width: '50%'}}>
// 					{profile1 ? 
// 						<div className="d-flex flex-column align-items-center">
// 							<img src={'/images/'.concat(profile1.avatar)} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
// 							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{profile1.name}</span>
// 							<span className="d-flex gap-2 mt-3">
// 								<input onChange={checkReady} className="form-check-input" type="checkbox" name="player1" id="ready1" />
// 								<label className="form-check-label" htmlFor="ready1">{props.language.ready} ?</label>
// 							</span>
// 							<button onClick={logoutLocal} data-player='player1' data-profile={props.myProfile} type='button' className="btn btn-primary mt-3">{props.language.menu2}</button>
// 						</div> :
// 						<div className={`d-flex flex-column align-items-center border border-black border-2 rounded ${props.xxlg ? 'p-5' : 'px-5 py-2'} bg-secondary`}>
// 							<form action="" className="d-flex flex-column align-items-center">
//                 			    <div className="mb-2">
//                 			        <label htmlFor="logAddressLocal1" className="form-label">E-mail</label>
//                 			        <input onKeyDown={typing} data-player='1' name="login" type="text" className="form-control" id="logAddressLocal1" />
//                 			    </div>
//                 			    <div className="mb-3">
//                 			        <label htmlFor="logPasswordLocal1" className="form-label">{props.language.password}</label>
//                 			        <input onKeyDown={typing} data-player='1' name="password" type="password" className="form-control" id="logPasswordLocal1" />
//                 			    </div>
//                                 <div id='error1' className="text-danger-emphasis mt-2" hidden>{props.language.wrongForm}</div>
//                 			    <button onClick={loginLocal} data-player='1' type="button" className="btn btn-info mb-2">{props.language.menu1}</button>
//                 			</form>
// 							<span className="d-flex gap-2 mt-3">
// 								<input onChange={checkReady} className="form-check-input" type="checkbox" name="player1" id="guest1" />
// 								<label className="form-check-label" htmlFor="guest1">{props.language.guest}</label>
// 							</span>
// 						</div>
// 					}
// 				</div>
//                 <img src="/images/versus.png" className="mx-3" alt="" style={{height: '150px',width: '100px'}} />
//                 <div className={`${props.xxlg && 'border border-black border-3 rounded'} d-flex justify-content-center align-items-center`} style={{height: props.xxlg ? '100%' : '60%', width: '50%'}}>
// 					{profile2 ? 
// 						<div className="d-flex flex-column align-items-center">
// 							<img src={'/images/'.concat(profile2.avatar)} alt="" className="rounded-circle" style={{width: props.xxlg ? '150px' : '75px', height: props.xxlg ? '150px' : '75px'}} />
// 							<span className={`mt-2 fw-bold ${props.xxlg ? 'fs-1' : 'fs-4'}`}>{profile2.name}</span>
// 							<span className="d-flex gap-2 mt-3">
// 								<input onChange={checkReady} className="form-check-input" type="checkbox" name="player2" id="ready2" />
// 								<label className="form-check-label" htmlFor="ready1">{props.language.ready} ?</label>
// 							</span>
// 							<button onClick={logoutLocal} type='button' data-profile='none' className="btn btn-primary mt-3">{props.language.menu2}</button>
// 						</div> :
// 						<div className={`d-flex flex-column align-items-center border border-black border-2 rounded ${props.xxlg ? 'p-5' : 'px-5 py-2'} bg-secondary`}>
// 							<form action="" className="d-flex flex-column align-items-center">
//                 			    <div className="mb-2">
//                 			        <label htmlFor="logAddressLocal2" className="form-label">E-mail</label>
//                 			        <input onKeyDown={typing} data-player='2' name="login" type="text" className="form-control" id="logAddressLocal2" />
//                 			    </div>
//                 			    <div className="mb-3">
//                 			        <label htmlFor="logPasswordLocal2" className="form-label">{props.language.password}</label>
//                 			        <input onKeyDown={typing} data-player='2' name="password" type="password" className="form-control" id="logPasswordLocal2" />
//                 			    </div>
//                                 <div id='error2' className="text-danger-emphasis mt-2" hidden>{props.language.wrongForm}</div>
//                 			    <button onClick={loginLocal} data-player='2' type="button" className="btn btn-info mb-2">{props.language.menu1}</button>
//                 			</form>
// 							<span className="d-flex gap-2 mt-3">
// 								<input onChange={checkReady} className="form-check-input" type="checkbox" name="player2" id="guest2" />
// 								<label className="form-check-label" htmlFor="guest2">{props.language.guest}</label>
// 							</span>
// 						</div>
// 					}
// 				</div>
//             </div>
//             <div className="text-center mt-3">
//                 <button id='launchButton' onClick={launchGame} type="button" className="btn btn-warning" disabled>Let's rock !</button>
//             </div>
//         </>
// 	)
// }

function Remote({props}) {

	const [challengers, setChallengers] = useState(undefined)
	const [challenged, setChallenged] = useState(undefined)
	const [tournaments, setTournaments] = useState(undefined)
	const [displayChallengers, setDisplayChallengers] = useState(true)
	const [displayChallenged, setDisplayChallenged] = useState(true)
	const [displayTournaments, setDisplayTournaments] = useState(true)

	useEffect(() => {
		if (!challengers) {
			fetch('/game/play/' + props.settings.game + '/').then(response => {
				if (response.status === 200) {
					response.json().then(data => {
						setChallengers(data.challengers)
						setChallenged(data.challenged)
						setTournaments(data.tournaments)
					})
				}
			})
		}
		const interval = setInterval(() => {
			fetch('/game/play/' + props.settings.game + '/').then(response => {
				if (response.status === 200) {
					response.json().then(data => {
						setChallengers(data.challengers)
						setChallenged(data.challenged)
						setTournaments(data.tournaments)
					})
				}
			})
		}, 3000)
		return () => clearInterval(interval)
	}, [props.settings.game, challengers, challenged, tournaments])

	if (!challengers || !challenged || !tournaments)
		return <div className='w-100 h-100 d-flex align-items-center justify-content-center noScrollBar'><img src="/images/loading.gif" alt="" /></div>
	
	const changeGame = e => {
		props.setSettings({...props.settings, game : e.target.dataset.game})
		setChallengers(undefined)
	}

	const getChessName = () => {
		if (props.language.menu1 === 'Connexion')
			return 'Echecs'
		else if (props.language.menu1 === 'Verbindung')
			return 'Schach'
		return 'Chess'
	}

	let index = 1

    return <>
                <div className="fs-2 fw-bold text-center">
					{props.language.wannaPlay} (<button type='button' className='nav-link text-primary text-capitalize d-inline' data-bs-toggle='dropdown'>{props.settings.game === 'pong' ? 'pong' : getChessName()}</button>) ?
					<ul className='dropdown-menu bg-light'>
					<li type='button' onClick={changeGame} data-game='pong' className="dropdown-item d-flex align-items-center">
            		    <img data-game='pong' src="/images/joystick.svg" alt="" />
            		    <span data-game='pong' className="ms-2">Pong</span>
            		</li>
            		<li type='button' onClick={changeGame} data-game='chess' className="dropdown-item d-flex align-items-center">
            		    <img data-game='chess' src="/images/hourglass.svg" alt="" />
            		    <span data-game='chess' className="ms-2">{props.language.chess}</span>
            		</li>
					</ul>
				</div>
                <hr className="mx-5" />
                {(challengers.length > 0 || challenged.length > 0) && <span className="ms-2">{props.language.tip}</span>}
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">{props.language.challengers} {challengers.length > 0 && <img src='/images/caret-down-fill.svg' alt='' className="ms-2 border border-black p-1 rounded bg-white" onClick={() => setDisplayChallengers(!displayChallengers)} />}</p>
				{challengers.length === 0 ?
				<div className='border border-black border-3 rounded d-flex justify-content-center align-items-center fw-bold' style={{height : '120px', width : '90%'}}>{props.language.noChallenger}</div> :
				displayChallengers && <ul className="list-group overflow-visible" style={{width: '90%'}}>
					{challengers.filter(item => item.status === 'online' && item.challengeable).map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
					{challengers.filter(item => item.status === 'offline' && !item.challengeable).map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
					{challengers.filter(item => item.status === 'offline').map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
				</ul>}
                <hr className="mx-5" />
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">{props.language.challenged} {challenged.length > 0 && <img src='/images/caret-down-fill.svg' alt='' className="ms-2 border border-black p-1 rounded bg-white" onClick={() => setDisplayChallenged(!displayChallenged)} />}</p>
				{challenged.length === 0 ?
				<div className='border border-black border-3 rounded d-flex justify-content-center align-items-center fw-bold' style={{height : '120px', width : '90%'}}>{props.language.noChallenged}</div> :
				displayChallenged && <ul className="list-group overflow-visible" style={{width: '90%'}}>
					{challenged.filter(item => item.status === 'online' && item.challengeable).map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
					{challenged.filter(item => item.status === 'offline' && !item.challengeable).map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
					{challenged.filter(item => item.status === 'offline').map(challenger => <Challenger key={index++} props={props} challenger={challenger} tab='challengers' challengers={challengers} setChallengers={setChallengers} challenged={challenged} setChallenged={setChallenged} />)}
				</ul>}
                <hr className="mx-5" />
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">{props.language.tournamentsSection} {tournaments.length > 0 && <img src='/images/caret-down-fill.svg' alt='' className="ms-2 border border-black p-1 rounded bg-white" onClick={() => setDisplayTournaments(!displayTournaments)} />}</p>
				{tournaments.length === 0 ?
				<div className='border border-black border-3 rounded d-flex justify-content-center align-items-center fw-bold' style={{height : '120px', width : '90%'}}>{props.language.noTournament}</div> :
				displayTournaments && <ul className="list-group overflow-visible" style={{width: '90%'}}>
					{tournaments.map(tournament => <Tournament key={index++} props={props} tournament={tournament} /> )}
				</ul>}
            </>
}

function Challenger({props, challenger, tab, challengers, setChallengers, challenged, setChallenged}) {

	const navigate = useNavigate()

	const dismiss = () => {
		props.socket.send(JSON.stringify({
			action : 'dismiss',
			item : {game : props.settings.game, id : challenger.id}
		}))
		tab === 'challengers' && setChallengers(challengers.filter(item => item.id !== challenger.id))
		tab === 'challenged' && setChallenged(challenged.filter(item => item.id !== challenger.id))
		props.setMyProfile({...props.myProfile, [props.settings.game + 'Challengers'] : props.myProfile[props.settings.game + 'Challengers'].filter(item => item !== challenger.id)})
	}

	const joinMatch = () => {
		if (!challenger.room) {
			fetch('/game/room/create/', {
				method : 'POST', 
				body : JSON.stringify({
					game : props.settings.game,
					player2 : challenger.id
				})
			}).then(response => {
				if (response.status === 401)
					props.setChats(props.chats.map(chat => { return {...chat, messages : [...chat.messages, {type : 'system', subType : 'allreadyInAMatch', name : challenger.name}]}}))
				else if (response.status === 200 || response.status === 201) {
					response.json().then(id => {
						props.setMyProfile({...props.myProfile, room : id})
						props.socket.send(JSON.stringify({action : 'joinMatch', item : {}}))
						navigate('/match/' + id)
					})
				}
			})
		}
		else {
			fetch('game/updateRoom/' + challenger.room.id + '/', {method : 'POST'}).then(response => {
				if (response.status === 200) {
					props.setMyProfile({...props.myProfile, room : challenger.room.id})
					props.socket.send(JSON.stringify({action : 'joinMatch', item : {}}))
					navigate('/match/' + challenger.room.id)
				}
			})
		}
	}

	const buildMenu = () => {
		let index = 1
		let menu
		menu = [<Link to={'/profile/' + challenger.id} className='px-2 dropdown-item nav-link' type='button' key={index++}>{props.language.seeProfile}</Link>]
		if (challenger.status === 'online') {
			menu.push(<li className='px-2 dropdown-item nav-link' type='button' key={index++} onClick={() => Social.directMessage(props.xlg, document.getElementById('chat2').hidden, challenger.name)}>{props.language.dm}</li>)
			if (challenger.playing && challenger.room.spectate)
				menu.push(<Link to={'/game/' + challenger.room.game + '/' + challenger.room.id} className='px-2 dropdown-item nav-link' type='button' key={index++}>{props.language.watchGame}</Link>)
			else if (!challenger.playing && (!challenger.room || challenger.room.player2.id === props.myProfile.id))
				menu.push(<li onClick={joinMatch} className='px-2 dropdown-item nav-link' type='button' key={index++}>{props.language.joinMatch}</li>)
		}
		return menu
	}

	const getBackgroundColor = () => {
		if (!challenger.challengeable || challenger.status === 'offline')
			return 'bg-dark-subtle'
		else if (challenger.room && challenger.room.player2.id === props.myProfile.id)
			return 'bg-warning'
		else if (challenger.room)
			return 'bg-dark-subtle'
		return 'bg-white'
	}

	const getStatus = () => {
		if (challenger.status === 'online') {
			if (challenger.playing)
				return props.language.inAGame
			else
				return props.language.available
		}
		return '(' + props.language.offline + ')'
	}

	const getComment = () => {
		if (!challenger.challengeable)
			return props.language.butNotChallengeable
		else if (challenger.room && challenger.room.player2.id === props.myProfile.id)
			return props.language.waitingForU
		return ''
	}

	// console.log(challenger)

	return (
		<li className={`${(!props.xxlg && props.xlg) || !props.md && 'flex-column align-items-center gap-2'} list-group-item d-flex `.concat(getBackgroundColor())}>
			<Link to={'/profile/' + challenger.id}>
				<img className="rounded-circle profileLink" title={props.language.seeProfile} src={challenger.avatar} alt="" style={{width: '45px', height: '45px'}} />
			</Link>
			<div className={`d-flex justify-content-between align-items-center fw-bold ms-2 flex-grow-1 ${(!props.xxlg && props.xlg) || !props.md ? 'flex-column' : ''}`}>{challenger.name} {getStatus()} {getComment()}
				<div className={`d-flex gap-2 dropstart button-group ${!props.sm && 'flex-column align-items-center'}`}>
					<button type='button' className={`btn btn-success`} data-bs-toggle='dropdown'>
						Options
					</button>
					<ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>
						{buildMenu()}
					</ul>
					<button onClick={dismiss} type='button' className={`btn btn-danger`}>
						{props.language.dismissChallenge}
					</button>
				</div>
			</div>
		</li>
	)
}
