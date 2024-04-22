import { useState, useEffect } from "react"
import { Champion } from "./other.jsx"

export default function Leaderboard({props}) {

	const [champions, setChampions] = useState(undefined)

	var game = props.settings.game

	/*
	Attendu :
	{
		"action" : "swap",
		"id1" : "id1"
		"id2" : "id2"
		//
		"action" : "addChampion" / "updateChampion",
		"item" : {
			"avatar",
			"name",
			"id",
			"status"
		}
	}
	*/

	useEffect (() => {
		if ((props.socket.page !== 'leaderboard' || props.socket.game !== game) && props.socket.readyState === 1) {
			props.socket.send(JSON.stringify({component : 'leaderboard', game : game}))
			props.socket.page = 'leaderboard'
			props.socket.game = game
			setChampions([])
		}
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
			else if (data.action === 'swap') {
				let tmp = Array.from(champions)
				let champ1 = tmp.find(champion => champion.id === data.id1)
				let champ2 = tmp.find(champion => champion.id === data.id2)
				tmp.splice(tmp.findIndex(champion => champion.id === data.id1), 1, champ2)
				tmp.splice(tmp.findIndex(champion => champion.id === data.id2), 1, champ1)
				setChampions(tmp)
			}
			else if (data.action === 'addChampion') 
				setChampions([...champions, {id : data.item.id, item : data.iem}])
			else if (data.action === 'updateChampion')
				setChampions(champions.map(champion => {
					if (champion.id === data.id)
						return {...champion, item : data.item}
					else
						return champion
				}))
			}
	}, [props.socket, champions, game])

	if (!champions)
		return <div className="d-flex justify-content-center align-items-center" style={props.customwindow}><img src="/images/loading.gif" alt="" /></div>

	let rank = 1
	let index = 1

    return (
        <div style={props.customwindow}>
            <div className="d-flex mb-0 justify-content-center align-items-center fw-bold fs-2" style={{minHeight: '10%'}}>
                Leaderboard (<button type='button' className='nav-link text-primary text-capitalize' data-bs-toggle='dropdown'>{props.settings.game}</button>)
                <ul className='dropdown-menu bg-light'>
                    <li type='button' onClick={() => props.setSettings({...props.settings, game : 'pong'})} data-game='pong' className="dropdown-item d-flex align-items-center">
            		    <img data-game='pong' src="/images/joystick.svg" alt="" />
            		    <span data-game='pong' className="ms-2">Pong</span>
            		</li>
            		<li type='button' onClick={() => props.setSettings({...props.settings, game : 'chess'})} data-game='chess' className="dropdown-item d-flex align-items-center">
            		    <img data-game='chess' src="/images/hourglass.svg" alt="" />
            		    <span data-game='chess' className="ms-2">Chess</span>
            		</li>
                </ul>
            </div>
            <span className="ms-2">Tip : Click on an avatar to see the player's profile</span>
            <ul className="list-group mt-2">
                <li id="leaderhead" className="list-group-item w-100 d-flex p-1 pt-2 gap-3 pe-4">
                    <span className="d-flex justify-content-center" style={{width: props.xxxlg ? '5%' : '10%'}}><i>#</i></span>
                    <span style={{width: props.xxxlg ? '5%' : '10%'}}>Avatar</span>
                    <span className={props.sm ? '' : 'ps-2'} style={{width: props.xxxlg ? '50%' : ' 60%'}}>Name</span>
                    {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">Matches</span>}
                    {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">Wins</span>}
                    {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">Loses</span>}
                    <span style={{width: '10%'}} className="d-flex justify-content-center">Level</span>
                </li>
            </ul>
            <div className="overflow-auto noScrollBar d-flex" style={{maxHeight: '70%'}}>
				<ul className="list-group mt-2 w-100">
					{champions && champions.map(champion => { return <Champion key={index++} props={props} profile={champion.item} rank={rank++} />})}
				</ul>
            </div>
        </div>
    )
}

