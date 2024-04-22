import { useParams } from "react-router-dom"
import Pong3D from "./niespana/Pong3d.js"
import ThreeD from "./niespana/testThree.js"
import { base_url } from "./niespana/testThree.js"
import { useState } from "react"

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

	const [info, setInfo] = useState(undefined)

	let match = parseInt(useParams().match, 10)

	if (isNaN(match))
		props.setHack(true)
	
	if (!info) {
		let xhr = new XMLHttpRequest()
		xhr.open('GET', '/game/room/' + match + '/')
		xhr.onload = () => setInfo(JSON.parse(xhr.response))
		xhr.send()
	}

	return (
		<div className='w-100 h-100'>
			{info.game === 'pong' ?
				<Pong props={props} info={info} /> :
				<Chess props={props} info={info} />
			}
		</div>
	)
}

