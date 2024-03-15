import React from 'react'
import { Home, About, Leaderboard, Login, Profile, Settings, Subscribe, Play, Tournaments, NewTournament } from './CustomWindows.jsx'

function MainFrame({ props, chat }) {

    return (
            <div className="flex-grow-1 d-flex align-items-center justify-content-center" style={{backgroundImage: 'url("/images/'.concat(props.game, '.jpg")'), backgroundSize: '100%'}}>
                <Home props={props} />
                <About props={props} />
                <Leaderboard props={props} />
				<Play props={props} />
                <Tournaments props={props} />
                <Profile props={props} />
                {props.myProfile === 'none' ? <Login props={props} /> : undefined}
                {props.myProfile === 'none' ? <Subscribe props={props} /> : undefined}
                {props.myProfile !== 'none' ? <Settings props={props} /> : undefined}
				{props.myProfile !== 'none' ? <NewTournament props={props} /> : undefined}
            </div>
    )
}

export default MainFrame