import { useState, useEffect } from "react"
import { Friend, Local, Remote, Champion } from "./other.jsx"
import { SpecificTournament, AllTournaments } from "./Tournaments.jsx"
import { OverlayTrigger, Popover }  from 'react-bootstrap'
import { useParams, Link, useNavigate } from "react-router-dom"
import { Pong, Chess } from "./Games.jsx"

export default function NoPage({props}) {

	useEffect(() => {
		if (props.socket.page !== 'noPage' && props.socket.readyState === 1) {
			props.socket.send(JSON.stringify({component : 'noPage'}))
			props.socket.page = 'noPage'
		}
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
		}
	})

	return (
		<div className="d-flex justify-content-center align-items-center fw-bold fs-1" style={props.customwindow}>This page does not exist. Please check url and try again</div>
	)

}

