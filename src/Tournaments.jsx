import React from "react"
import { useState } from "react"
import { loadProfile } from "./other"
import { displayNewWindow } from "./NavBar"

const Tab = ({myProfile, title, onClick, active = false}) => {
	const onClickTab = e => {
		if (myProfile !== 'none') {
			e.preventDefault(0)
			onClick(title)
		}
	}

	return (
		<>
		  <li key={title} className={`${active ? "active" : ""} ${active ? "text-primary" : ""} ${myProfile === 'none' ? '' : 'tab-item'} ${myProfile === 'none' && title !== 'All Tournaments' ? 'text-body-tertiary' : ''} d-flex flex-grow-1 justify-content-center p-3 fw-bold text-uppercase ${title === 'All Tournaments' ? 'rounded-start-2' : ''} ${title === 'My Tournaments' ? 'rounded-end-2' : ''}`} onClick={onClickTab}>
			{title}
		  </li>
		</>)
}

export function Tabs({children, props}) {

	const [activeTab, setActiveTab] = useState(children[0].props.title);

  	const onClickTabItem = tab => setActiveTab(tab)

  	return (
  	  <>
  	    <div key='tabs' className="tabs" style={{maxHeight: '100%'}}>
  	      <ul className="tab-list p-0 d-flex overflow-auto noScrollBar bg-white rounded-start-2 rounded-end-2 mb-1">
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

export function SpecificTournament({props}) {

	const seeProfile = (e) => { 
		loadProfile({props}, parseInt(e.target.dataset.id, 10)) 
		displayNewWindow("Profile")
	}

	let tournament = props.tournaments[props.tournamentId]
	let matchId = 1

	let organizer = 
	<button onClick={seeProfile} title='See profile' className="ms-1 nav-link d-inline fs-4 text-primary text-decoration-underline" data-id={tournament.organizerId}>
		{tournament.organizerId === props.myProfile.id ? 'you' : tournament.organizerName}
	</button>

	let winner = 
	<span className="border border-5 border-danger p-2 rounded bg-white fw-bold">
		Winner : 
		<button onClick={seeProfile} title='See profile' data-id={tournament.winnerId} className="nav-link d-inline fs-4 ms-1 text-primary text-decoration-underline">{tournament.winnerId === props.myProfile.id ? 'you' : tournament.winnerName}</button>
	</span>

	let manageButton = 
	<button type='button' className="btn btn-secondary d-inline ms-3" hidden={tournament.organizerId !== props.myProfile.id || props.myProfile === 'none'}>
		Manage
	</button>
	
	return (
		<>
			<div className={`d-flex flex-column align-items-center pt-2 pb-1 border border-3 border-success rounded ${tournament.background === '' ? 'bg-white' : ''}`}style={{backgroundImage: 'url("/images/'.concat(tournament.background, '")'),backgroundSize: '100%'}}>
				<div style={{height: '150px', width: '150px'}}><img src={'/images/'.concat(tournament.picture)} className="rounded-circle" alt="" style={{height: '100%', width: '100%'}} /></div>
				<span className={`fs-1 fw-bold text-danger-emphasis text-decoration-underline mt-1 ${tournament.background === '' ? '' : 'bg-white rounded border border-black p-1'}`}>{tournament.title}</span>
				<span>
					<span className={`fw-bold ${tournament.background === '' ? '' : 'bg-white rounded border border-black p-1'}`}>Organizer : {organizer}</span>
					{tournament.organizerId !== props.myProfile.id ? undefined : manageButton }
				</span>
				
			</div>
			<div className="d-flex" style={{maxHeight: '45%'}}>
			{tournament.matchHistory.length === 0 ?
				undefined :
				<div className="d-flex flex-column">
					<span className="ps-2 fs-3 fw-bold text-danger-emphasis text-decoration-underline">Match history</span>
					<div className="d-flex" style={{maxHeight: '100%', width: '210px'}}>
						<ul className="w-100 d-flex rounded w-100 list-group overflow-auto noScrollBar" style={{maxHeight: '100%'}}>
						{tournament.matchHistory.map((match) =>
							<li className="list-group-item d-flex px-4 align-items-center justify-content-between" key={matchId++} style={{minHeight: '90px'}}>
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