import { useState, useEffect } from "react"
import { Friend, Local, Remote, Champion } from "./other.jsx"
import { SpecificTournament, AllTournaments } from "./Tournaments.jsx"
import { OverlayTrigger, Popover }  from 'react-bootstrap'
import { useParams, Link, useNavigate } from "react-router-dom"
import { Pong, Chess } from "./Games.jsx"

export default function Game({props}) {

	const match = parseInt(useParams().match, 10)
	const game = useParams().game

	if (isNaN(match))
		props.setHack(true)

	return (
		<div className='w-100 h-100'>
			{game === 'pong' ?
				<Pong props={props} match={match} /> :
				<Chess props={props} match={match} />
			}
		</div>
	)
}

