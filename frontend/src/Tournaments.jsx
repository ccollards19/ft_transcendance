import React, { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import * as Social from './Social.js'

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
                    	    <div className='bg-info border border-black border-3 rounded py-1 d-flex justify-content-center fw-bold' style={{width: '100px'}}>{props.language.incomplete}</div>
                    	    <div className='bg-white border border-black border-3 rounded py-1 d-flex justify-content-center fw-bold' style={{width: '100px'}}>{props.language.ongoing}</div>
                    	    <div className='bg-dark-subtle border border-black border-3 rounded py-1 d-flex justify-content-center fw-bold' style={{width: '100px'}}>{props.language.over}</div>
                    	</div>
						<div className="overflow-visible" style={{maxHeight : '80%'}}>
							<ul className="overflow-visible list-group noScrollBar">
								{list.filter(tournament => !tournament.winner && tournament.reasonForNoWinner === '').map(tournament => <Tournament key={index++} props={props} tournament={tournament} />)}
								{list.filter(tournament => tournament.winner || tournament.reasonForNoWinner !== '').map(tournament => <Tournament key={index++} props={props} tournament={tournament} />)}
							</ul>
						</div>
					</div>
					<div title='My subscriptions' key='sub' className="overflow-visible">
						<ul className="overflow-visible list-group noScrollBar mt-5">
							{props.myProfile && list.filter(tournament => props.myProfile.subscriptions.includes(tournament.id)).map(tournament => <Tournament key={index++} props={props} tournament={tournament} />)}
						</ul>
					</div>
                    <div title='My Tournaments' key='my'>
                        <div className='d-flex justify-content-center'>
							<Link to='/newTournament' type='button' className='btn btn-secondary my-2'>{props.language.createTournament}</Link>
						</div>
						<div className="overflow-visible">
					    	<ul className="list-group overflow-visible noScrollBar">
								{props.myProfile && list.filter(tournament => props.myProfile.tournaments.includes(tournament.id)).map(tournament => <Tournament key={index++} props={props} tournament={tournament} />)}
					    	</ul>
						</div>
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

	const modifyImage = e => {
		if (window.confirm(props.language.delete1)) {
			const image = new FormData()
			image.set(e.target.dataset.type, document.getElementById(e.target.dataset.type + 'Upload').files[0])
			fetch('/tournaments/' + tournament.id + '/updateImage/', {
				method : 'POST', 
				body : image
			}).then(response => {
				if (response.status === 200) {
					response.json().then(data => setTournament({...tournament, [data.key] : data.value}))
				}
			})
		}
	}

	const cancelTournament = () => {
		if (window.confirm(props.language.delete1)) {
			props.socket.send(JSON.stringify({action : 'cancelTournament', item : {id : tournament.id}}))
			props.setMyProfile({...props.myProfile, tournaments : props.myProfile.tournaments.filter(item => item !== tournament.id)})
			setTournament({...tournament, reasonForNoWinner : 'Cancelled'})
		}
	}

	const subscribe = () => {
		props.socket.send(JSON.stringify({action : 'joinTournament', item : {id : tournament.id}}))
		props.setMyProfile({...props.myProfile, subscriptions : [...props.myProfile.subscriptions, tournament.id]})
		setTournament({...tournament, contenders : [...tournament.contenders, {id : props.myProfile.id, name : props.myProfile.name, avatar : props.myProfile.avatar}]})
	}

	let index = 1

	console.log(tournament)
	
	return (
		<>
			<div className={`position-relative d-flex flex-column align-items-center pt-2 pb-1 rounded ${!tournament.background && 'bg-white border border-3 border-success'}`} style={tournament.background && {backgroundImage: 'url("' + tournament.background + '")', backgroundSize: 'cover', backgroundPosition : 'center'}} >
				{props.myProfile && tournament.organizer.id === props.myProfile.id && 
				<label className="d-flex justify-content-center align-items-center position-absolute start-0 ms-2 bg-white rounded-circle" htmlFor="bgUpload" style={{zIndex : '2', width : '25px', height : '25px'}} title={props.language.modifyBg} >
					<img type='button' src="/images/edit.svg" alt="" className="w-75 h-75" />
					<input id='bgUpload' onChange={modifyImage} accept='image/*' data-type='bg' type='file' />
				</label>}
				<label id={props.myProfile && tournament.organizer.id === props.myProfile.id ? 'myPicture' : undefined} htmlFor='pictureUpload' className={`rounded-circle d-flex justify-content-center align-items-center position-relative`} style={{height: '125px',width: '125px'}}>
            	    <img id='pictureLarge' src={tournament.picture} alt="" className="rounded-circle" style={{height: '100%',width: '100%'}} />
            	    <span id='modifyPictureLabel' className="text-white fw-bold fs-6 position-absolute">{props.language.modifyPicture}</span>
            	    <input onChange={modifyImage} data-type='picture' id='pictureUpload' type="file" accept='image/*' disabled={!props.myProfile || tournament.organizer.id !== props.myProfile.id} style={{width: '10px'}} />
            	</label>
				<span className={`fs-1 fw-bold text-danger-emphasis text-decoration-underline mt-1 ${tournament.background && 'bg-white rounded border border-black p-1'}`}>{tournament.title}</span>
				<span>
					<span className={`fw-bold ${tournament.background && 'bg-white rounded border border-black p-2'}`}>{props.language.organizer} : 
						<button onClick={() => navigate('/profile/' + tournament.organizer.id)} title='See profile' className="ms-1 nav-link d-inline fs-4 text-primary text-decoration-underline mb-1" disabled={tournament.organizer.id === 0}>
						{props.myProfile && tournament.organizer.id === props.myProfile.id ? props.language.you : tournament.organizer.name}
						</button>
					</span>
				</span>
			</div>
			<div className="d-flex justify-content-center gap-3 mt-1">
				<span className="fs-3 text-danger-emphasis text-decoration-underline fw-bold">{props.language.game} : {tournament.game === 'pong' ? 'Pong' : props.language.chess}</span>
				{props.myProfile && !props.myProfile.subscriptions.includes(tournament.id) && !tournament.complete && !tournament.winner && tournament.reasonForNoWinner === '' && <button onClick={subscribe} type='button' className="btn btn-success">{props.language.subscribeToTournament}</button>}
			</div>
			<p className={`fs-4 fw-bold text-danger-emphasis ms-1 ${!props.md && 'd-flex justify-content-center'}`}>
				<button onClick={() => setDisplay('contenders')} type='button' className={`nav-link d-inline me-3 ${display === 'contenders' && 'text-decoration-underline'}`}>{props.language.contenders}</button>
				<button onClick={() => setDisplay('history')} type='button' className={`nav-link d-inline me-3 ${display === 'history' && 'text-decoration-underline'}`}>{props.language.matchHistory}</button></p>
			<div className="d-flex" style={{maxHeight: '50%'}}>
			{display === 'contenders' ?
				tournament.contenders.length > 0 ?
				<div className="d-flex flex-column">
					<div className="d-flex" style={{maxHeight: '200px', width: props.sm ? '210px' : '160px'}}>
						<ul className="w-100 d-flex rounded w-100 list-group overflow-auto noScrollBar" style={{maxHeight: '100%', minHeight : '250px'}}>
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
				<div className="border border-2 border-black rounded d-flex justify-content-center align-items-center fw-bold px-3" style={{maxHeight: '100%', width: props.sm ? '210px' : '160px', minHeight: '250px'}}>
					{props.language.bePatient}
				</div> }
				<div className={`${(tournament.winner || tournament.reasonForNoWinner !== '') && 'ms-3 mt-3'}`}>
					{tournament.reasonForNoWinner === "Cancelled" && 
					<span className="border border-5 border-danger fs-4 px-2 py-2 rounded bg-white fw-bold fs-6">
						{props.language.tournamentCancelled}
					</span>}
					{tournament.winner &&
						<span className="border border-5 border-danger px-1 py-2 rounded bg-white fw-bold fs-6">
							{props.language.winner} : 
							<button onClick={() => navigate('/profile/' + tournament.winner.id)} title='See profile' className="nav-link d-inline fs-4 ms-1 text-primary text-decoration-underline">
								{props.myProfile && tournament.winner.id === props.myProfile.id ? props.language.you : tournament.winner.name}
							</button>
						</span>}
					<div id='descriptionDiv' className={`${(tournament.winner || tournament.reasonForNoWinner !== '') ? 'mt-3' : 'ms-3'}`}>
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
					{props.myProfile && tournament.organizer.id === props.myProfile.id && tournament.reasonForNoWinner === '' && <button onClick={cancelTournament} type='button' className="ms-3 btn btn-danger">{props.language.cancelTournament}</button>}
				</div>
			</div>
		</>
	)
}

export function History({props, match}) {

	return (
		<li className={`list-group-item d-flex ${props.sm ? 'px-4' : 'px-2'} align-items-center justify-content-between`} style={{minHeight: '90px'}}>
			<Link to={'/profile/' + match.player1.id} className="rounded-circle profileLink d-flex justify-content-center" title='See profile' style={{height: '60px', width: '60px', position: 'relative'}}>
				<img src={match.player1.avatar} alt="" style={{height: '60px', width: '60px', position: 'absolue'}} className="rounded-circle" />
				{match.player1.id === match.winner && <img src='/images/ban.svg' alt="" style={{position: 'absolute'}} />}
			</Link>
			<span className="fs-1 fw-bold">X</span>
			<Link to={'/profile/' + match.player2.id} className="rounded-circle profileLink d-flex justify-content-center" title='See profile' style={{height: '60px', width: '60px', position: 'relative'}}>
				<img src={match.player2.avatar} alt="" style={{height: '60px', width: '60px', position: 'absolue'}} className="rounded-circle" />
				{match.player2.id === match.winner && <img src='/images/ban.svg'  alt="" style={{position: 'absolute'}} />}
			</Link>
		</li>
	)

}

function Contender({props, contender}) {
	return (
		<li className={`list-group-item d-flex ${props.md ? 'justify-content-between' : 'justify-content-center'}`}>
			<Link to={'/profile/' + contender.id} className="rounded-circle profileLink d-flex justify-content-center" title={props.language.seeProfile} style={{height: '50px', width: '50px', position: 'relative'}}>
				<img src={contender.avatar} alt="" style={{height: '50px', width: '50px', position: 'absolue'}} className="rounded-circle" />
			</Link>
			{props.md && <div className={`fw-bold fs-4 d-flex align-items-center ps-4`} style={{width : '70%', wordBreak : 'break-word'}}>{contender.name}</div>}
		</li>
	)
}

export function Tournament({props, tournament}) {

	const navigate = useNavigate()

	const joinChat = () => {
		let tag = 'tournament_id' + tournament.id
		props.setChats([...props.chats, {tag : tag, name : tournament.title, autoScroll : true, messages : []}])
		props.setChanTag(tag)
		props.setChanName(tournament.title)
		props.socket.send(JSON.stringify({action : "join_chat", item : {chat : tag}}))
	}

	const subscribe = () => {
		props.socket.send(JSON.stringify({action : 'joinTournament', item : {id : tournament.id}}))
		props.setMyProfile({...props.myProfile, subscriptions : [...props.myProfile.subscriptions, tournament.id]})
	}

	const joinMatch = () => {
		fetch('game/updateRoom/' + tournament.yourTurn.room + '/', {method : 'POST'}).then(response => {
			if (response.status === 200) {
				props.setMyProfile({...props.myProfile, room : tournament.yourTurn.room})
				props.socket.send(JSON.stringify({action : 'joinMatch', item : {}}))
				navigate('/match')
			}
		})
	}

	const buildMenu = () => {
		let index = 1
		let menu = [<Link key={index++} className='px-2 dropdown-item nav-link' type='button' to={'/tournaments/' + tournament.id}>{props.language.seePage}</Link>]
		if (props.myProfile && ! props.myProfile.subscriptions.includes(tournament.id) && !tournament.complete && !tournament.winner && tournament.reasonForNoWinner === '')
			menu.push(<li key={index++} onClick={subscribe} type='button' className='px-2 dropdown-item nav-link'>{props.language.subscribeToTournament}</li>)
		if (!props.chats.find(item => item.name === tournament.name) && !tournament.winner && tournament.reasonForNoWinner === '')
			menu.push(<li type='button' key={index++} onClick={joinChat} className='px-2 dropdown-item nav-link'>{props.language.joinChat}</li>)
		if (tournament.yourTurn && tournament.yourTurn.status === 'online' && tournament.yourTurn.challengeable && (!tournament.yourTurn.opponentRoom || tournament.yourTurn.opponentRoom === tournament.yourTurn.room)) {
			menu.push(<li type='button' key={index++} onClick={() => Social.directMessage(props.xlg, tournament.yourTurn.name)} className='px-2 dropdown-item nav-link'>{props.language.dmTournament}</li>)
			menu.push(<li type='button' key={index++} onClick={joinMatch} className='px-2 dropdown-item nav-link'>{props.language.joinMatch}</li>)
		}
		return menu
	}

	// console.log(tournament)

	const getBackGroundColor = () => {
		if (tournament.reasonForNoWinner !== '' || tournament.winner)
			return 'bg-dark-subtle'
		else if (!tournament.complete)
			return 'bg-info'
		else if (tournament.yourTurn)
			return 'bg-warning'
		return 'bg-white'
	}

	const getOpponent = () => {
		if (tournament.yourTurn && tournament) {
			let opponent = tournament.yourTurn
			if (opponent.status === 'online' && !opponent.opponoentRoom && opponent.challengeable)
				return ' (' + props.language.youWillFace + opponent.name + ')'
		}
		return ''
	}

	return (
		<li className={`${!props.sm && 'flex-column'} overflow-visible list-group-item d-flex `.concat(getBackGroundColor())}>
			<img className="rounded-circle" src={tournament.picture} alt="" style={{width: '45px', height: '45px'}} />
			<div className={`d-flex justify-content-between align-items-center fw-bold ms-2 flex-grow-1 overflow-visible ${!props.sm && 'flex-column text-center'}`}>
				{tournament.title} {props.myProfile && props.myProfile.tournaments.includes(tournament.id) && '(' + props.language.youOrganize + ')'}
				{getOpponent()}
				<div className="d-flex button-group dropstart">
					<button type='button' data-bs-toggle='dropdown' className="btn btn-success">
						Options
					</button>
					<ul className="dropdown-menu" style={{backgroundColor: '#D8D8D8'}}>
						{buildMenu()}
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
