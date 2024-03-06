import React from "react"
import { useState } from "react"
import { displayNewWindow } from "./NavBar"

const Tab = ({myProfile, key, title, onClick, active = false}) => {
	const onClickTab = e => {
		if (myProfile !== 'none') {
			e.preventDefault(0)
			onClick(title)
		}
	}

	return (
		<>
		  <li key={key} className={`${active ? "active" : ""} ${myProfile === 'none' ? '' : 'tab-item'} ${myProfile === 'none' && title !== 'All Tournaments' ? 'text-body-tertiary' : ''} d-flex flex-grow-1 justify-content-center p-3 fw-bold text-uppercase ${title === 'All Tournaments' ? 'rounded-start-2' : ''} ${title === 'My Tournaments' ? 'rounded-end-2' : ''}`} onClick={onClickTab}>
			{title}
		  </li>
		</>)
}

export function Tabs({children, props}) {

	const [activeTab, setActiveTab] = useState(children[0].props.title);

  	const onClickTabItem = tab => setActiveTab(tab)

  	return (
  	  <>
  	    <div className="tabs" style={{maxHeight: '100%'}}>
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
	return props.tournaments[props.tournamentId].title
}