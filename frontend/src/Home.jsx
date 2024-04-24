import { Link } from "react-router-dom"

export default function Home({props}) {

	if (props.socket.page !== 'home' && props.socket.readyState === 1) {
		props.socket.send(JSON.stringify({component : 'home'}))
		props.socket.page = 'home'
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)	
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
		}
	}

    return (
        <div style={props.customwindow} className='noScrollBar'>
            <h1 className="text-center pt-2">Welcome !!!</h1>
            <hr className="mx-5" />
            <h3 className="text-center mb-3">Fancy a game of pong ?</h3>
            <h4 className="text-center">How to use :</h4>
            <p className="text-center mb-2">
                First, you need to <Link to='/login' className={'nav-link d-inline '.concat(props.myProfile ? 'text-danger' : 'text-primary')}>login</Link> if you already have an account.
            </p>
            <p className="text-center mb-2">
                You may also use your 42 login if you have one
            </p>
            <div className="d-flex justify-content-center">
                <button className="nav-link" title="Click to get to the 42 login page" disabled={props.myProfile}>
                    <img src="/images/42_logo.png" alt="" className="px-3 border border-black" />
                </button>
            </div>
            <p className="px-5 mt-2 text-center">
                or <Link to='/subscribe' className={'nav-link d-inline '.concat(props.myProfile ? 'text-danger' : 'text-primary')}>create a new account</Link>.
            </p>
			<p className="px-5 mt-2 text-center">
				(You may also visit the website, and even play locally, without an account.)
			</p>
            <p className="text-center">
                Once you're in, take all your sweet time to complete your profile.
            </p>
            <p className="text-center">
                That's also where you will find a list of the users you added as friends.
            </p>
            <p className="text-center">
                Then, take a look at the 'Settings' page and adjust things to your liking.
            </p>
            <p className="text-center">
                Note : Uncheck 'Challengeable' if you are here only to chat and watch other player's matches.
            </p>
            <p className="text-center">
                The game you choose to play today affects everything game-related everywhere on the website.
            </p>
            <p className="text-center">
                That includes the background, the profiles display, the leaderboard, the tournaments list and whatever is displayed on the 'Play' page if you chose to play remotely.
            </p>
            <p className="text-center">
                You will find a chat, on the left or behind a button on the bottom right, depending on the width of your screen. You need to be connected to use it.
            </p>
            <p className="text-center">
                You may use it to speak with everyone who's connected to the website via the default 'General' channel. 
            </p>
            <p className="text-center">
                A unique channel is created for each game, for the exclusive use of contenders and potential viewers (if you allowed them in the settings).
            </p>
			<p className="text-center">
				Each tournament has its own chat too.
			</p>
            <p className="text-center">
                You may also click on any nickname (except yours) to display a small menu filled with self-explanatory options
            </p>
            <p className="text-center">
                On the 'Leaderboard' page, you will find the top [up to] 50 players, ranked by the ELO system, for the game you chose to display.
            </p>
            <p className="text-center">
                Finally, the 'About' page will give you informations about this project.
            </p>
            <p className="text-center">
                At any time, you can display this manual by clicking on the 'home' button, top right of the screen.
            </p>
        </div>
    )
}
