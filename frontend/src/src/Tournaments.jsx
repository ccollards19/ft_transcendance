import React from "react"
import { useState } from "react"
import { displayNewWindow } from "./NavBar"

const Tab = ({key, title, onClick, active = false}) => {
	const onClickTab = e => {
		e.preventDefault(0)
		onClick(title)
	}

	return (
		<>
		  <li key={key} className={`${active ? "active" : ""} tab-item d-flex flex-grow-1 justify-content-center p-3 fw-bold text-uppercase border border-black rounded`} onClick={onClickTab}>
			{title}
		  </li>
		</>)
}

export function Tabs({children, props}) {

	const [activeTab, setActiveTab] = useState(children[0].props.title);

  	const onClickTabItem = tab => setActiveTab(tab)

  	return (
  	  <>
  	    <div className="tabs">
  	      <ul className="tab-list p-0 d-flex overflow-auto noScrollBar">
  	        {children.map(tab => {
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

  	      <div className="tab-content overflow-auto noScrollBar" style={{maxHeight: '80%'}}>
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

}