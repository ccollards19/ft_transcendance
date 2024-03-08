import React from 'react'
import { loadProfile } from './other'

export function displayNewWindow(val) {
	document.getElementById(sessionStorage.getItem('currentPage')).classList.add('d-none')
	document.getElementById(val).classList.remove('d-none')
	sessionStorage.setItem('currentPage', val)
}

function NavBar({ props }) {

	const addClick = (e) => { displayNewWindow(e.target.dataset.link)}

    return (
        <>
            <div className="w-100 d-flex bg-warning px-3" style={{height: '50px'}}>
                <button type="button" className="nav-link" data-bs-toggle="dropdown">
                    <img id="burger-menu" src="/images/list.svg" alt="" className="d-none pb-1" />
                    <img src={'/images/'.concat(props.avatarSm)} alt="" className="rounded-circle" style={{width: '35px', height: '35px'}} />
                </button>
                <nav className='dropdown-menu bg-light'>
                    {props.myProfile !== 'none' ? <DropDownIn props={props} /> : <DropDownOut />}
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
			props.setTournament('none')
		displayNewWindow(val)
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

const DropDownOut = () => {

	const addClick = (e) => { displayNewWindow(e.target.dataset.link) }

    return  <button onClick={addClick} data-link='Login' className="dropdown-item d-flex align-items-center">
                <img src="/images/Login.svg" alt="" data-link='Login' />
                <span data-link='Login' className="ms-1 fw-bold">Login</span>
            </button>
}

function DropDownIn({ props }) {

    const logout = () => {
		localStorage.setItem('ft_transcendenceCred', {login: '', password: ''})
        props.setMyProfile('none')
		props.setAvatarSm('base_profile_picture.png')
        props.setGame('pong')
		document.getElementById('pong').selected = true
		document.getElementById('chess').selected = false
        displayNewWindow("Home")
    }

    const addClick = (e) => {
        let val = e.target.dataset.link
        if (val === "Profile") { loadProfile({props}, props.myProfile.id) }
        else if (val === "Logout") {
            logout()
            val = "Home"
        }
        displayNewWindow(val)
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