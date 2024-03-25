import React from 'react'

function NavBar({ props }) {

	const addClick = () => props.setPage('Home')

	const menu = <Menu props={props} />

   return (
        <>
            <div className={`w-100 d-flex ${props.game === 'pong' ? 'bg-primary' : 'bg-warning'} px-3`} style={{height: '50px'}}>
                <button type="button" className="nav-link" data-bs-toggle="dropdown">
                    {!props.md ?
                    <img src="/images/list.svg" alt="" className="pb-1" /> :
                    <img src={'/images/'.concat(props.avatarSm)} alt="" className="rounded-circle" style={{width: '35px', height: '35px'}} />}
                </button>
                <nav className='dropdown-menu bg-light'>
                    {props.myProfile ? <DropDownIn props={props} menu={menu} /> : <DropDownOut props={props} menu={menu} />}
                </nav>
                <div className='d-flex flex-grow-1 flex-row-reverse justify-content-between align-items-center'>
                    <button className="nav-link">
                        <img onClick={addClick} src="/images/house.svg" alt="" />
                    </button>
                    {props.md && <nav className="nav d-flex gap-2">{menu}</nav>}
                </div>
            </div>
        </>
  	)
}



function Menu({props}) {

	const addClick = (e) => { 
		let val = e.target.dataset.link
		val === 'Tournaments' && props.setTournamentId(0)
		props.setPage(val)
	}

    var options = [
        "Play",
        "Leaderboard",
        "Tournaments",
        "About"
    ]

    return  <>
                {options.map((option) => 
					<button onClick={addClick} className={`d-flex align-items-center ${!props.md ? 'dropdown-item fw-bold gap-1' : 'nav-link alert-link gap-1'}`} data-link={option} key={option}>
                        <img src={"/images/".concat(option, ".svg")} alt="" data-link={option} />
                        <span onClick={addClick} className='navButton' data-link={option}>{option}</span>
                    </button>)}
            </>
}

function DropDownOut({props, menu}) {

	const addClick = () => props.setPage('Login')

    return ( 
        <>
            <button onClick={addClick} className="dropdown-item d-flex align-items-center">
                <img src="/images/Login.svg" alt="" />
                <span className="ms-1 fw-bold">Login</span>
            </button>
            {!props.md && menu}
        </>
    )
}

function DropDownIn({ props, menu }) {

    const logout = () => {
		var request = new XMLHttpRequest()
		request.open("POST", "/authenticate/sign_out/")
		request.send(props.myProfile.id)
		request.onload = () => console.log(request.response)
		localStorage.getItem('ft_transcendenceLogin') && localStorage.removeItem('ft_transcendenceLogin')
		localStorage.getItem('ft_transcendencePassword') && localStorage.removeItem('ft_transcendencePassword')
        props.setMyProfile(undefined)
		props.setAvatarSm('base_profile_picture.png')
        props.setPage('Home')
    }

    const addClick = (e) => {
        let val = e.target.dataset.link
        val === "Profile" && props.setProfileId(props.myProfile.id)
        if (val === "Logout") {
            logout()
            val = "Home"
        }
        props.setPage(val)
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
                {!props.md && menu}
            </>)
}

export default NavBar