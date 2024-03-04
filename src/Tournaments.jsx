import React from "react";
import { useState } from "react";
import { displayNewWindow } from "./NavBar";

export function MyTournaments({props}) {

	const addClick = (e) => {
		props.setTournamentId(e.target.dataset.tournament)
		if (sessionStorage.getItem('currentPage') !== 'Tournaments')
			displayNewWindow("Tournaments")
	}

	let style = {
        minHeight: '100px',
        maxHeight: '250px',
        width: '90%'
    }

	if (props.tournaments === 'none')
		return  <div className="d-flex rounded border border-black align-items-center justify-content-center fw-bold" style={style}>What are you doing !? Go and conquer the world !</div>

	return (
		<ul title='myTournaments' className="list-group overflow-auto noScrollBar" style={style}>
			{props.tournaments.map((tournament) => 
			<li className="list-group-item d-flex" key={tournament.id}>
				<div className="d-flex align-items-center" style={{width: '50px', height: '50px'}}>
					<img className="rounded-circle" title='See profile' src={"/images/".concat(tournament.picture)} alt="" style={{width: '45px', height: '45px'}} />
				</div>
				<div className="d-flex justify-content-between align-items-center fw-bold ms-2 flex-grow-1">
					<span>{tournament.title} <span className="text-primary fw-bold" hidden={tournament.organizer !== props.myProfile.id}>(You are the organizer)</span></span>
					<div><button onClick={addClick} data-tournament={tournament.id} type='button' className="btn btn-secondary">See tournament's page</button></div>
				</div>
			</li>)}
		</ul>
	)
}

export function AllTournaments() {

	return (
		<ul title='allTournaments'>

		</ul>
	)

}

export function MySubscriptions() {

	return (
		<ul title='mySubscriptions'>

		</ul>
	)

}

export function TournamentsTabs({tabs}) {
	const [activeTab, setActiveTab] = useState(tabs[0].props.title);

	const Tab = ({ title, onClick, active = false }) => {
		const onClickTab = e => {
		  e.preventDefault(0)
		  onClick(title)
		}
	}

  	const onClickTabItem = tab => setActiveTab(tab)

  	return (
  	  <>
  	    <div className="tabs">
  	      <ul className="tab-list">
  	        {tabs.map(tab => {
  	          const { title } = tab.props

  	          return (
  	            <Tab
  	              key={title}
  	              title={title}
  	              onClick={onClickTabItem}
  	              active={title === activeTab ? true : false}
  	            />
  	          )
  	        })}
  	      </ul>

  	      <div className="tab-content">
  	        {tabs.map(tab => {
  	          if (tab.props.title !== activeTab) return undefined

  	          return tab.props.children
  	        })}
  	      </div>
  	    </div>
  	  </>
  	)
}

export function SpecificTournament({props}) {

}