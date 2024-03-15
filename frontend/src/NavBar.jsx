import React from 'react'
import { displayNewWindow } from './other'
import MediaQuery from 'react-responsive'

function NavBar({ props }) {

	const addClick = (e) => displayNewWindow({props}, 'Home', 0)

	// let menu = <Menu props={props} />

   return (
        <>
            <div className={`w-100 d-flex ${props.game === 'pong' ? 'bg-primary' : 'bg-warning'} px-3`} style={{height: '50px'}}>
                <button type="button" className="nav-link" data-bs-toggle="dropdown">
                    <MediaQuery maxWidth={600}><img id="burger-menu" src="/images/list.svg" alt="" className="d-none pb-1" /></MediaQuery>
                    <MediaQuery minWidth={600}><img src={'/images/'.concat(props.avatarSm)} alt="" className="rounded-circle" style={{width: '35px', height: '35px'}} /></MediaQuery>
                </button>
                <nav className='dropdown-menu bg-light'>
                    {props.myProfile !== 'none' ? <DropDownIn props={props} /> : <DropDownOut props={props} />}
                </nav>
                <div className='d-flex flex-grow-1 justify-content-between align-items-center'>
                    <Menu props={props} />
                    <button className="nav-link">
                        <img onClick={addClick} src="/images/house.svg" data-link='Home' alt="" />
                    </button>
                </div>
            </div>
        </>
  	)
}



function Menu({props}) {

	const addClick = (e) => { 
		let val = e.target.dataset.link
		if (val === 'Tournaments')
			props.setTournamentId(0)
		displayNewWindow({props}, val, 0)
	}

    var options = [
        "Play",
        "Leaderboard",
        "Tournaments",
        "About"
    ]

    return  <nav id="menu" className="nav d-flex gap-2">
                {options.map((option) => 
					<span className="nav-link alert-link d-flex gap-1" key={option}>
                        <img src={"/images/".concat(option, ".svg")} alt="" />
                        <span onClick={addClick} className='navButton' data-link={option}>{option}</span>
                    </span>)}
            </nav>
}

function DropDownOut({props}) {

	const addClick = () => displayNewWindow({props}, 'Login', 0)

    return  <button onClick={addClick} data-link='Login' className="dropdown-item d-flex align-items-center">
                <img src="/images/Login.svg" alt="" data-link='Login' />
                <span className="ms-1 fw-bold">Login</span>
            </button>
}

function DropDownIn({ props }) {

    const logout = () => {
		if (localStorage.removeItem('ft_transcendenceLogin'))
			localStorage.removeItem('ft_transcendenceLogin')
		if (localStorage.removeItem('ft_transcendencePassword'))
			localStorage.removeItem('ft_transcendencePassword')
		sessionStorage.removeItem('ft_transcendenceSessionLogin')
		sessionStorage.removeItem('ft_transcendenceSessionPassword')
		// setMyStatusToOffline(props.myProfile.id)
        props.setMyProfile('none')
		props.setAvatarSm('base_profile_picture.png')
        // props.setGame('pong')
		// document.getElementById('pong').selected = true
		// document.getElementById('chess').selected = false
        displayNewWindow({props}, "Home", 0)
    }

    const addClick = (e) => {
        let val = e.target.dataset.link
        if (val === "Profile")
			props.setProfileId(props.myProfile.id)
        else if (val === "Logout") {
            logout()
            val = "Home"
        }
        displayNewWindow({props}, val, props.myProfile.id)
    }

    let options = [
        "Logout",
        "Settings",
        "Profile"
    ]

    return (<>
                {options.map((option) => 
				<button onClick={addClick} className="dropdown-item d-flex align-items-center" data-link={option} key={option}>
                    <img src={"/images/".concat(option, ".svg")} data-link={option} alt="" />
                    <span className="ms-1 fw-bold" data-link={option}>{option}</span>
                </button>)}
            </>)
}

export default NavBar