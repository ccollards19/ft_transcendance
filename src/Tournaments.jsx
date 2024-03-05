import React from "react";
import { useState } from "react";
import { displayNewWindow } from "./NavBar";

export function AllTournaments({props}) {

	return (
		<ul title='allTournaments'>
			
		</ul>
	)

}

export function MySubscriptions({props}) {

	return (
		<ul title='mySubscriptions'>

		</ul>
	)

}

export function MyTournaments({props}) {

	return (
		<ul title='myTournaments'>

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