import { Routes, Route } from "react-router-dom"
import Home from "./Home.jsx"
import About from "./About.jsx"
import Leaderboard from "./Leaderboard.jsx"
import Login from "./Login.jsx"
import Profile from "./Profile.jsx"
import Settings from "./Settings.jsx"
import Subscribe from "./Subscribe.jsx"
import Play from "./Play.jsx"
import { Tournaments, NewTournament } from "./Tournaments.jsx"
import Match from "./Match.jsx"
import Game from "./Game.jsx"
import NoPage from "./NoPage.jsx"
import ThreeD from './niespana/testThree.js'
import Test from "./niespana/outlinetest.js"
import Pong3D from "./niespana/Pong3d.js"

function MainFrame({ props, chat }) {

	const toggleChat = () => document.getElementById('chat2').hidden = !document.getElementById('chat2').hidden

	return (
		<div className="flex-grow-1 d-flex align-items-center justify-content-center position-relative " style={{ backgroundImage: 'url("/images/' + props.settings.game + '.jpg")', backgroundSize: 'cover', maxWidth: props.xlg ? 'calc(100vw - 300px)' : '' }}>
			<Routes>
				<Route path="/" element={<Home props={props} />} />
				<Route path="/about" element={<About props={props} />} />
				<Route path="/profile" element={<Profile props={props} />} />
				<Route path="/login" element={<Login props={props} />} />
				<Route path="/settings" element={<Settings props={props} />} />
				<Route path="/tournaments/:id" element={<Tournaments props={props} />} />
				<Route path="/leaderboard" element={<Leaderboard props={props} />} />
				<Route path="/subscribe" element={<Subscribe props={props} />} />
				<Route path="/play" element={<Play props={props} />} />
				<Route path="/newTournament" element={<NewTournament props={props} />} />
				<Route path="/match/:game/:match/:userId/:name/:avatar" element={<Match props={props} />} />
				<Route path="/game/:game/:match" element={<Game props={props} />} />
				<Route path="/chess" element={<ThreeD id1="1" id2="2" roomid={2}/>} />
				<Route path="/test" element={<Test />} />
				<Route path="/pong" element={<Pong3D />} />
			</Routes>
			{!props.xlg && <div id='chat2' className='h-75 position-absolute end-0 me-4 border border-2 border-black rounded' hidden style={{ zIndex: '2' }}>{chat}</div>}
			{!props.xlg &&
				<p onClick={toggleChat} className='position-absolute bottom-0 end-0 me-4 mb-2 rounded-circle bg-dark-subtle d-flex justify-content-center align-items-center border border-2 border-white' style={{ width: '40px', height: '40px', zIndex: '2' }}>
					<img src='/images/wechat.svg' alt='' className='w-50 h-50' />
				</p>}
		</div>
	)
}

export default MainFrame
