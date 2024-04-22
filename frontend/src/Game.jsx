import { useParams } from "react-router-dom"
import Pong3D from "./niespana/Pong3d.js"
import ThreeD from "./niespana/testThree.js"
import { base_url } from "./niespana/testThree.js"

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

	const match = parseInt(useParams().match, 10)
	const game = useParams().game

	if (isNaN(match))
		props.setHack(true)

	return (
		<div className='w-100 h-100'>
			{game === 'pong' ?
				<Pong props={props} match={match} /> :
				<Chess props={props} match={match} />
			}
		</div>
	)
}

