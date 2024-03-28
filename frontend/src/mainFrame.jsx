import { useState } from 'react'
import { Home, About, Leaderboard, Login, Profile, Settings, Subscribe, Play, Tournaments, NewTournament, Match, Game } from './CustomWindows.jsx'

function MainFrame({ props, chat }) {

    const toggleChat = () => document.getElementById('chat2').hidden = !document.getElementById('chat2').hidden

    var xhr = undefined

    if (props.page === 'Profile') {
        xhr = new XMLHttpRequest()
    //  xhr.open('GET', '/api/user/' + props.profileId + '/')
        xhr.open('GET', '/data/sampleProfiles.json')
        xhr.seenBytes = 0
        xhr.send()
    }

    return (
            <div className="flex-grow-1 d-flex align-items-center justify-content-center position-relative" style={{backgroundImage: 'url("/images/'.concat(props.game, '.jpg")'), backgroundSize: 'cover', maxWidth: props.xlg ? 'calc(100vw - 300px)' : ''}}>
                {props.page === 'Home' && <Home props={props} />}
                {props.page === 'About' && <About props={props} />}
                {props.page === 'Leaderboard' && <Leaderboard props={props} />}
				{props.page === 'Play' && <Play props={props} />}
                {props.page === 'Tournaments' && <Tournaments props={props} />}
                {props.page === 'Profile' && <Profile props={props} xhr={xhr} />}
                {props.page === 'Login' && <Login props={props} />}
                {props.page === 'Subscribe' && <Subscribe props={props} />}
                {props.page === 'Settings' && <Settings props={props} />}
				{props.page === 'NewTournament' && <NewTournament props={props} />}
				{props.page === 'Match' && <Match props={props} />}
				{props.page === 'Game' && <Game props={props} />}
                {!props.xlg && <div id='chat2' className='h-75 position-absolute end-0 me-4 border border-2 border-black rounded' hidden style={{zIndex : '2'}}>{chat}</div>}
                {!props.xlg &&
                    <p onClick={toggleChat} className='position-absolute bottom-0 end-0 me-4 mb-2 rounded-circle bg-dark-subtle d-flex justify-content-center align-items-center border border-2 border-white' style={{width: '40px', height: '40px', zIndex : '2'}}>
                        <img src='/images/wechat.svg' alt='' className='w-50 h-50' />
                    </p>}
            </div>
    )
}

export default MainFrame