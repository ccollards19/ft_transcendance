import React from "react"
import { useState } from "react"

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

export function AllTournaments({props}) {

	const [tournaments, setTournaments] = useState(undefined)
	const [prevData, setPrevData] = useState(undefined)

	var xhr = new XMLHttpRequest()
    // xhr.open('GET', '/api/tournaments/' + props.game + '/')
	xhr.open('GET', '/data/sampleTournaments' + props.game + '.json')
	xhr.seenBytes = 0

	xhr.onreadystatechange = () => {
	  
		if(xhr.readyState == 3) {
			var response = xhr.response.substr(xhr.seenBytes)
			if (!prevData || !prevData.includes(response)) {
				setPrevData(response)
			  	var newData = JSON.parse(response)
			  	let on = []
				let off = []
				for (let item of newData) {
					if (item.winnerId === 0 && item.reasonForNoWinner === '')
						on.push(item)
					else
						off.push(item)
				}
				setTournaments(on.concat(off))
			
			  	xhr.seenBytes = response.length
			}
		}
	}
	xhr.send()

	if (!tournaments)
		return undefined

	const seeTournament = (e) => {
		props.setTournamentId(parseInt(e.target.dataset.tournament, 10))
        props.setPage('Tournaments')
	}

	const joinChat = (e) => {
		let chanName = e.target.dataset.name
		props.setChanList([...props.chanList, chanName])	
		props.setChan(chanName)
	}

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
						{tournaments.map((tournament) => 
							<li className={`list-group-item d-flex ${!props.sm && 'flex-column'} align-items-center px-2 py-1 border border-2 rounded ${tournament.winnerId === 0 && tournament.reasonForNoWinner === "" ? 'bg-white' : 'bg-dark-subtle'}`} key={tournament.id} style={{minHeight: '50px'}}>
							<img className="rounded-circle" title='See profile' src={"/images/".concat(tournament.picture)} alt="" style={{width: '45px', height: '45px'}} />
							<div className={`d-flex justify-content-between align-items-center fw-bold ms-2 flex-grow-1 ${!props.sm && 'flex-column text-center'}`}>
								<span>{tournament.title} <span className="text-danger-emphasis fw-bold" hidden={!props.myProfile || tournament.organizerId !== props.myProfile.id}>(You are the organizer)</span></span>
								<div className={`d-flex gap-2 ${!props.sm && 'd-flex flex-column align-items-center'}`}>
									<button onClick={joinChat} data-name={tournament.title} type='button' className="btn btn-success" disabled={props.chanList.length === 5 || props.chanList.includes(tournament.title)}>Join Tournament's chat</button>
									<button onClick={seeTournament} data-tournament={tournament.id} type='button' className="btn btn-secondary">See tournament's page</button>
								</div>
							</div>
						</li>)}
					</ul>
					<ul title='My subscriptions' className="list-group" key='sub'>
						{props.myProfile &&
							tournaments.map((tournament) => 
                                props.myProfile.subscriptions.includes(tournament.id) &&
							    	<li className={`list-group-item d-flex ${!props.sm && 'flex-column'} align-items-center px-2 py-1 bg-white border rounded`} key={tournament.id}>
							    	<img className="rounded-circle" title='See profile' src={"/images/".concat(tournament.picture)} alt="" style={{width: '45px', height: '45px'}} />
							    	<div className={`d-flex justify-content-between align-items-center fw-bold ms-2 flex-grow-1 ${!props.sm && 'flex-column text-center'}`}>
                                        <span>{tournament.title} <span className="text-danger-emphasis fw-bold" hidden={tournament.organizerId !== props.myProfile.id}>(You are the organizer)</span></span>
							    		<div className={`d-flex gap-2 ${!props.sm && 'd-flex flex-column align-items-center'}`}>
											<button onClick={joinChat} data-name={tournament.title} type='button' className="btn btn-success" disabled={props.chanList.length === 5 || props.chanList.includes(tournament.title)}>Join Tournament's chat</button>
											<button onClick={seeTournament} data-tournament={tournament.id} type='button' className="btn btn-secondary">See tournament's page</button>
										</div>
							    	</div>
							    </li>)}
					</ul>
                    <div title='My Tournaments' key='my'>
                        <div className='d-flex justify-content-center'><button onClick={createTournament} type='button' className='btn btn-secondary my-2'>Create a tournament</button></div>
					    <ul className="list-group">
					    	{props.myProfile &&
					    	    tournaments.map((tournament) => 
                                    props.myProfile.tournaments.includes(tournament.id) &&
					    	    	<li className={`list-group-item d-flex ${!props.sm && 'flex-column'} align-items-center px-2 py-1 bg-white border rounded`} key={tournament.id}>
					    	    	    <img className="rounded-circle" title='See profile' src={"/images/".concat(tournament.picture)} alt="" style={{width: '45px', height: '45px'}} />
					    	    	    <div className={`d-flex justify-content-between align-items-center fw-bold ms-2 flex-grow-1 ${!props.sm && 'flex-column text-center'}`}>
					    	    	    	{tournament.title}
					    	    	    	<div className={`d-flex gap-2 ${!props.sm && 'd-flex flex-column align-items-center'}`}>
												<button onClick={joinChat} data-name={tournament.title} type='button' className="btn btn-success" disabled={props.chanList.length === 5 || props.chanList.includes(tournament.title)}>Join Tournament's chat</button>
												<button onClick={seeTournament} data-tournament={tournament.id} type='button' className="btn btn-secondary">See tournament's page</button>
											</div>
					    	    	    </div>
					    	        </li>)}
					    </ul>
                    </div>
				</Tabs>
		</>
	)
}

export function SpecificTournament({props}) {

	const [tournament, setTournament] = useState(undefined)
	const [prevData, setPrevData] = useState(undefined)

	var xhr = new XMLHttpRequest()
    // xhr.open('GET', '/api/tournament/' + props.tournamentId + '/')
	xhr.open('GET', '/data/sampleTournament.json')
	xhr.seenBytes = 0

	xhr.onreadystatechange = () => {
	  
		if(xhr.readyState == 3) {
			var response = xhr.response.substr(xhr.seenBytes)
			if (!prevData || !prevData.includes(response)) {
				setPrevData(response)
			  	setTournament(JSON.parse(response))
			
			  	xhr.seenBytes = response.length
			}
		}
	}
	xhr.send()

	if (!tournament)
		return undefined

	const seeProfile = (e) => {
		props.setProfileId(parseInt(e.target.dataset.id, 10))
		props.setPage('Profile')
	}

	let matchId = 1

	let organizer = 
	<button onClick={seeProfile} title='See profile' className="ms-1 nav-link d-inline fs-4 text-primary text-decoration-underline" data-id={tournament.organizerId} disabled={tournament.organizerId === 0}>
		{props.myProfile && tournament.organizerId === props.myProfile.id ? 'you' : tournament.organizerName}
	</button>

	let winner = 
	<span className="border border-5 border-danger p-2 rounded bg-white fw-bold fs-6">
		Winner : 
		<button onClick={seeProfile} title='See profile' data-id={tournament.winnerId} className="nav-link d-inline fs-4 ms-1 text-primary text-decoration-underline">{props.myProfile && tournament.winnerId === props.myProfile.id ? 'you' : tournament.winnerName}</button>
	</span>

	let manageButton = 
	<button type='button' className="btn btn-primary d-inline ms-3" hidden={!props.myProfile || tournament.organizerId !== props.myProfile.id}>
		Manage
	</button>
	
	return (
		<>
			<div className={`d-flex flex-column align-items-center pt-2 pb-1 border border-3 border-success rounded ${tournament.background === '' && 'bg-white'}`}style={{backgroundImage: 'url("/images/'.concat(tournament.background, '")'),backgroundSize: 'cover'}}>
				<div style={{height: '150px', width: '150px'}}><img src={'/images/'.concat(tournament.picture)} className="rounded-circle" alt="" style={{height: '100%', width: '100%'}} /></div>
				<span className={`fs-1 fw-bold text-danger-emphasis text-decoration-underline mt-1 ${tournament.background !== '' && 'bg-white rounded border border-black p-1'}`}>{tournament.title}</span>
				<span>
					<span className={`fw-bold ${tournament.background !== '' && 'bg-white rounded border border-black p-1'}`}>Organizer : {organizer}</span>
					{props.myProfile && tournament.organizerId === props.myProfile.id && manageButton}
				</span>
				
			</div>
			<div className="d-flex" style={{maxHeight: '45%'}}>
			{tournament.matchHistory.length > 0 &&
				<div className="d-flex flex-column">
					<span className="ps-2 fs-3 fw-bold text-danger-emphasis text-decoration-underline">Match history</span>
					<div className="d-flex" style={{maxHeight: '100%', width: props.sm ? '210px' : '160px'}}>
						<ul className="w-100 d-flex rounded w-100 list-group overflow-auto noScrollBar" style={{maxHeight: '100%'}}>
						{tournament.matchHistory.map((match) =>
							<li className={`list-group-item d-flex ${props.sm ? 'px-4' : 'px-2'} align-items-center justify-content-between`} key={matchId++} style={{minHeight: '90px'}}>
								<div onClick={seeProfile} data-id={match.contenders[0].id} className="rounded-circle profileLink d-flex justify-content-center winner" title='See profile' style={{height: '60px', width: '60px', position: 'relative'}}>
									<img src={'/images/'.concat(match.contenders[0].avatar)} data-id={match.contenders[0].id} alt="" style={{height: '60px', width: '60px', position: 'absolue'}} className="rounded-circle" />
									<img src={match.winner.id === match.contenders[0].id ? '' : '/images/ban.svg'} data-id={match.contenders[0].id} alt="" style={{position: 'absolute'}} />
								</div>
								<span className="fs-2 fw-bold">X</span>
								<div onClick={seeProfile} data-id={match.contenders[1].id} className="rounded-circle profileLink d-flex justify-content-center winner" title='See profile' style={{height: '60px', width: '60px', position: 'relative'}}>
									<img src={'/images/'.concat(match.contenders[1].avatar)} data-id={match.contenders[0].id} alt="" style={{height: '60px', width: '60px', position: 'absolue'}} className="rounded-circle" />
									<img src={match.winner.id === match.contenders[1].id ? '' : '/images/ban.svg'} data-id={match.contenders[1].id} alt="" style={{position: 'absolute'}} />
								</div>
							</li>
						)}
						</ul>
					</div>
				</div>}
				<div className="mt-5 ms-3">
					{ tournament.winnerId === 0 ?
						<button type="button" className="btn btn-secondary">See current state</button> : 
						winner }
					<div className="mt-2">
						<span className="text-decoration-underline fs-3 fw-bold text-danger-emphasis">Description :</span>
					</div>
				</div>
			</div>
				
		</>
	)
}