import { useState, useEffect } from "react"
import { Friend, Local, Remote, Champion } from "./other.jsx"
import { SpecificTournament, AllTournaments } from "./Tournaments.jsx"
import { OverlayTrigger, Popover }  from 'react-bootstrap'
import { useParams, Link, useNavigate } from "react-router-dom"
import { Pong, Chess } from "./Game.jsx"

export default function About({props}) {

	if (props.socket.page !== 'about' && props.socket.readyState === 1) {
		props.socket.send(JSON.stringify({component : 'about'}))
		props.socket.page = 'about'
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
		}
	}

    return (
        <div style={props.customwindow}>
            <h1 className="text-center">About this project</h1>
            <hr className="mx-5" />
            <p className="mx-5 text-center">
                This is ft_transcendence, the final project of 19's common core.
            </p>
            <p className="mx-5 text-center">
                The goal is to make a Single Page Application (SPA) designed to let players confront each other in Pong !
            </p>
            <p className="mx-5 text-center mb-4">
                Some modules were added to that basis :
            </p>
            <ul className="aboutList text-center p-0">
                <li className="mb-2"><i>Bootstrap and React were used to make the frontend</i></li>
                <li className="mb-2"><i>Django was used to make the backend</i></li>
                <li className="mb-2"><i>The game is handled by the server (API)</i></li>
                <li className="mb-2"><i>The website is linked to a database, so we don't lose anything when we shut it down (except for the chat, which is session dependant)</i></li>
                <li className="mb-2"><i>Another game is available (Chess)</i></li>
                <li className="mb-2"><i>The chat</i></li>
                <li className="mb-2"><i>You may play against a remote player, you don't HAVE to share a keyboard</i></li>
                <li className="mb-2"><i>You may play in the terminal. Less pretty but still fun</i></li>
            </ul>
            <hr className="mx-5" />
            <h3 className="mx-5 text-center mb-4">
                The team is composed of :
            </h3>
            <ul className="aboutList text-center p-0">
                <li className="mb-2">Karim Talbi</li>
                <li className="mb-2">Cyril Collard</li>
                <li className="mb-2">Nicolas Espana Ribera</li>
                <li className="mb-2">Gilles Poncelet</li>
            </ul>
			<hr className="mx-5" />
			<h3 className="mx-5 text-center mb-4">
                F.A.Q.
            </h3>
			<p className="mx-5 text-center">
				What's the difference between muted and blocked users ?
			</p>
			<p className="mx-5 text-center">
				<strong>
					Mute will only prevent a specific user's messages to be displayed in your chat. It is session dependant, meaning if you logout / login or reload the page, all muted users will be displayed again.
					<br/>
					Blocking a user also shuts him down in the chat but not only. He will leave your friendlist if he was in it and won't be allowed to send you another friend request or challenge you. And he will stay blocked over a logout / login or reaload on your part.
				</strong>
			</p>
			<p className="mx-5 text-center">
				Why can't I challenge some of my friends ?
			</p>
			<p className="mx-5 text-center">
				<strong>
					They probably unchecked the 'Challengeable' option in their settings, meaning they are here to chat or watch games but not to play themselves.
				</strong>
			</p>
			<p className="mx-5 text-center">
				Why can't I watch some of my friend's matches ?
			</p>
			<p className="mx-5 text-center">
				<strong>
					At least one of the two contenders unchecked the 'Allow spectators ?' option, making the match private. However, they can agree upon having some special guests and send you an invitation link.
				</strong>
			</p>
			<p className="mx-5 text-center">
				Sometimes, I get a blank page. Why?
			</p>
			<p className="mx-5 text-center">
				<strong>
					That means the server has encountered a problem and you are not connected. That means you cannot access any page other than the home page and this one. Please try again later
				</strong>
			</p>
        </div>
    )
}

