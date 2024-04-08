import React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"

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

    const changeGame = (e) => props.setGame(e.target.dataset.game)

	const createTournament = () => props.setPage('NewTournament')

	return (
		<>
		<div className="d-flex mb-0 justify-content-center align-items-center fw-bold fs-2" style={{minHeight: '10%'}}>
            	    Tournaments (<button type='button' className='nav-link text-primary text-capitalize' data-bs-toggle='dropdown'>{props.game}</button>)
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
						{list.map(tournament => {
							if (props.myProfile.subscriptions.includes(tournament.id))
								return <Tournament key={tournament.id} props={props} tournament={tournament.item} />
							else
								return undefined
						})}
					</ul>
                    <div title='My Tournaments' key='my'>
                        <div className='d-flex justify-content-center'><button onClick={createTournament} type='button' className='btn btn-secondary my-2'>Create a tournament</button></div>
					    <ul className="list-group">
							{list.map(tournament => {
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

	if (!tournament || tournament.id !== id) {
		let request = new XMLHttpRequest()
        request.open('GET', '/aapi/tournament/' + id + '.json')
        request.onreadystatechange = () => {
            if (request.readyState === 3) {
				let response = JSON.parse(request.response)
				setTournament(response.tournament)
				setMatches(response.matches.map(match => { return {id : match.id, item : match} }))
            }
        }
        request.send()
		return <div style={props.customwindow}></div>
	}

	const seeProfile = (e) => {
		props.setProfileId(parseInt(e.target.dataset.id))
		props.setPage('Profile')
	}

	let index = 1
	
	return (
		<>
			<div className={`d-flex flex-column align-items-center pt-2 pb-1 rounded ${tournament.background === '' && 'bg-white border border-3 border-success'}`} style={{backgroundImage: 'url("/images/' + tournament.background + '")' ,backgroundSize: 'cover'}}>
				<div style={{height: '150px', width: '150px'}}><img src={'/images/'.concat(tournament.picture)} className="rounded-circle" alt="" style={{height: '100%', width: '100%'}} /></div>
				<span className={`fs-1 fw-bold text-danger-emphasis text-decoration-underline mt-1 ${tournament.background !== '' && 'bg-white rounded border border-black p-1'}`}>{tournament.title}</span>
				<span>
					<span className={`fw-bold ${tournament.background !== '' && 'bg-white rounded border border-black p-1'}`}>Organizer : 
						<button onClick={seeProfile} title='See profile' className="ms-1 nav-link d-inline fs-4 text-primary text-decoration-underline" data-id={tournament.organizerId} disabled={tournament.organizerId === 0}>
						{props.myProfile && tournament.organizerId === props.myProfile.id ? 'you' : tournament.organizerName}
						</button>
					</span>
					{props.myProfile && tournament.organizerId === props.myProfile.id && 
					<button type='button' className="btn btn-primary d-inline ms-3" hidden={!props.myProfile || tournament.organizerId !== props.myProfile.id}>
						Manage
					</button>}
				</span>
			</div>
			<div className="d-flex justify-content-center fs-3 text-danger-emphasis text-decoration-underline fw-bold">A {tournament.game} tournament !</div>
			<div className="d-flex" style={{maxHeight: '50%'}}>
			{matches && matches.length > 0 &&
				<div className="d-flex flex-column">
					<span className="ps-2 fs-3 fw-bold text-danger-emphasis text-decoration-underline">Match history</span>
					<div className="d-flex" style={{maxHeight: '100%', width: props.sm ? '210px' : '160px'}}>
						<ul className="w-100 d-flex rounded w-100 list-group overflow-auto noScrollBar" style={{maxHeight: '100%'}}>
							{matches.map(match => { return <Match key={index++} props={props} match={match.item} />})}
						</ul>
					</div>
				</div>}
				<div className="mt-5 ms-3">
					{tournament.winnerId === 0 ?
						<button type="button" className="btn btn-secondary">See current state</button> : 
						<span className="border border-5 border-danger p-2 rounded bg-white fw-bold fs-6">
							Winner : 
							<button onClick={seeProfile} title='See profile' data-id={tournament.winnerId} className="nav-link d-inline fs-4 ms-1 text-primary text-decoration-underline">
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

function Match({props, match}) {

	const [player1, setPlayer1] = useState(undefined)
	const [player2, setPlayer2] = useState(undefined)

	if (!player1) {
		let xhr = new XMLHttpRequest()
		xhr.open('GET', '/aapi/user/' + match.contenders[0] + '.json')
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 3) {
				let response = JSON.parse(xhr.response)
				setPlayer1({id : response.id, avatar : response.avatar})
			}
		}
		xhr.send()
		return undefined
	}

	if (player1 && !player2) {
		let xhr = new XMLHttpRequest()
		xhr.open('GET', '/aapi/user/' + match.contenders[1] + '.json')
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 3) {
				let response = JSON.parse(xhr.response)
				setPlayer2({id : response.id, avatar : response.avatar})
			}
		}
		xhr.send()
		return undefined
	}

	return (
		<li className={`list-group-item d-flex ${props.sm ? 'px-4' : 'px-2'} align-items-center justify-content-between`} style={{minHeight: '90px'}}>
			<Link to={'/profile/' + player1.id} className="rounded-circle profileLink d-flex justify-content-center" title='See profile' style={{height: '60px', width: '60px', position: 'relative'}}>
				<img src={'/images/' + player1.avatar} alt="" style={{height: '60px', width: '60px', position: 'absolue'}} className="rounded-circle" />
				<img src={match.winner === player1.id ? '' : '/images/ban.svg'} alt="" style={{position: 'absolute'}} />
			</Link>
			<span className="fs-1 fw-bold">X</span>
			<Link to={'/profile/' + player2.id} className="rounded-circle profileLink d-flex justify-content-center" title='See profile' style={{height: '60px', width: '60px', position: 'relative'}}>
				<img src={'/images/' + player2.avatar} alt="" style={{height: '60px', width: '60px', position: 'absolue'}} className="rounded-circle" />
				<img src={match.winner === player2.id ? '' : '/images/ban.svg'}  alt="" style={{position: 'absolute'}} />
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