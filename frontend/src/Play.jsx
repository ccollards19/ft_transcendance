import { useState, useEffect } from "react"
import { Friend, Local, Remote, Champion } from "./other.jsx"
import { SpecificTournament, AllTournaments } from "./Tournaments.jsx"
import { OverlayTrigger, Popover }  from 'react-bootstrap'
import { useParams, Link, useNavigate } from "react-router-dom"
import { Pong, Chess } from "./Game.jsx"

export default function Play({props}) {

    return (
		<div style={props.customwindow}>
			{props.myProfile && props.settings.scope === 'remote' ?
				<Remote props={props} /> :
				<Local props={props} />
			}
		</div>
	)
}

