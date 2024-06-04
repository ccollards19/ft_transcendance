import React, { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"

export default function Tournaments({props}) {

	const [tournaments, setTournaments] = useState(undefined)
	const id = parseInt(useParams().id, 10)

	useEffect (() => {
		if (id === 0 && !tournaments && !isNaN(id)) {
			fetch('/tournaments/all/' + props.settings.game + '/').then(response => {
				if (response.status === 200) {
					response.json().then(data => setTournaments(data))
				}
			})
		}
		if (id === 0) {
			const interval = setInterval(() => {
				fetch('/tournaments/all/' + props.settings.game + '/').then(response => {
					if (response.status === 200) {
						response.json().then(data => setTournaments(data))
					}
				})
			}, 3000)
			return () => clearInterval(interval)
		}
	}, [tournaments, id, props.settings])

	if (isNaN(id))
		props.setHack(true)

	if (id === 0 && !tournaments)
		return <div className="d-flex justify-content-center align-items-center noScrollBar" style={props.customwindow}><img src="/images/loading.gif" alt="" /></div>

	if (id > 0 && tournaments)
		setTournaments(undefined)

	return (
		<div style={props.customwindow} className="noScrollBar">
			{id > 0 ?
				<SpecificTournament props={props} id={id} /> :
                <AllTournaments props={props} list={tournaments} setTournaments={setTournaments} />
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

function AllTournaments({props, list, setTournaments}) {

	const changeGame = e => {
		props.setSettings({...props.settings, game : e.target.dataset.game})
		setTournaments(undefined)
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
					<div title='All Tournaments' key='all'>
                    	<div className='d-flex justify-content-center gap-3 my-2'>
                    	    <div className='bg-white border border-black border-3 rounded py-1 d-flex justify-content-center fw-bold' style={{width: '100px'}}>{props.language.ongoing}</div>
                    	    <div className='bg-dark-subtle border border-black border-3 rounded py-1 d-flex justify-content-center fw-bold' style={{width: '100px'}}>{props.language.over}</div>
                    	</div>
						<div style={{maxHeight : '80%'}}>
							<ul className="overflow-auto list-group noScrollBar">
								{list.filter(tournament => !tournament.winner && tournament.reasonForNoWinner === '').map(tournament => <Tournament key={index++} props={props} tournament={tournament} />)}
								{list.filter(tournament => tournament.winner || tournament.reasonForNoWinner !== '').map(tournament => <Tournament key={index++} props={props} tournament={tournament} />)}
							</ul>
						</div>
					</div>
					<ul title='My subscriptions' className="list-group" key='sub'>
						{props.myProfile && list.filter(tournament => props.myProfile.subscriptions.includes(tournament.id)).map(tournament => <Tournament key={index++} props={props} tournament={tournament} />)}
					</ul>
                    <div title='My Tournaments' key='my'>
                        <div className='d-flex justify-content-center'>
							<Link to='/newTournament' type='button' className='btn btn-secondary my-2'>{props.language.createTournament}</Link>
						</div>
					    <ul className="list-group overflow-visible">
							{props.myProfile && list.filter(tournament => props.myProfile.tournaments.includes(tournament.id)).map(tournament => <Tournament key={index++} props={props} tournament={tournament} />)}
					    </ul>
                    </div>
				</Tabs>
		</>
	)
}

function SpecificTournament({props, id}) {

	const [tournament, setTournament] = useState(undefined)
	const [display, setDisplay] = useState('contenders')
	const navigate = useNavigate()

	useEffect(() => {
		if (!tournament) {
			fetch('/tournaments/' + id + '/').then(response => {
				if (response.status === 200) {
					response.json().then(data => setTournament(data))
				}
			})
		}
		const interval = setInterval(() => {
			fetch('/tournaments/' + id + '/').then(response => {
				if (response.status === 200) {
					response.json().then(data => setTournament(data))
				}
			})
		}, 3000)
		return () => clearInterval(interval)
	}, [props.socket, props.socket.onmessage, tournament, id])

	if (!tournament)
		return <div className='w-100 h-100 d-flex align-items-center justify-content-center noScrollBar'><img src="/images/loading.gif" alt="" /></div>

	const modifyDesc = () => {
		document.getElementById('changeDesc').value = tournament.description
		document.getElementById('description').hidden = !document.getElementById('description').hidden
		document.getElementById('descriptionForm').hidden = !document.getElementById('descriptionForm').hidden
	}

	const modifyTournament = e => {
		let key = e.target.name
		if (key === 'description') {
			let newDesc = document.getElementById('changeDesc').value
			fetch('/tournaments/' + tournament.id + '/updateDescription/', {
				method : 'POST',
				body : JSON.stringify({newDesc : newDesc})
			}).then(response => {
				if (response.status === 200) {
					setTournament({...tournament, description : newDesc})
					modifyDesc()
				}
			})
		}
	}

	const captureKey = e => {
		if (e.keyCode === 13)
			e.preventDefault()
	}

	let index = 1
	
	return (
		<>
			<div className={`d-flex flex-column align-items-center pt-2 pb-1 rounded ${!tournament.background && 'bg-white border border-3 border-success'}`} style={tournament.background && {backgroundImage: 'url("' + tournament.background + '")', backgroundSize: 'cover', backgroundPosition : 'center'}} >
				<div style={{height: '150px', width: '150px'}}><img src={tournament.picture} className="rounded-circle border border-black" alt="" style={{height: '100%', width: '100%'}} /></div>
				<span className={`fs-1 fw-bold text-danger-emphasis text-decoration-underline mt-1 ${tournament.background && 'bg-white rounded border border-black p-1'}`}>{tournament.title}</span>
				<span>
					<span className={`fw-bold ${tournament.background && 'bg-white rounded border border-black p-2'}`}>{props.language.organizer} : 
						<button onClick={() => navigate('/profile/' + tournament.organizer.id)} title='See profile' className="ms-1 nav-link d-inline fs-4 text-primary text-decoration-underline mb-1" disabled={tournament.organizer.id === 0}>
						{props.myProfile && tournament.organizer.id === props.myProfile.id ? props.language.you : tournament.organizer.name}
						</button>
					</span>
				</span>
			</div>
			<div className="d-flex justify-content-center fs-3 text-danger-emphasis text-decoration-underline fw-bold">{props.language.game} : {tournament.game === 'pong' ? 'Pong' : props.language.chess}</div>
			<p className={`fs-4 fw-bold text-danger-emphasis ms-1 ${!props.md && 'd-flex justify-content-center'}`}>
				<button onClick={() => setDisplay('contenders')} type='button' className={`nav-link d-inline me-3 ${display === 'contenders' && 'text-decoration-underline'}`}>{props.language.contenders}</button>
				<button onClick={() => setDisplay('history')} type='button' className={`nav-link d-inline me-3 ${display === 'history' && 'text-decoration-underline'}`}>{props.language.matchHistory}</button></p>
			<div className="d-flex" style={{maxHeight: '50%'}}>
			{display === 'contenders' ?
				tournament.contenders.length > 0 ?
				<div className="d-flex flex-column">
					<div className="d-flex" style={{maxHeight: '100%', width: props.sm ? '210px' : '160px'}}>
						<ul className="w-100 d-flex rounded w-100 list-group overflow-auto noScrollBar" style={{maxHeight: '100%'}}>
							{tournament.contenders.map(contender => { return <Contender key={index++} props={props} contender={contender} />})}
						</ul>
					</div>
				</div> :
				<div className="border border-2 border-black rounded d-flex justify-content-center align-items-center fw-bold px-3" style={{minHeight: '200px',maxHeight: '200px', width: props.sm ? '210px' : '160px'}}>
					{props.language.noContender}
				</div> :
				tournament.matches.length > 0 ?
				<div className="d-flex flex-column">
					<div className="d-flex" style={{maxHeight: '100%', width: props.sm ? '210px' : '160px'}}>
						<ul className="w-100 d-flex rounded w-100 list-group overflow-auto noScrollBar" style={{maxHeight: '100%'}}>
							{tournament.matches && tournament.matches.map(match => { return <History key={index++} props={props} match={match} />})}
						</ul>
					</div>
				</div> : 
				<div className="border border-2 border-black rounded d-flex justify-content-center align-items-center fw-bold px-3" style={{maxHeight: '100%', width: props.sm ? '210px' : '160px'}}>
					{props.language.bePatient}
				</div> }
				<div className="ms-3">
					{tournament.winner &&
						// <button type="button" className="btn btn-secondary">{props.language.state}</button> : 
						<span className="border border-5 border-danger px-1 py-2 rounded bg-white fw-bold fs-6">
							{props.language.winner} : 
							<button onClick={() => navigate('/profile/' + tournament.winner.id)} title='See profile' className="nav-link d-inline fs-4 ms-1 text-primary text-decoration-underline">
								{props.myProfile && tournament.winner.id === props.myProfile.id ? props.language.you : tournament.winner.name}
							</button>
						</span>}
					<div id='descriptionDiv'>
                        <p className={`d-flex gap-2 ${!props.md && 'justify-content-center'}`}>
                            <button onClick={modifyDesc} title={props.myProfile && tournament.organizerId === props.myProfile.id ? 'Modify description' : undefined} className={`nav-link text-decoration-underline fs-3 fw-bold ${props.myProfile && tournament.organizer.id === props.myProfile.id ? 'myProfile' : ''}`} disabled={!props.myProfile || tournament.organizer.id !== props.myProfile.id}>Description</button>
                        </p>
                        <div id='description' className="w-100 m-0 fs-4">{tournament.description}</div>
                        <div id='descriptionForm' style={{maxWidth : '300px'}} hidden>
                            <form className="d-flex flex-column" action='/modifyMyProfile.jsx'>
							<textarea onKeyDown={captureKey} id="changeDesc" name="description" cols="50" rows="5"></textarea>
                                <span><button onClick={modifyTournament} name='description' type="button" className="btn btn-success my-1">{props.language.saveChange}</button></span>
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
				<img src={player1.avatar} alt="" style={{height: '60px', width: '60px', position: 'absolue'}} className="rounded-circle" />
				{player1.id !== 'none' && <img src={match.winner === player1.id ? '' : 'images/ban.svg'} alt="" style={{position: 'absolute'}} />}
			</Link>
			<span className="fs-1 fw-bold">X</span>
			<Link to={'/profile/' + player2.id} className="rounded-circle profileLink d-flex justify-content-center" title='See profile' style={{height: '60px', width: '60px', position: 'relative'}}>
				<img src={player2.avatar} alt="" style={{height: '60px', width: '60px', position: 'absolue'}} className="rounded-circle" />
				{player2.id !== 'none' && <img src={match.winner === player2.id ? '' : 'images/ban.svg'}  alt="" style={{position: 'absolute'}} />}
			</Link>
		</li>
	)

}

function Contender({props, contender}) {
	return (
		<li className={`list-group-item d-flex justify-content-center`}>
			<Link to={'/profile/' + contender.id} className="rounded-circle profileLink d-flex justify-content-center" title='See profile' style={{height: '60px', width: '60px', position: 'relative'}}>
				<img src={contender.avatar} alt="" style={{height: '60px', width: '60px', position: 'absolue'}} className="rounded-circle" />
			</Link>
			{props.md && <div className={`fw-bold fs-4 d-flex align-items-center ps-4`}>{contender.name}</div>}
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

	const subscribe = () => {
		fetch('/tournaments/subscribe/' + tournament.id + '/', {method: 'POST'}).then(response => {
			if (response.status === 200)
				props.setMyProfile({...props.myProfile, subscriptions : [...props.myProfile.subscriptions, tournament.id]})
		})
	}

	return (
		<li className={`overflow-visible list-group-item d-flex ${!props.sm && 'flex-column'} align-items-center px-2 py-1 border border-2 rounded ${!tournament.winner && tournament.reasonForNoWinner === "" ? 'bg-white' : 'bg-dark-subtle'}`} key={tournament.id}>
			<img className="rounded-circle" src={tournament.picture} alt="" style={{width: '45px', height: '45px'}} />
			<div className={`overflow-visible d-flex justify-content-between align-items-center fw-bold ms-2 flex-grow-1 ${!props.sm && 'flex-column text-center'}`}>
				{tournament.title} {props.myProfile && props.myProfile.tournaments.includes(tournament.id) && '(' + props.language.youOrganize + ')'}
				<div className="d-flex button-group">
					<button type='button' data-bs-toggle='dropdown' className="btn btn-success">Options</button>
					<ul className="dropdown-menu" style={{backgroundColor: '#D8D8D8'}}>
						{props.myProfile && !props.myProfile.subscriptions.includes(tournament.id) && <li onClick={subscribe} className='px-2 dropdown-item nav-link'>{props.language.subscribeToTournament}</li>}
						{!props.chats.find(item => item.name === tournament.title) && <li onClick={joinChat} className='px-2 dropdown-item nav-link'>{props.language.joinChat}</li>}
						<Link className='px-2 dropdown-item nav-link' to={'/tournaments/' + tournament.id}>{props.language.seePage}</Link>
					</ul>
				</div>
			</div>
		</li>
	)

}

export function NewTournament({props}) {

	const navigate = useNavigate()

	useEffect(() => {
		if (!props.myProfile)
			navigate('/')
	})

	const checkIssues = () => {
		let issue = true
		if (document.getElementById('title').value === '') {
			document.getElementById('title').classList.add('border', 'border-3', 'border-danger')
			issue = false
		}
		if (document.getElementById('tournamentPic').files.length === 0) {
			document.getElementById('noPicture').hidden = false
			issue = false
		}
		return issue
	}

	const sendImages = id => {
		const images = new FormData()
		images.set('picture', document.getElementById('tournamentPic').files[0])
		let bg = document.getElementById('tournamentBG')
		bg.files.length > 0 && images.set('bg', bg.files[0])
		fetch('/tournaments/' + id + '/setImages/', {
			method : 'POST',
			body : images
		})
		.then(response => {
			if (response.status === 200)
				navigate('/tournaments/' + id)
		})
	}

	const createTournament = () => {
		if (checkIssues()) {
			const data = {
				game : document.getElementById('game').value,
				title : document.getElementById('title').value,
				maxContenders : document.getElementById('maxContenders').value,
				selfContender : document.getElementById('selfContender').checked
			}
			fetch('/tournaments/create/', {
				method : 'POST',
				body : JSON.stringify(data)
			}).then(response => {
				if (response.status === 201) {
					response.json().then(id => {
						let updatedProfile = {...props.myProfile, tournaments : [...props.myProfile.tournaments, id]}
						if (data.selfContender)
							updatedProfile = {...updatedProfile, subscriptions : [...props.myProfile.subscriptions, id]}
						props.setMyProfile(updatedProfile)
						sendImages(id)
					})
				}
			})
		}
	}

	const captureKey = e => {
		let list = document.getElementById('title').classList
		list.contains('border') && list.remove('border', 'border-3', 'border-danger')
		if (e.keyCode === 13) {
			e.preventDefault()
			createTournament()
		}
	}

	return (
		<div className={`d-flex flex-column align-items-center`} style={props.customwindow}>
			<form id='myForm' className={`${props.md ? 'w-50' : 'w-100'} p-2 border border-3 border-black rounded bg-secondary d-flex flex-grow-1 flex-column justify-content-center align-items-center text-dark`}>
                <h2 className="text-center pt-2 fs-3 fw-bold">{props.language.tournamentCreation}</h2>
                <label htmlFor="game" className="form-label ps-2 pt-3">{props.language.tournamentGame}</label>
                <select name="game" id="game" className="form-select w-50" defaultValue={props.settings.game}>
                    <option id='tournPong' value="pong">Pong</option>
                    <option id='tournChess' value="chess">{props.language.chess}</option>
                </select>
				<div className="d-flex flex-column align-items-center pt-3">
                    <label htmlFor="title" className="form-label">{props.language.tournamentTitle}</label>
                    <input onKeyDown={captureKey} type="text" id="title" name="title" className="form-control" maxLength="30" />
					<p id='existingName' hidden>{props.language.existingTournamentName}</p>
                </div>
				<div id='pic' className='d-flex flex-column align-items-center mt-1'>
					<label htmlFor="tournamentPic" className='form-label'>{props.language.tournamentPic}</label>
					<input onChange={e => {
							document.getElementById('picName').innerHTML = e.target.files[0].name
							document.getElementById('noPicture').hidden = true
						}
					} name='picture' id='tournamentPic' type="file" accept='image/*' />
					<label htmlFor="tournamentPic">{props.language.upload}</label>
					<span id='picName' className="mt-1 text-danger-emphasis text-decoration-underline"></span>
					<p id='noPicture' className="text-danger-emphasis" hidden>{props.language.noPicture}</p>
				</div>
				<div id='bg' className='d-flex flex-column align-items-center mt-2'>
					<label htmlFor="tournamentBG" className="form-label">{props.language.tournamentBg}</label>
					<input onChange={e => document.getElementById('bgName').innerHTML = e.target.files[0].name} name='background' id='tournamentBG' type="file" accept='image/*' style={{width: '100px'}} />
                    <label htmlFor="tournamentBG">{props.language.upload}</label>
					<span id='bgName' className="mt-1 text-danger-emphasis text-decoration-underline"></span>
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
				<div className="w-50 pt-4 d-flex justify-content-center form-check gap-2">
                    <input className="form-check-input" type="checkbox" name="selfContender" id="selfContender" />
                    <label className="form-check-label" htmlFor="selfContender">{props.language.selfContender}</label>
                </div>
                <button onClick={createTournament} type='button' className="btn btn-primary mt-3">{props.language.validateTournament}</button>
            </form>
		</div>
	)

}
