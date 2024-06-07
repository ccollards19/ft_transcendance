import Pong3D from "./niespana/Pong3d.js"
import ThreeD from "./niespana/testThree.js"
import { base_url } from "./niespana/testThree.js"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

function getNewRoomId(){
	let number = fetch(base_url + "game/room/number").then(res =>{
		return res.json()
	}).then(data =>{
		return data
	})
	return number
}
export function Pong(){
	return <Pong3D/>
}

export function Chess(){
	let roomid = getNewRoomId()
	console.log("id =", roomid)
	return <ThreeD id1="1" id2="2" roomid={roomid}/>
				
}

export default function Game({props}) {

	const [socket, setSocket] = useState(undefined)

	const roomId = useParams().room
	const game = useParams().game
	console.log(typeof(roomId))

  const winGame = () => {
    if (socket)
		  socket.send(JSON.stringify({action : 'win'}))
    console.log("win")
  }
  
  const giveUp = () => {
    if (socket)
		  socket.send(JSON.stringify({action : 'giveUp'}))
    console.log("giveup")
  }

	useEffect(() => {
		if (!socket)
			setSocket(new WebSocket("ws://" + window.location.host + "/ws/" + game + '/' + roomId + '/'))
		else {
			socket.onmessage = e => {
				let data = JSON.parse(e.data)
        if (data === "endGame")
          socket.close()
		      // navigate('/')
				console.log(data)
			}
		}
	}, [socket, game, roomId])

	return <div className="d-flex text-center justify-content-center align-items-center fw-bold fs-1" style={props.customwindow}>
		<button onClick={winGame} type="button" className="btn btn-success">Success</button>
		<button onClick={giveUp} type='button' className='btn btn-danger'>Give up</button>
	</div>

	// const [info, setInfo] = useState({game : 'pong'})

	// let match = parseInt(useParams().match, 10)

	// if (isNaN(match))
	// 	props.setHack(true)
	
	// if (!info) {
	// 	let xhr = new XMLHttpRequest()
	// 	xhr.open('GET', '/game/room/' + match + '/')
	// 	xhr.onload = () => setInfo(JSON.parse(xhr.response))
	// 	xhr.send()
	// }


	// return (
	// 	<div className='w-100 h-100'>
	// 		{info.game === 'pong' ?
	// 			<Pong props={props} info={info} /> :
	// 			<Chess props={props} info={info} />
	// 		}
	// 	</div>
	// )
}

