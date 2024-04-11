import { Routes, Route } from "react-router-dom"
import { Home, About, Leaderboard, Login, Profile, Settings, Subscribe, Play, Tournaments, NewTournament, Match, Game, NoPage } from './CustomWindows.jsx'

function MainFrame({ props, chat }) {

    const toggleChat = () => document.getElementById('chat2').hidden = !document.getElementById('chat2').hidden

    return (
            <div className="flex-grow-1 d-flex align-items-center justify-content-center position-relative" style={{backgroundImage: 'url("/images/' + props.game + '.jpg")', backgroundSize: 'cover', maxWidth: props.xlg ? 'calc(100vw - 300px)' : ''}}>
    			<Routes>
    			      	<Route path="/" element={<Home props={props} />} />
    			      	<Route path="/about" element={<About props={props} />} />
    			      	<Route path="/profile/:id" element={<Profile props={props} />} />
    			      	<Route path="/login" element={<Login props={props} />} />
    			      	<Route path="/settings" element={<Settings props={props} />} />
    			      	<Route path="/tournaments/:id" element={<Tournaments props={props} />} />
    			      	<Route path="/leaderboard" element={<Leaderboard props={props} />} />
    			      	<Route path="/subscribe" element={<Subscribe props={props} />} />
    			      	<Route path="/play" element={<Play props={props} />} />
    			      	<Route path="/newTournament" element={<NewTournament props={props} />} />
    			      	<Route path="/match/:game/:match/:userId/:name/:avatar" element={<Match props={props} />} />
    			      	<Route path="/game/:game/:match" element={<Game props={props} />} />
    			      	<Route path="*" element={<NoPage props={props} />} />
    			</Routes>
                {!props.xlg && <div id='chat2' className='h-75 position-absolute end-0 me-4 border border-2 border-black rounded' hidden style={{zIndex : '2'}}>{chat}</div>}
                {!props.xlg &&
                    <p onClick={toggleChat} className='position-absolute bottom-0 end-0 me-4 mb-2 rounded-circle bg-dark-subtle d-flex justify-content-center align-items-center border border-2 border-white' style={{width: '40px', height: '40px', zIndex : '2'}}>
                        <img src='/images/wechat.svg' alt='' className='w-50 h-50' />
                    </p>}
            </div>
    )
}

export default MainFrame