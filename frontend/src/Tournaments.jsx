import React, { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"

const Tab = ({myProfile, title, onClick, active = false}) => {
	const onClickTab = e => {
		if (myProfile) {
			e.preventDefault(0)
			onClick(title)
		}
	}

	return (
		<>
		  <li key={title} className={`${active && "active text-primary"} ${myProfile && 'tab-item'} ${!myProfile && title !== 'All Tournaments' ? 'text-body-tertiary' : ''} d-flex flex-grow-1 justify-content-center p-3 fw-bold text-uppercase ${title === 'All Tournaments' && 'rounded-start-2'} ${title === 'My Tournaments' && 'rounded-end-2'}`} onClick={onClickTab}>
			{title}
		  </li>
		</>)
}

function Tabs({children, props}) {

	const [activeTab, setActiveTab] = useState('All Tournaments')

	const onClickTabItem = tab => setActiveTab(tab)

  	return (
  	  <>
  	    <div key='tabs' className="tabs" style={{maxHeight: '100%'}}>
  	      <ul className={`tab-list p-0 d-flex ${!props.md && 'flex-column'} overflow-auto noScrollBar bg-white rounded-start-2 rounded-end-2 mb-1`}>
  	        {children.map(tab => {
  	          const { title } = tab.props

  	          return (
  	            <Tab
					myProfile={props.myProfile}
					key={title}
  	              	title={title}
  	              	onClick={onClickTabItem}
  	              	active={title === activeTab ? true : false}
  	            />
  	          )
  	        })}
  	      </ul>

  	      <div className="tab-content overflow-auto noScrollBar" style={{maxHeight: '700px'}}>
  	        {children.map(tab => {
  	          if (tab.props.title !== activeTab) return undefined

  	          return tab.props.children
  	        })}
  	      </div>
  	    </div>
  	  </>
  	)
}

export function AllTournaments({props, list}) {

	const changeGame = e => {
		let game = e.target.dataset.game
		props.setSettings({...props.settings, game : game})
		props.socket.send(JSON.stringify({
			component : 'tournaments',
			action : '',
			item : {game : game}
		}))
	}

    return (
		<>
		<div className="d-flex mb-0 justify-content-center align-items-center fw-bold fs-2" style={{minHeight: '10%'}}>
            	    Tournaments (<button type='button' className='nav-link text-primary text-capitalize' data-bs-toggle='dropdown'>{props.settings.game}</button>)
            	    <ul className='dropdown-menu bg-light'>
            	        <li type='button' onClick={changeGame} data-game='pong' className={`dropdown-item d-flex align-items-center`}>
            			    <img data-game='pong' src="/images/joystick.svg" alt="" />
            			    <span data-game='pong' className="ms-2">Pong</span>
            			</li>
            			<li type='button' onClick={changeGame} data-game='chess' className="dropdown-item d-flex align-items-center">
            			    <img data-game='chess' src="/images/hourglass.svg" alt="" />
            			    <span data-game='chess' className="ms-2">Chess</span>
            			</li>
            	    </ul>
            	</div>
                <Tabs props={props}>
					<ul title='All Tournaments' className="list-group" key='all'>
                    <div className='d-flex justify-content-center gap-3 my-2'>
                        <div className='bg-white border border-black border-3 rounded py-1 d-flex justify-content-center fw-bold' style={{width: '100px'}}>Ongoing</div>
                        <div className='bg-dark-subtle border border-black border-3 rounded py-1 d-flex justify-content-center fw-bold' style={{width: '100px'}}>Over</div>
                    </div>
						{list.map(tournament => <Tournament key={tournament.id} props={props} tournament={tournament.item} />)}
					</ul>
					<ul title='My subscriptions' className="list-group" key='sub'>
						{props.myProfile && list.map(tournament => {
							if (props.myProfile.subscriptions.includes(tournament.id))
								return <Tournament key={tournament.id} props={props} tournament={tournament.item} />
							else
								return undefined
						})}
					</ul>
                    <div title='My Tournaments' key='my'>
                        <div className='d-flex justify-content-center'><Link to='/newTournament' type='button' className='btn btn-secondary my-2'>Create a tournament</Link></div>
					    <ul className="list-group">
							{props.myProfile && list.map(tournament => {
								if (props.myProfile.tournaments.includes(tournament.id))
									return <Tournament key={tournament.id} props={props} tournament={tournament.item} />
								else
									return undefined
							})}
					    </ul>
                    </div>
				</Tabs>
		</>
	)
}

export function SpecificTournament({props, id}) {

	const [tournament, setTournament] = useState(undefined)
	const [matches, setMatches] = useState(undefined)
	const navigate = useNavigate()

	useEffect(() => {
		if ((props.socket.page !== 'tournament' || (props.socket.id && props.socket.id !== id)) && props.socket.readyState === 1) {
			props.socket.send(JSON.stringify({
				component : 'tournament',
				action : '',
				item : {id : id}
			}))
			props.socket.page = 'tournament'
			props.socket.id = id
			setMatches(undefined)
		}
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
			else if (data.action === 'setMatches')
				setMatches(data.item)
			else if (data.action === 'addMatch')
				setMatches([...matches, {id : data.item.id, item : data.item}])
			else if (data.action === 'setTournament') {
				setTournament(data.item)
				setMatches([])
			}
		}
	}, [props.socket, props.socket.page, props.socket.onmessage, props.socket.id, props.socket.readyState, matches, tournament, id])

	if (!tournament)
		return <div className='w-100 h-100 d-flex align-items-center justify-content-center noScrollBar'><img src="/images/loading.gif" alt="" /></div>

	let index = 1
	
	return (
		<>
			<div className={`d-flex flex-column align-items-center pt-2 pb-1 rounded ${tournament.background === '' && 'bg-white border border-3 border-success'}`} style={{backgroundImage: 'url("/images/' + tournament.background + '")' ,backgroundSize: 'cover'}}>
				<div style={{height: '150px', width: '150px'}}><img src={'/images/'.concat(tournament.picture)} className="rounded-circle" alt="" style={{height: '100%', width: '100%'}} /></div>
				<span className={`fs-1 fw-bold text-danger-emphasis text-decoration-underline mt-1 ${tournament.background !== '' && 'bg-white rounded border border-black p-1'}`}>{tournament.title}</span>
				<span>
					<span className={`fw-bold ${tournament.background !== '' && 'bg-white rounded border border-black p-1'}`}>Organizer : 
						<button onClick={() => navigate('/profile/' + tournament.organizerId)} title='See profile' className="ms-1 nav-link d-inline fs-4 text-primary text-decoration-underline" disabled={tournament.organizerId === 0}>
						{props.myProfile && tournament.organizerId === props.myProfile.id ? 'you' : tournament.organizerName}
						</button>
					</span>
				</span>
			</div>
			<div className="d-flex justify-content-center fs-3 text-danger-emphasis text-decoration-underline fw-bold">A {tournament.game} tournament !</div>
			<span className="ps-2 fs-3 fw-bold text-danger-emphasis text-decoration-underline">Match history</span>
			<div className="d-flex" style={{maxHeight: '50%'}}>
			{matches && 
				matches.length > 0 ?
				<div className="d-flex flex-column">
					<div className="d-flex" style={{maxHeight: '100%', width: props.sm ? '210px' : '160px'}}>
						<ul className="w-100 d-flex rounded w-100 list-group overflow-auto noScrollBar" style={{maxHeight: '100%'}}>
							{matches && matches.map(match => { return <History key={index++} props={props} match={match.item} />})}
						</ul>
					</div>
				</div> : 
				<div className="border border-2 border-black rounded d-flex justify-content-center align-items-center fw-bold px-3" style={{maxHeight: '100%', width: props.sm ? '210px' : '160px'}}>
					The tournament just started, please be patient...
				</div> }
				<div className="mt-5 ms-3">
					{tournament.winnerId === 0 ?
						<button type="button" className="btn btn-secondary">See current state</button> : 
						<span className="border border-5 border-danger px-1 py-2 rounded bg-white fw-bold fs-6">
							Winner : 
							<button onClick={() => navigate('/profile/' + tournament.winnerId)} title='See profile' className="nav-link d-inline fs-4 ms-1 text-primary text-decoration-underline">
								{props.myProfile && tournament.winnerId === props.myProfile.id ? 'you' : tournament.winnerName}
							</button>
						</span>}
					<div className="mt-2">
						<span className="text-decoration-underline fs-3 fw-bold text-danger-emphasis">Description :</span>
						<div className="fw-bold fs-5 my-2">{tournament.description}</div>
					</div>
				</div>
			</div>
		</>
	)
}

export function History({props, match}) {

	const [player1, setPlayer1] = useState(undefined)
	const [player2, setPlayer2] = useState(undefined)

	if (!player1) {
		let xhr = new XMLHttpRequest()
		xhr.open('GET', '/api/user/' + match.contenders[0])
		xhr.onload = () => {
			if (xhr.status === 200) {
				let response = JSON.parse(xhr.response)
				setPlayer1({id : response.id, avatar : response.avatar})
			}
			else
				setPlayer1({id : 'none', avatar : 'none.jpg'})
		}
		xhr.send()
		return undefined
	}

	if (player1 && !player2) {
		let xhr = new XMLHttpRequest()
		xhr.open('GET', '/api/user/' + match.contenders[1])
		xhr.onload = () => {
			if (xhr.status === 200) {
				let response = JSON.parse(xhr.response)
				setPlayer2({id : response.id, avatar : response.avatar})
			}
			else
				setPlayer2({id : 'none', avatar : 'none.jpg'})
		}
		xhr.send()
		return undefined
	}

	return (
		<li className={`list-group-item d-flex ${props.sm ? 'px-4' : 'px-2'} align-items-center justify-content-between`} style={{minHeight: '90px'}}>
			<Link to={'/profile/' + player1.id} className="rounded-circle profileLink d-flex justify-content-center" title='See profile' style={{height: '60px', width: '60px', position: 'relative'}}>
				<img src={'/images/' + player1.avatar} alt="" style={{height: '60px', width: '60px', position: 'absolue'}} className="rounded-circle" />
				{player1.id !== 'none' && <img src={match.winner === player1.id ? '' : '/images/ban.svg'} alt="" style={{position: 'absolute'}} />}
			</Link>
			<span className="fs-1 fw-bold">X</span>
			<Link to={'/profile/' + player2.id} className="rounded-circle profileLink d-flex justify-content-center" title='See profile' style={{height: '60px', width: '60px', position: 'relative'}}>
				<img src={'/images/' + player2.avatar} alt="" style={{height: '60px', width: '60px', position: 'absolue'}} className="rounded-circle" />
				{player2.id !== 'none' && <img src={match.winner === player2.id ? '' : '/images/ban.svg'}  alt="" style={{position: 'absolute'}} />}
			</Link>
		</li>
	)

}

export function Tournament({props, tournament}) {

	const joinChat = () => {
		let tag = 'tournament?id=' + tournament.id
		props.setChats([...props.chats, {tag : tag, name : tournament.title, autoScroll : true, messages : []}])
		props.setChanTag(tag)
		props.setChanName(tournament.title)
		props.socket.send(JSON.stringify({component : "tournament", action : "join_chat", item : {chat : tag}}))
	}

	return (
		<li className={`list-group-item d-flex ${!props.sm && 'flex-column'} align-items-center px-2 py-1 border border-2 rounded ${tournament.winnerId === 0 && tournament.reasonForNoWinner === "" ? 'bg-white' : 'bg-dark-subtle'}`} key={tournament.id} style={{minHeight: '50px'}}>
			<img className="rounded-circle" title='See profile' src={"/images/".concat(tournament.picture)} alt="" style={{width: '45px', height: '45px'}} />
			<div className={`d-flex justify-content-between align-items-center fw-bold ms-2 flex-grow-1 ${!props.sm && 'flex-column text-center'}`}>
				<span>{tournament.title} <span className="text-danger-emphasis fw-bold" hidden={!props.myProfile || tournament.organizerId !== props.myProfile.id}>(You are the organizer)</span></span>
				<div className={`d-flex gap-2 ${!props.sm && 'd-flex flex-column align-items-center'}`}>
					<button onClick={joinChat} type='button' className="btn btn-success" disabled={props.chats.length === 5 || props.chats.find(item => item.name === tournament.name)}>Join Tournament's chat</button>
					<Link to={'/tournaments/' + tournament.id} className="btn btn-secondary">See tournament's page</Link>
				</div>
			</div>
		</li>
	)

}

export function Tournaments({props}) {

	const [tournaments, setTournaments] = useState(undefined)
	const id = parseInt(useParams().id, 10)

	useEffect (() => {
		if (id === 0 && props.socket.page !== 'tournaments' && props.socket.readyState === 1) {
			props.socket.send(JSON.stringify({
				component : 'tournaments',
				action : '',
				item : {game : props.settings.game}
			}))
			props.socket.page = 'tournaments'
		}
		if (id === 0) {
			props.socket.onmessage = e => {
				let data = JSON.parse(e.data)
				if (data.action === 'myProfile')
					props.socket.onMyProfile(data)
				else if (data.action === 'chat')
					props.socket.onChat(data)
				else if (data.action === 'setTournaments')
					setTournaments(data.item)
				else if (data.action === 'addTournament')
					setTournaments([...tournaments, {id : data.item.id, item : data.item}])
			}
		}
	}, [props.socket, props.socket.readyState, tournaments, id, props.settings])

	if (isNaN(id))
		props.setHack(true)
  

	if (id === 0 && !tournaments)
		return <div className="d-flex justify-content-center align-items-center noScrollBar" style={props.customwindow}><img src="/images/loading.gif" alt="" /></div>

	if (id > 0 && tournaments)
		setTournaments(undefined)

	return (
		<div style={props.customwindow}>
			{id > 0 ?
				<SpecificTournament props={props} id={id} /> :
                <AllTournaments props={props} list={tournaments} />
			}
		</div>
	)
}

export function NewTournament({props}) {

	const navigate = useNavigate()

	useEffect(() => {
		if (!props.myProfile)
			navigate('/')
	})

	if (props.socket.page !== 'newTournament' && props.socket.readyState === 1) {
		props.socket.send(JSON.stringify({component : 'NewTournament'}))
		props.socket.page = 'newTournament'
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
		}
	}

	const createTournament = () => {
		let newTournament = {
			game : document.getElementById('game').value,
			organizerId : props.myProfile.id,
			organizerName : props.myProfile.name,
			picture : '',
			title : document.getElementById('title').value,
			background : '',
			maxContenders : document.getElementById('maxContenders').value,
			timeout : document.getElementById('timeout').value,
			scope : '',
			selfContender : document.getElementById('selfContender').value
		}
		let xhr = new XMLHttpRequest()
		xhr.open('POST', '/api/newTournament/')
		xhr.onload = () => {
			if (xhr.response.detail && xhr.response.detail === 'Name already in use')
				document.getElementById('existingName').hidden = false
			else if (xhr.status === 201)
				document.getElementById('tournaments').trigger('click')
		}
		xhr.send(newTournament)
	}

	return (
		<div className={`d-flex flex-column align-items-center`} style={props.customwindow}>
			<form className={`${props.md ? 'w-50' : 'w-100'} p-2 border border-3 border-black rounded bg-secondary d-flex flex-grow-1 flex-column justify-content-center align-items-center text-dark`}>
                <h2 className="text-center pt-2 fs-3 fw-bold">Creation of a brand new tournament</h2>
                <label htmlFor="game" className="form-label ps-2 pt-3">What game will the contenders play ?</label>
                <select name="game" id="game" className="form-select w-50" defaultValue='tournPong'>
                    <option id='tournPong' value="pong">Pong</option>
                    <option id='tournChess' value="chess">Chess</option>
                </select>
				<div className="d-flex flex-column align-items-center pt-3">
                    <label htmlFor="title" className="form-label">Title of the tournament</label>
                    <input type="text" id="title" name="title" className="form-control" />
					<p id='existingName' hidden>A tournament with this title already exists</p>
                </div>
				<div className='d-flex flex-column align-items-center mt-1'>
					<label htmlFor="tournamentPic" className='form-label'>Choose a picture for the tournament</label>
					<input id='tournamentPic' type="file" accept='image/jpeg, image/png' />
					<label htmlFor="tournamentPic">Upload</label>
				</div>
				<div className='d-flex flex-column align-items-center mt-2'>
					<label htmlFor="tournamentBG" className="form-label">You may add a background image for the tournament</label>
					<input id='tournamentBG' type="file" accept='image/jpeg, image/png' style={{width: '100px'}} />
                    <label htmlFor="tournamentBG">Upload</label>
				</div>
				<div className="d-flex flex-column align-items-center pt-4">
                    <label htmlFor="maxContenders" className="form-label">Max number of contenders</label>
                    <select name="maxContenders" id="maxContenders" className="form-select w-50">
                        <option value="4">4</option>
                        <option value="8">8</option>
                        <option value="12">12</option>
                        <option value="16">16</option>
                        <option value="20">20</option>
                        <option value="24">24</option>
                        <option value="28">28</option>
                        <option value="32">32</option>
                    </select>
                </div>
                <div className="d-flex flex-column align-items-center pt-3">
                    <label htmlFor="timeout" className="form-label">Timeout</label>
                    <input type="text" id="timeout" name="timeout" className="form-control" defaultValue={0} />
					<span className="form-text">Time before a victory by forfeit (in hours)</span>
                    <span className="form-text">0 for no limit</span>
                </div>
				<div className="w-50 pt-4 d-flex justify-content-center">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" name="selfContender" id="selfContender" />
                      <label className="form-check-label" htmlFor="selfContender">Will you be a contender yourself ?</label>
                    </div>
                </div>
                <div className="w-100 pt-4 d-flex justify-content-center gap-2">
                    <div className="w-50 form-check form-check-reverse d-flex justify-content-end">
                        <label className="form-check-label pe-2" htmlFor="public">Public
                            <input className="form-check-input" type="radio" name="scope" value='public' id="public" checked />
                        </label>
                    </div>
                    <div className="w-50 form-check d-flex justify-content-start">
                        <label className="form-check-label ps-2" htmlFor="private">Private
                            <input className="form-check-input" type="radio" name="scope" value='private' id="private" />
                        </label>
                    </div>
                </div>
                <button onClick={createTournament} type="button" className="btn btn-primary mt-3">Create tournament</button>
            </form>
		</div>
	)

}

export default Tournaments
