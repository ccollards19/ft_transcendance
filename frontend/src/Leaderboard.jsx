import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

export default function Leaderboard({props}) {

	const [champions, setChampions] = useState(undefined)

	useEffect (() => {
		if (!champions) {
			fetch('/profiles/leaderboard/' + props.settings.game + '/').then(response => {
				if (response.status === 200) {
					response.json().then(data => setChampions(data))
				}
			})
		}
		const interval = setInterval(() => {
			fetch('/profiles/leaderboard/' + props.settings.game + '/').then(response => {
				if (response.status === 200) {
					response.json().then(data => setChampions(data))
				}
			})
		}, 3000)
		return () => clearInterval(interval)
	}, [champions, props.settings.game])

	if (!champions)
		return <div className="d-flex justify-content-center align-items-center noScrollBar" style={props.customwindow}><img src="/images/loading.gif" alt="" /></div>

	const changeGame = e => {
		let game = e.target.dataset.game
		props.setSettings({...props.settings, game : game})
		setChampions(undefined)
	}

	const getGameName = () => {
		if (props.language.menu1 === 'Login')
			return 'Chess'
		else if (props.language.menu1 === 'Connexion')
			return 'Echecs'
		return 'Schach'
	}

	let rank = 1
	let index = 1

    return (
        <div style={props.customwindow}>
            <div className="d-flex mb-0 justify-content-center align-items-center fw-bold fs-2" style={{minHeight: '10%'}}>
                {props.language.menu6} (<button type='button' className='nav-link text-primary text-capitalize' data-bs-toggle='dropdown'>{props.settings.game === 'pong' ? 'pong' : getGameName()}</button>)
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
            <span className="ms-2">{props.language.tip}</span>
            <ul className="list-group mt-2">
                <li id="leaderhead" className="list-group-item w-100 d-flex p-1 pt-2 gap-3 pe-4">
                    <span className="d-flex justify-content-center" style={{width: props.xxxlg ? '5%' : '10%'}}><i>#</i></span>
                    <span style={{width: props.xxxlg ? '5%' : '10%'}}>Avatar</span>
                    <span className={props.sm ? '' : 'ps-2'} style={{width: props.xxxlg ? '50%' : ' 60%'}}>{props.language.name}</span>
                    {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">Matches</span>}
                    {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">{props.language.wins}</span>}
                    {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">{props.language.losses}</span>}
                    <span style={{width: '10%'}} className="d-flex justify-content-center">ELO</span>
                </li>
            </ul>
            <div className="overflow-auto noScrollBar d-flex" style={{maxHeight: '70%'}}>
				<ul className="list-group mt-2 w-100">
					{champions && champions.map(champion => { return <Champion key={index++} props={props} profile={champion} rank={rank++} />})}
				</ul>
            </div>
        </div>
    )
}

function Champion({props, profile, rank}) {

	return (
		<li className={`list-group-item w-100 d-flex align-items-center p-1 gap-3 pe-4 ${rank % 2 === 0 && 'bg-light'}`} style={{minHeight: '55px'}} key={profile.id}>
            <span style={{width: props.xxxlg ? '5%' : '10%'}} className="d-flex justify-content-center">{rank}</span>
            <span style={{width: props.xxxlg ? '5%' : '10%'}} className="h-100">
                <Link to={'/profile/' + profile.id}><img src={profile.avatar} className="profileLink rounded-circle" alt="" title='See profile' style={{height: '45px', width: '45px'}} /></Link>
            </span>
            <span className={props.sm ? '' : 'ps-2'} style={{width: props.xxxlg ? '50%' : '60%'}}>{profile.name}</span> 
            {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">{profile.matches}</span>}
            {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">{profile.wins}</span>}
            {props.md && <span style={{width: '10%'}} className="d-flex justify-content-center">{profile.losses}</span>}
            <span style={{width: '10%'}} className="d-flex justify-content-center">{profile.level}</span>
        </li>
	)
}
