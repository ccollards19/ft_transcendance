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
				<div className="bg-dark-subtle position-absolute rounded border border-2 border-white d-flex flex-column align-items-center justify-content-around" style={{height : '50%', width :'8%', left : '3%'}}>
					<div className={`fw-bold border border-3 rounded px-3 ${props.xlg ? 'fs-2' : 'fs-4'}`}>Z</div>
					<div className={`fw-bold ${props.xlg ? 'fs-2' : 'fs-4'}`}>{props.language.up}</div>
					<div className={`fw-bold`}>-----</div>
					<div className={`fw-bold border border-3 rounded px-3 ${props.xlg ? 'fs-2' : 'fs-4'}`}>S</div>
					<div className={`fw-bold ${props.xlg ? 'fs-2' : 'fs-4'}`}>{props.language.down}</div>
				</div>
				{winner > 0 ?
				<div className="w-50 d-flex justify-content-center align-items-center pb-5" style={{height : 'calc(100% - 60px)', zIndex : '2'}}>
					<div className="game-over d-flex flex-column justify-content-center align-items-center mt-3 p-5 gap-2 bg-dark-subtle w-50 rounded border border-2 border-black">
						<span className={`fw-bold ${(!props.xlg || (props.xlg && !props.xxxlg)) ? 'fs-6' : 'fs-2'}`}>{props.language.gameOver}</span>
						<span className={`fw-bold ${(!props.xlg || (props.xlg && !props.xxxlg)) ? 'fs-6' : 'fs-2'}`}>{props.language.winner} :</span>
						<span className={`fw-bold ${(!props.xlg || (props.xlg && !props.xxxlg)) ? 'fs-6' : 'fs-2'}`}>{props.language.player} {winner}</span>
						<span className={`fw-bold ${(!props.xlg || (props.xlg && !props.xxxlg)) ? 'fs-6' : 'fs-2'}`}>{props.language.rematch}</span>
						<div className="button-group d-flex gap-3">
							<button onClick={reset} type='button' className="btn btn-success p-2">{props.language.yes}</button>
							<button onClick={() => navigate('/')} type='button' className="btn btn-danger p-2">{props.language.no}</button>
						</div>
					</div>
				</div> :
				<PongCanvasLocal setWinner={setWinner} />}
				<div className="bg-dark-subtle position-absolute rounded border border-2 border-white d-flex flex-column align-items-center justify-content-around" style={{height : '50%', width :'8%', right : '3%'}}>
					<div className={`fw-bold border border-3 rounded px-3 ${props.xlg ? 'fs-2' : 'fs-4'}`}>^</div>
					<div className={`fw-bold ${props.xlg ? 'fs-2' : 'fs-4'}`}>{props.language.up}</div>
					<div className={`fw-bold`}>-----</div>
					<div className={`fw-bold border border-3 rounded px-3 ${props.xlg ? 'fs-2' : 'fs-4'}`}>v</div>
					<div className={`fw-bold ${props.xlg ? 'fs-2' : 'fs-4'}`}>{props.language.down}</div>
				</div>
			</div>
		</div>
	)
}

function PongCanvasLocal({setWinner}) {

	const canvas = document.getElementById("pongCanvas")
	const context = canvas.getContext("2d")
	var interval = undefined

	useEffect(() => {
		return () => {
			context.reset()
			clearInterval(interval)
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
		console.log(e)
		if (e.key === 'ArrowUp' && user2.y > 0)
			user2.y -= 25
		else if (e.key === 'ArrowDown' && user2.y < 100)
			user2.y += 25
		else if (e.key === 'z' && user1.y > 0)
			user1.y -= 25
		else if (e.key === 's' && user1.y < 100)
			user1.y += 25
		else if (e.key === ' ' && !document.getElementById('startSign').hidden) {
			interval = setInterval(game, 1000/60)
			document.getElementById('startSign').hidden = true	
		}
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
    
        if (ball.x - ball.radius < 0) {
            user2.score++
			document.getElementById('scorePlayer2').innerHTML = user2.score
			if (user2.score === 5) {
				setWinner(2)
				context.clearRect(0, 0, canvas.width, canvas.height)
			}
            resetBall()
        }
		else if (ball.x + ball.radius > canvas.width) {
            user1.score++
			document.getElementById('scorePlayer1').innerHTML = user1.score
			if (user1.score === 5) {
				setWinner(1)
				context.clearRect(0, 0, canvas.width, canvas.height)
			}
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
		if (user1.score === 5 || user2.score === 5)
			return
        update()
        render()
	}

	render()

	// if (document.getElementById('startSign') && document.getElementById('startSign').hidden)
	// 	interval = setInterval(game, 1000/60)
		
}