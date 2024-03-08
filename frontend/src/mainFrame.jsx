import React from 'react'
import { Home, About, Leaderboard, Login, Profile, Settings, Subscribe, Play, Tournaments } from './CustomWindows.jsx'

function MainFrame({ props }) {

    return (
            <div className="flex-grow-1 d-flex align-items-center justify-content-center" style={{backgroundImage: 'url("/images/'.concat(props.game, '.gif")'), backgroundSize: '100%'}}>
                <Home props={props} />
                <About />
                <Leaderboard props={props} />
				<Play props={props} />
                <Tournaments props={props} />
                {props.profile !== 'none' ? <Profile props={props} /> : undefined}
                {props.myProfile === 'none' ? <Login props={props} /> : undefined}
                {props.myProfile === 'none' ? <Subscribe props={props} /> : undefined}
                {props.myProfile !== 'none' ? <Settings props={props} /> : undefined}
            </div>
    )
}

export default MainFrame