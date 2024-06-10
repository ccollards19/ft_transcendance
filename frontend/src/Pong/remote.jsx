import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function PongRemote({props, socket, room}) {

	const [winner, setWinner] = useState(0)
	const [quitter, setQuitter] = useState(0)

	const navigate = useNavigate()
	const player1 = props.myProfile && props.myProfile.id === room.player1.id
	const player2 = props.myProfile && props.myProfile.id === room.player2.id

	const leave = () => {
		props.setMyProfile({...props.myProfile, room : null, playing : false})
		navigate('/')
	}

	return (
		<div className="w-100 h-100 d-flex flex-column">
			<div className="w-100 d-flex justify-content-between pt-3 px-3">
				<div className="d-flex flex-column gap-3 align-items-start" style={{maxWidth : '35%'}}>
					<div>
						<img type='button' title={props.language.seeProfile} onClick={() => navigate('/profile/' + room.player1.id)} src={room.player1.avatar} className="rounded-circle" alt="" style={{width : '100px', height : '100px'}} />
						{props.xxxlg && room.player1.catchphrase && <span className="fw-bold fs-4 bg-dark text-white rounded p-2 ms-2">{room.player1.catchphrase}</span>}
					</div>
					<div id='scorePlayer1' className="fw-bold fs-1 bg-dark-subtle rounded border border-white d-flex justify-content-center align-items-center mt-3 ms-2" style={{width : '80px', height : '80px'}}>0</div>
				</div>
				<div className="d-flex flex-column gap-3 align-items-end" style={{maxWidth : '35%'}}>
					<div>
						{props.xxxlg && room.player2.catchphrase && <span className="fw-bold fs-4 bg-dark text-white rounded p-2 me-2">{room.player2.catchphrase}</span>}
						<img type='button' title={props.language.seeProfile} onClick={() => navigate('/profile/' + room.player2.id)} src={room.player2.avatar} className="rounded-circle" alt="" style={{width : '100px', height : '100px'}} />
					</div>
					<div id='scorePlayer2' className="fw-bold fs-1 bg-dark-subtle rounded border border-white d-flex justify-content-center align-items-center mt-2 me-2" style={{width : '80px', height : '80px'}}>0</div>
				</div>
			</div>
			<div className="d-flex justify-content-center align-items-center w-100 h-100 position-relative">
				{(player1 || player2) && <div id='startSign' className="rounded border border-2 border-white p-2 bg-dark-subtle fw-bold fs-1 position-absolute" style={{zIndex : '2'}} hidden={false}>{props.language.pressStart}</div>}
				{winner > 0 &&
				<div className="w-100 d-flex justify-content-center align-items-center pb-5" style={{height : 'calc(100% - 60px)', zIndex : '2'}}>
					<div className="game-over d-flex flex-column justify-content-center align-items-center mt-3 p-5 gap-2 bg-dark-subtle w-50 rounded border border-2 border-black">
						<span className={`fw-bold ${(!props.xlg || (props.xlg && !props.xxxlg)) ? 'fs-6' : 'fs-2'}`}>{props.language.gameOver}</span>
						<span className={`fw-bold ${(!props.xlg || (props.xlg && !props.xxxlg)) ? 'fs-6' : 'fs-2'}`}>{props.language.winner} :</span>
						<span className={`fw-bold ${(!props.xlg || (props.xlg && !props.xxxlg)) ? 'fs-6' : 'fs-2'}`}>{room['player' + winner].name}</span>
						<span className={`fw-bold ${(!props.xlg || (props.xlg && !props.xxxlg)) ? 'fs-6' : 'fs-2'}`}>{props.language.rematch}</span>
						<span className="fw-bold fs-4">{props.language.rematch}</span>
						<div className="button-group d-flex gap-3">
							<button type='button' className="btn btn-success p-2">{props.language.yes}</button>
							<button onClick={leave} type='button' className="btn btn-danger p-2">{props.language.no}</button>
						</div>
					</div>
				</div>}
				{quitter > 0 && 
					<div className="w-100 d-flex justify-content-center align-items-center pb-5" style={{height : 'calc(100% - 60px)', zIndex : '2'}}>
						<div>{room['player' + quitter].name} left...</div>
						<button type='button' onClick={() => navigate('/')} className="btn btn-primary">Ok</button>
					</div>}
				{winner === 0 && quitter === 0 && <PongCanvasRemote props={props} setWinner={setWinner} socket={socket} room={room} player1={player1} player2={player2} setQuitter={setQuitter} />}
			</div>
		</div>
	)

}

function PongCanvasRemote({props, setWinner, socket, room, player1, player2, setQuitter}) {

	const canvas = document.getElementById("pongCanvas")
	const context = canvas.getContext("2d")
	var interval = undefined

	useEffect(() => {
		socket.onmessage = e => {
			let data = JSON.parse(e.data)
			console.log(data)
			if (data.action === 'init') {
				user1.score = data.item.score_1
				user2.score = data.item.score_2
				document.getElementById('scorePlayer1').innerHTML = user1.score
				document.getElementById('scorePlayer2').innerHTML = user2.score
				user1.y = canvas.height/2 - data.item.player1Y
				user2.y = canvas.height/2 - data.item.player2Y
			}
			else if (data.action === 'start') {
				if (player1 || player2)
					document.getElementById('startSign').hidden = true
				interval = setInterval(game, 1000/60)
			}
			else if (data.action === 'update') {
				if (data.move === '1up' && user1.y > 0)
					user1.y -= 25
				else if (data.move === '1down' && user1.y < 100)
					user1.y += 25
				else if (data.move === '2up' && user2.y > 0)
					user2.y -= 25
				else if (data.move === '2down' && user1.y < 100)
					user2.y += 25
			}
			else if (data.action === 'restart') {
				document.getElementById('scorePlayer1').innerHTML = 0
				document.getElementById('scorePlayer2').innerHTML = 0
				if (player1 || player2)
					document.getElementById('startSign').hidden = false
				setWinner(0)
			}
			else if (data.action === 'quit')
				setQuitter(data.quitter)
		}
		return () => {
			context.reset()
			clearInterval(interval)
			if (player1 || player2)
				window.removeEventListener('keydown', handleKeyDown)
			canvas.hidden = true
		}
	})

	canvas.hidden = false

	const user1 = {
    	x: 0,
    	y: canvas.height/2 - 25,
    	width: 10,
    	height: 50,
    	color: "WHITE",
		score : 0
	}

	const user2 = {
	    x: canvas.width - 10,
	    y: canvas.height/2 - 25,
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
	    velocityX: 2,
	    velocityY: 2,
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
		for(let i = 0; i <= canvas.height; i+=15)
		    drawRect(net.x, net.y + i, net.width, net.height, net.color)
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
		if (!player1 && !player2)
			return
		if ((e.key === 'ArrowUp' || e.key === 'z') && ((player2 && user2.y > 0) || (player1 && user1.y > 0)))
			socket.send(JSON.stringify({action : 'up'}))
		else if ((e.key === 'ArrowDown' || e.key === 's') && ((player2 && user2.y < 100) || (player1 && user1.y < 100)))
			socket.send(JSON.stringify({action : 'down'}))
		else if (e.key === ' ' && !document.getElementById('startSign').hidden) 
			socket.send(JSON.stringify({action : 'start'}))
	}

	if (player1 || player2)
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
    
        if (ball.x - ball.radius < 0) {
            user2.score++
			document.getElementById('scorePlayer2').innerHTML = user2.score
			if (props.myProfile && (props.myProfile.id === room.player2.id))
				socket.send(JSON.stringify({action : 'score'}))
			if (user2.score === 5)
				setWinner(2)
            resetBall()
        }
		else if (ball.x + ball.radius > canvas.width) {
            user1.score++
			document.getElementById('scorePlayer1').innerHTML = user1.score
			if (props.myProfile && (props.myProfile.id === room.player1.id))
				socket.send(JSON.stringify({action : 'score'}))
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
        
        if (ball.speed >= 5) {
                ball.speed = 5
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

	render()

}