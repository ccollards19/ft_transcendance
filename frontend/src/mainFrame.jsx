import { Home, About, Leaderboard, Login, Profile, Settings, Subscribe, Play, Tournaments, NewTournament } from './CustomWindows.jsx'

function MainFrame({ props, chat }) {

    const toggleChat = () => props.setDisplayChat(!props.displayChat)

    return (
            <div className="flex-grow-1 d-flex align-items-center justify-content-center position-relative" style={{backgroundImage: 'url("/images/'.concat(props.game, '.jpg")'), backgroundSize: '100%'}}>
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
                {!props.xlg ? 
                    <div className='h-75 position-absolute end-0 me-4 border border-2 border-black rounded' hidden={!props.displayChat}>{chat}</div> : 
                    undefined}
                {props.xlg ?
                    undefined : 
                    <p onClick={toggleChat} className='position-absolute bottom-0 end-0 me-4 rounded-circle bg-dark-subtle d-flex justify-content-center align-items-center border border-2 border-white' style={{width: '40px', height: '40px'}}>
                        <img src='/images/wechat.svg' alt='' className='w-50 h-50' />
                    </p>}
            </div>
    )
}

export default MainFrame