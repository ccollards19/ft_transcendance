import React, { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"

export default function Tournaments({props}) {

	const [tournaments, setTournaments] = useState(undefined)
	const id = parseInt(useParams().id, 10)

	useEffect (() => {
		if (id === 0 && !tournaments) {
			props.socket.send(JSON.stringify({
				component : 'tournaments',
				action : undefined,
				item : {game : props.settings.game}
			}))
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
			}
			const interval = setInterval(() => {
				props.socket.send(JSON.stringify({
					component : 'tournaments',
					action : undefined,
					item : {game : props.settings.game}
				}))
			}, 3000)
			return () => clearInterval(interval)
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

const Tab = ({props, myProfile, title, onClick, active = false}) => {
	const onClickTab = e => {
		if (myProfile) {
			e.preventDefault(0)
			onClick(title)
		}
	}

	const getTitle = () => {
		if (title === 'All Tournaments') {
			if (props.language.menu1 === 'Connexion')
				return 'Tous les tournois'
			else if (props.language.menu1 === 'Verbindung')
				return 'Alle Turniere'
		}
		else if (title === 'My subscriptions') {
			if (props.language.menu1 === 'Connexion')
				return 'Mes inscriptions'
			else if (props.language.menu1 === 'Verbindung')
				return 'Meine Anmeldungen'
		}
		else if (title === 'My Tournaments') {
			if (props.language.menu1 === 'Connexion')
				return 'Mes tournois'
			else if (props.language.menu1 === 'Verbindung')
				return 'Meine Turniere'
		}
		return title
	}

	return (
		<>
		  <li key={title} className={`${active && "active text-primary"} ${myProfile && 'tab-item'} ${!myProfile && title !== 'All Tournaments' ? 'text-body-tertiary' : ''} d-flex flex-grow-1 justify-content-center p-3 fw-bold text-uppercase ${title === 'All Tournaments' && 'rounded-start-2'} ${title === 'My Tournaments' && 'rounded-end-2'}`} onClick={onClickTab}>
			{getTitle()}
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
					props={props}
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

function AllTournaments({props, list}) {

	const changeGame = e => {
		let game = e.target.dataset.game
		props.setSettings({...props.settings, game : game})
		props.socket.send(JSON.stringify({
			component : 'tournaments',
			action : undefined,
			item : {game : game}
		}))
	}

	let index = 0

    return (
		<>
		<div className="d-flex mb-0 justify-content-center align-items-center fw-bold fs-2" style={{minHeight: '10%'}}>
			{props.language.menu7} (<button type='button' className='nav-link text-primary text-capitalize' data-bs-toggle='dropdown'>{props.settings.game}</button>)
            	    <ul className='dropdown-menu bg-light'>
            	        <li type='button' onClick={changeGame} data-game='pong' className={`dropdown-item d-flex align-items-center`}>
            			    <img data-game='pong' src="/images/joystick.svg" alt="" />
            			    <span data-game='pong' className="ms-2">Pong</span>
            			</li>
            			<li type='button' onClick={changeGame} data-game='chess' className="dropdown-item d-flex align-items-center">
            			    <img data-game='chess' src="/images/hourglass.svg" alt="" />
            			    <span data-game='chess' className="ms-2">{props.language.chess}</span>
            			</li>
            	    </ul>
            	</div>
                <Tabs props={props}>
					<ul title='All Tournaments' className="list-group" key='all'>
                    <div className='d-flex justify-content-center gap-3 my-2'>
                        <div className='bg-white border border-black border-3 rounded py-1 d-flex justify-content-center fw-bold' style={{width: '100px'}}>{props.language.ongoing}</div>
                        <div className='bg-dark-subtle border border-black border-3 rounded py-1 d-flex justify-content-center fw-bold' style={{width: '100px'}}>{props.language.over}</div>
                    </div>
						{list.filter(tournament => tournament.winnerId === 0 && tournament.reasonForNoWinner === '').map(tournament => <Tournament key={index++} props={props} tournament={tournament.item} />)}
						{list.filter(tournament => tournament.winnerId > 0 || tournament.reasonForNoWinner !== '').map(tournament => <Tournament key={index++} props={props} tournament={tournament.item} />)}
					</ul>
					<ul title='My subscriptions' className="list-group" key='sub'>
						{props.myProfile && list.filter(tournament => props.myProfile.subscriptions.includes(tournament.id)).map(tournament => <Tournament key={index++} props={props} tournament={tournament.item} />)}
					</ul>
                    <div title='My Tournaments' key='my'>
                        <div className='d-flex justify-content-center'><Link to='/newTournament' type='button' className='btn btn-secondary my-2'>{props.language.createTournament}</Link></div>
					    <ul className="list-group">
							{props.myProfile && list.filter(tournament => props.myProfile.tournaments.includes(tournament.id)).map(tournament => <Tournament key={index++} props={props} tournament={tournament.item} />)}
					    </ul>
                    </div>
				</Tabs>
		</>
	)
}

function SpecificTournament({props, id}) {

	const [tournament, setTournament] = useState(undefined)
	const [matches, setMatches] = useState(undefined)
	const navigate = useNavigate()

	useEffect(() => {
		if (!tournament) {
			props.socket.send(JSON.stringify({
				component : 'tournament',
				action : undefined,
				item : {id : id}
			}))
		}
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
			else if (data.action === 'setMatches')
				setMatches(data.item)
			else if (data.action === 'setTournament')
				setTournament(data.item)
		}
		const interval = setInterval(() => {
			props.socket.send(JSON.stringify({
				component : 'tournament',
				action : undefined,
				item : {id : id}
			}))
		}, 3000)
		return () => clearInterval(interval)
	}, [props.socket, props.socket.onmessage, matches, tournament, id])

	if (!tournament)
		return <div className='w-100 h-100 d-flex align-items-center justify-content-center noScrollBar'><img src="/images/loading.gif" alt="" /></div>

	const modifyDesc = () => {
		document.getElementById('changeDesc').value = tournament.description
		document.getElementById('description').hidden = !document.getElementById('description').hidden
		document.getElementById('descriptionForm').hidden = !document.getElementById('descriptionForm').hidden
	}

	const modifyTournament = () => {
		props.socket.send(JSON.stringify({
			component : 'sepcificTournament',
			action : 'description',
			item : {value : document.getElementById('changeDesc').value}
		}))
	}

	const captureKey = e => {
		if (e.keyCode === 13)
			e.preventDefault()
	}

	let index = 1
	
	return (
		<>
			<div className={`d-flex flex-column align-items-center pt-2 pb-1 rounded ${tournament.background === '' && 'bg-white border border-3 border-success'}`} style={{backgroundImage: 'url("/images/' + tournament.background + '")' ,backgroundSize: 'cover'}}>
				<div style={{height: '150px', width: '150px'}}><img src={'/images/'.concat(tournament.picture)} className="rounded-circle" alt="" style={{height: '100%', width: '100%'}} /></div>
				<span className={`fs-1 fw-bold text-danger-emphasis text-decoration-underline mt-1 ${tournament.background !== '' && 'bg-white rounded border border-black p-1'}`}>{tournament.title}</span>
				<span>
					<span className={`fw-bold ${tournament.background !== '' && 'bg-white rounded border border-black p-2'}`}>{props.language.organizer} : 
						<button onClick={() => navigate('/profile/' + tournament.organizerId)} title='See profile' className="ms-1 nav-link d-inline fs-4 text-primary text-decoration-underline mb-1" disabled={tournament.organizerId === 0}>
						{props.myProfile && tournament.organizerId === props.myProfile.id ? props.language.you : tournament.organizerName}
						</button>
					</span>
				</span>
			</div>
			<div className="d-flex justify-content-center fs-3 text-danger-emphasis text-decoration-underline fw-bold">{tournament.game === 'pong' ? 'Pong' : props.language.chess}</div>
			<span className="ps-2 fs-3 fw-bold text-danger-emphasis text-decoration-underline">{props.language.matchHistory}</span>
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
					{props.language.bePatient}
				</div> }
				<div className="mt-5 ms-3">
					{tournament.winnerId === 0 ?
						<button type="button" className="btn btn-secondary">{props.language.state}</button> : 
						<span className="border border-5 border-danger px-1 py-2 rounded bg-white fw-bold fs-6">
							{props.language.winner} : 
							<button onClick={() => navigate('/profile/' + tournament.winnerId)} title='See profile' className="nav-link d-inline fs-4 ms-1 text-primary text-decoration-underline">
								{props.myProfile && tournament.winnerId === props.myProfile.id ? props.language.you : tournament.winnerName}
							</button>
						</span>}
					<div id='descriptionDiv' className="mt-2">
                        <p className={`d-flex gap-2 mt-1 ${!props.md && 'justify-content-center'}`}>
                            <button onClick={modifyDesc} title={props.myProfile && tournament.organizerId === props.myProfile.id ? 'Modify description' : undefined} className={`nav-link text-decoration-underline fs-3 fw-bold ${props.myProfile && tournament.organizerId === props.myProfile.id ? 'myProfile' : ''}`} disabled={!props.myProfile || tournament.organizerId !== props.myProfile.id}>Description</button>
                        </p>
                        <div id='description' className="w-100 m-0 fs-4">{tournament.description}</div>
                        <div id='descriptionForm' style={{maxWidth : '300px'}} hidden>
                            <form className="d-flex flex-column" action='/modifyMyProfile.jsx'>
							<textarea onKeyDown={captureKey} id="changeDesc" name="description" cols="50" rows="5"></textarea>
                                <span><button onClick={modifyTournament} name='changeCP' type="button" className="btn btn-success my-1">{props.language.saveChange}</button></span>
                                <span><button onClick={modifyDesc} type="button" className="btn btn-danger mb-3">{props.language.cancelChange}</button></span>
                            </form>
                        </div>
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
		let tag = 'tournament_id' + tournament.id
		props.setChats([...props.chats, {tag : tag, name : tournament.title, autoScroll : true, messages : []}])
		props.setChanTag(tag)
		props.setChanName(tournament.title)
		props.socket.send(JSON.stringify({component : "chat", action : "join_chat", item : {chat : tag}}))
	}

	return (
		<li className={`list-group-item d-flex ${!props.sm && 'flex-column'} align-items-center px-2 py-1 border border-2 rounded ${tournament.winnerId === 0 && tournament.reasonForNoWinner === "" ? 'bg-white' : 'bg-dark-subtle'}`} key={tournament.id} style={{minHeight: '50px'}}>
			<img className="rounded-circle" title='See profile' src={"/images/".concat(tournament.picture)} alt="" style={{width: '45px', height: '45px'}} />
			<div className={`d-flex justify-content-between align-items-center fw-bold ms-2 flex-grow-1 ${!props.sm && 'flex-column text-center'}`}>
				<span>{tournament.title} <span className="text-danger-emphasis fw-bold" hidden={!props.myProfile || tournament.organizerId !== props.myProfile.id}>({props.language.youOrganize})</span></span>
				<div className={`d-flex gap-2 ${!props.sm && 'd-flex flex-column align-items-center'}`}>
					<button onClick={joinChat} type='button' className="btn btn-success" disabled={(props.chats.find(item => item.name === tournament.title)) || (tournament.winnerId > 0 || tournament.reasonForNoWinner !== '')}>{props.language.joinChat}</button>
					<Link to={'/tournaments/' + tournament.id} className="btn btn-secondary">{props.language.seePage}</Link>
				</div>
			</div>
		</li>
	)

}

export function NewTournament({props}) {

	const [picture, setPicture] = useState(undefined)
	const [bg, setBg] = useState(undefined)
	const navigate = useNavigate()

	props.socket.send(JSON.stringify({
		component : 'NewTournament',
		action : undefined,
		item : undefined
	}))

	useEffect(() => {
		if (!props.myProfile)
			navigate('/')
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
		}
	})

	const changeFile = e => {
		if (e.target.files && e.target.name === 'picture') {
			document.getElementById('noPicture').hidden = true
			setPicture(e.target.files[0])
		}
		else if (e.target.files && e.target.name === 'background')
			setBg(e.target.files[0])
	}

	const checkIssues = () => {
		let issue = true
		if (document.getElementById('title').value === '') {
			document.getElementById('title').classList.add('border', 'border-3', 'border-danger')
			issue = false
		}
		if (!picture) {
			document.getElementById('noPicture').hidden = false
			issue = false
		}
		return issue
	}

	const createTournament = async () => {
		if (checkIssues()) {
			const picData = new FormData()
			picData.append('file', picture)
			const bgData = new FormData()
			bg && bgData.append('file', bg)
			try {
				await fetch('/api/files', {
					method : 'POST',
					body : picData
				})
				if (bg) {
					await fetch('/api/files', {
						method : 'POST',
						body : bgData
					})
				}
				let xhr = new XMLHttpRequest()
				xhr.open('POST', '/tournaments/create/')
				xhr.onload = () => {
					if (xhr.status === 201)
						navigate('/tournaments/' + JSON.parse(xhr.response).id)
				}
				xhr.send(JSON.stringify({
					game : document.getElementById('game').value,
					organizerId : props.myProfile.id,
					organizerName : props.myProfile.name,
					picture : picture.name,
					title : document.getElementById('title').value,
					background : bg && bg.name,
					maxContenders : document.getElementById('maxContenders').value,
					selfContender : document.getElementById('selfContender').checked
				}))
			}
			catch (e) { window.alert('An error has occured. Try again') }
		}
	}

	const captureKey = e => {
		let list = document.getElementById('title').classList
		list.contains('border') && list.remove('border', 'border-3', 'border-danger')
		if (e.keyCode === 13)
			e.preventDefault()
	}

	return (
		<div className={`d-flex flex-column align-items-center`} style={props.customwindow}>
			<form className={`${props.md ? 'w-50' : 'w-100'} p-2 border border-3 border-black rounded bg-secondary d-flex flex-grow-1 flex-column justify-content-center align-items-center text-dark`}>
                <h2 className="text-center pt-2 fs-3 fw-bold">{props.language.tournamentCreation}</h2>
                <label htmlFor="game" className="form-label ps-2 pt-3">{props.language.tournamentGame}</label>
                <select name="game" id="game" className="form-select w-50" defaultValue='tournPong'>
                    <option id='tournPong' value="pong">Pong</option>
                    <option id='tournChess' value="chess">{props.language.chess}</option>
                </select>
				<div className="d-flex flex-column align-items-center pt-3">
                    <label htmlFor="title" className="form-label">{props.language.tournamentTitle}</label>
                    <input onKeyDown={captureKey} type="text" id="title" name="title" className="form-control" maxLength="30" />
					<p id='existingName' hidden>{props.language.existingTournamentName}</p>
                </div>
				<div className='d-flex flex-column align-items-center mt-1'>
					<label htmlFor="tournamentPic" className='form-label'>{props.language.tournamentPic}</label>
					<input onChange={changeFile} name='picture' id='tournamentPic' type="file" accept='image/*' />
					<label htmlFor="tournamentPic">{props.language.upload}</label>
					{picture && <span className="mt-1 text-white text-decoration-underline">{picture.name}</span>}
					<p id='noPicture' className="text-danger-emphasis" hidden>{props.language.noPicture}</p>
				</div>
				<div className='d-flex flex-column align-items-center mt-2'>
					<label htmlFor="tournamentBG" className="form-label">{props.language.tournamentBg}</label>
					<input onChange={changeFile} name='background' id='tournamentBG' type="file" accept='image/*' style={{width: '100px'}} />
                    <label htmlFor="tournamentBG">{props.language.upload}</label>
					{bg && <span className="mt-1 text-white text-decoration-underline">{bg.name}</span>}
				</div>
				<div className="d-flex flex-column align-items-center pt-4">
                    <label htmlFor="maxContenders" className="form-label">{props.language.maxContenders}</label>
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
				<div className="w-50 pt-4 d-flex justify-content-center">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" name="selfContender" id="selfContender" />
                      <label className="form-check-label" htmlFor="selfContender">{props.language.selfContender}</label>
                    </div>
                </div>
                <button onClick={createTournament} type="button" className="btn btn-primary mt-3">{props.language.validateTournament}</button>
            </form>
		</div>
	)

}
