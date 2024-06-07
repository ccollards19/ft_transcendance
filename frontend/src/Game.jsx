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
	const [room, setRoom] = useState(undefined)
	const navigate = useNavigate()

	const roomId = useParams().room
	const game = useParams().game

	useEffect(() => {
		if (!room) {
			fetch('/game/room/' + roomId + '/').then(response => {
				if (response.status === 200) {
					response.json().then(data => {
						setRoom(data)
						setSocket(new WebSocket("ws://" + window.location.host + "/ws/" + game + '/' + roomId + '/'))
						let tag = 'room_id' + roomId
						if (!props.chats.find(item => item.tag === tag)) {
							let name = data.player1.name + ' VS ' + data.player2.name
							props.setChats([...props.chats, {tag : tag, name : name, autoScroll : true, messages : []}])
							props.setChanTag(tag)
							props.setChanName(name)
							props.socket.send(JSON.stringify({action : "join_chat", item : {chat : tag}}))	
						}
					})
				}
			})
		}
		if (socket) {
			socket.onmessage = e => {
				let data = JSON.parse(e.data)
				console.log(data)
        		if (data.action === "endGame") {
        	  		socket.close()
			     	navigate('/')
				}
			}
		}
	}, [socket, game, roomId, room, props, navigate])

	if (!room)
		return undefined

	return (
		<div className="w-100 h-100 bg-black">
			<div className="w-100 d-flex justify-content-between pt-3 px-3">
				<div className="d-flex gap-3 align-items-center" style={{maxWidth : '35%'}}>
					<img type='button' title={props.language.seeProfile} onClick={() => navigate('/profile/' + room.player1.id)} src={room.player1.avatar} className="rounded-circle" alt="" style={{width : '100px', height : '100px'}} />
					{props.lg && <span className="fw-bold fs-4 text-white">{room.player1.catchphrase}</span>}
				</div>
				<div className="d-flex gap-3 align-items-center" style={{maxWidth : '35%'}}>
					{props.lg && <span className="fw-bold fs-4 text-white">{room.player2.catchphrase}</span>}
					<img type='button' title={props.language.seeProfile} onClick={() => navigate('/profile/' + room.player2.id)} src={room.player2.avatar} className="rounded-circle" alt="" style={{width : '100px', height : '100px'}} />
				</div>
			</div>
			<div className="d-flex h-50 justify-content-center align-items-center">
				<button onClick={() => socket.send(JSON.stringify({action : 'win', item : {}}))} type="button" className="btn btn-success">Success</button>
				<button onClick={() => socket.send(JSON.stringify({action : 'giveUp', item : {}}))} type='button' className='btn btn-danger'>Give up</button>
			</div>
		</div>
	)

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

