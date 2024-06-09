import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import PongRemote from "./Pong/remote.jsx"
import ChessRemote from "./Chess/remote.jsx"
import TicTacToe from "./TicTacToe.jsx"

export default function Game({props}) {

	const [room, setRoom] = useState(null)
	const [socket, setSocket] = useState(null)
	const roomId = parseInt(useParams().room, 10)

	useEffect(() => {
		if (!room && !isNaN(roomId)) {
			fetch('/game/room/' + roomId + '/').then(response => {
				if (response.status === 200) {
					response.json().then(data => {
						setRoom(data)
						setSocket(new WebSocket("ws://" + window.location.host + "/ws/" + data.game + '/' + data.id + '/'))
					})
				}
			})
		}
		return () => {
			if (socket)
				socket.close()
		}
	})

	if (isNaN(roomId))
		props.setHack(true)

	if (!room)
		return undefined

	return <>{room.game === 'pong' ? <PongRemote props={props} socket={socket} room={room} /> : <ChessRemote props={props} socket={socket} room={room} />}</>

}

// export default function Game({props}) {

// 	const [socket, setSocket] = useState(undefined)
// 	const [room, setRoom] = useState(undefined)
// 	const [playState, setPlayState] = useState("play")
// 	const navigate = useNavigate()

// 	const roomId = parseInt(useParams().room, 10)

//   const startGame = () => {
//     if (socket)
// 		  socket.send(JSON.stringify({action : 'start', item : {}}))
//     console.log("start")
//   }
  
//   const winGame = () => {
//     if (socket)
// 		  socket.send(JSON.stringify({action : 'win', item : {}}))
//     console.log("win")
//   }
  
//   const giveUp = () => {
//     if (socket)
// 		  socket.send(JSON.stringify({action : 'giveUp', item : {}}))
//     console.log("giveup")
//   }

//   const replay = () => {
//     if (socket)
// 		  socket.send(JSON.stringify({action : 'replay', item : {}}))
//     setPlayState("play")
//     console.log("replay")
//   }
  
//   const quitGame = () => {
//     if (socket && playState !== "finished") {
// 		  socket.send(JSON.stringify({action : 'quit', item : {}}))
//       socket.close()
//     }
//     props.setMyProfile({...props.myProfile, room : undefined, playing : false})
//     navigate("/")
//     console.log("quit")
//   }

// 	useEffect(() => {
// 		if (!room) {
// 			fetch('/game/room/' + roomId + '/').then(response => {
// 				if (response.status === 200) {
// 					response.json().then(data => {
// 						setRoom(data)
// 						setSocket(new WebSocket("ws://" + window.location.host + "/ws/" + data.game + '/' + roomId + '/'))
// 						let tag = 'room_id' + roomId
// 						if (!props.chats.find(item => item.tag === tag)) {
// 							let name = data.player1.name + ' VS ' + data.player2.name
// 							props.setChats([...props.chats, {tag : tag, name : name, autoScroll : true, messages : []}])
// 							props.setChanTag(tag)
// 							props.setChanName(name)
// 							props.socket.send(JSON.stringify({action : "join_chat", item : {chat : tag}}))	
// 						}
// 					})
// 				}
// 			})
// 		}
// 		if (socket) {
// 			if (!room)
// 				socket.close(1000)
// 			socket.onmessage = e => {
// 				let data = JSON.parse(e.data)
// 				console.log(data)
//         if (data.action === "endRound") {
//           setPlayState(data.action)
//           console.log("endRound")
// 				}
//         else if (data.action === "play") {
//           setPlayState(data.action)
//           console.log("play")
// 				}
//         else if (data.action === "finished") {
//           setPlayState(data.action)
//           console.log("quitted")
// 				}
// 			}
// 		}
// 	}, [socket, roomId, room, props, navigate])

// 	if (!room)
// 		return undefined

// 	return (
// 		<div className="w-100 h-100">
// 			<div className="w-100 d-flex justify-content-between pt-3 px-3">
// 				<div className="d-flex gap-3 align-items-center" style={{maxWidth : '35%'}}>
// 					<img type='button' title={props.language.seeProfile} onClick={() => navigate('/profile/' + room.player1.id)} src={room.player1.avatar} className="rounded-circle" alt="" style={{width : '100px', height : '100px'}} />
// 					{props.lg && <span className="fw-bold fs-4 text-white">{room.player1.catchphrase}</span>}
// 				</div>
// 				<div className="d-flex gap-3 align-items-center" style={{maxWidth : '35%'}}>
// 					{props.lg && <span className="fw-bold fs-4 text-white">{room.player2.catchphrase}</span>}
// 					<img type='button' title={props.language.seeProfile} onClick={() => navigate('/profile/' + room.player2.id)} src={room.player2.avatar} className="rounded-circle" alt="" style={{width : '100px', height : '100px'}} />
// 				</div>
// 			</div>
// 			<div className="d-flex h-50 justify-content-center align-items-center">
//         { playState === "start" && <>
//             <button onClick={startGame} type='button' className='btn btn-success'>play</button>
//             <button onClick={quitGame} type='button' className='btn btn-danger'>Quit</button>
//           </>
//         }
//         { playState === "play" && <>
//             <button onClick={winGame} type="button" className="btn btn-success">Success</button>
//             <button onClick={giveUp} type='button' className='btn btn-danger'>Give up</button>
// 			<TicTacToe />
//           </>
//         }
//         { playState === "endRound" && <>
//             <button onClick={replay} type='button' className='btn btn-success'>Replay</button>
//             <button onClick={quitGame} type='button' className='btn btn-danger'>Quit</button>
//           </>
//         }
//         { playState === "finished" && <>
//             <button onClick={quitGame} type='button' className='btn btn-danger'>Quit</button>
//           </>
//         }
// 			</div>
// 		</div>
// 	)

// 	// const [info, setInfo] = useState({game : 'pong'})

// 	// let match = parseInt(useParams().match, 10)

// 	// if (isNaN(match))
// 	// 	props.setHack(true)
	
// 	// if (!info) {
// 	// 	let xhr = new XMLHttpRequest()
// 	// 	xhr.open('GET', '/game/room/' + match + '/')
// 	// 	xhr.onload = () => setInfo(JSON.parse(xhr.response))
// 	// 	xhr.send()
// 	// }


// 	// return (
// 	// 	<div className='w-100 h-100'>
// 	//  		{info.game === 'pong' ?
// 	//  			<Pong props={props} info={info} /> :
// 	//  			<Chess props={props} info={info} />
// 	//  		}
// 	//  	</div>
// 	//  )
// }

