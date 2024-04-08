import React from 'react'
import { Link } from 'react-router-dom'

function NavBar({ props }) {

	const menu = <Menu props={props} />

   	return (
        <>
            <div className={`w-100 d-flex ${props.game === 'pong' ? 'bg-primary' : 'bg-warning'} px-3`} style={{height: '50px'}}>
                <button type="button" className="nav-link" data-bs-toggle="dropdown">
                    {!props.md ?
                    <img src="/images/list.svg" alt="" className="pb-1" /> :
                    <img src={'/images/'.concat(props.myProfile ? props.myProfile.avatar : 'base_profile_picture.png')} alt="" className="rounded-circle" style={{width: '35px', height: '35px'}} />}
                </button>
                <nav className='dropdown-menu bg-light'>
                    {props.myProfile ? <DropDownIn props={props} menu={menu} /> : <DropDownOut props={props} menu={menu} />}
                </nav>
                <div className='d-flex flex-grow-1 flex-row-reverse justify-content-between align-items-center'>
                    <button className="nav-link">
                        <Link to='/'><img src="/images/house.svg" alt="" /></Link>
                    </button>
                    {props.md && <nav className="nav d-flex gap-2">{menu}</nav>}
                </div>
            </div>
        </>
  	)
}



function Menu({props}) {

    var options = [
        "Play",
        "Leaderboard",
        "Tournaments",
        "About"
    ]

    return  <>
                {options.map(option => {
					var path = '/' + option
					if (option === 'Tournaments')
						path = props.page === 'tournaments' ? '/tournaaments' : '/tournaments'
					return (
					<Link to={path + '?0'} onClick={() => props.setPage(path.substring(1))} className={`d-flex align-items-center ${!props.md ? 'dropdown-item fw-bold gap-1' : 'nav-link alert-link gap-1'}`} key={option}>
                        <img src={"/images/".concat(option, ".svg")} alt=""  />
                        <span className='navButton'>{option}</span>
                    </Link>)}
				)}
            </>
}

function DropDownOut({props, menu}) {

    return ( 
        <>
            <Link to='/login' className="dropdown-item d-flex align-items-center">
                <img src="/images/Login.svg" alt="" />
                <span className="ms-1 fw-bold">Login</span>
            </Link>
            {!props.md && menu}
        </>
    )
}

function DropDownIn({ props, menu }) {

    const logout = () => {
		var request = new XMLHttpRequest()
		request.open("POST", "/authenticate/sign_out/", true, props.creds.name, props.creds.password)
		request.send()
		request.onload = () => {}
		localStorage.getItem('ft_transcendenceLogin') && localStorage.removeItem('ft_transcendenceLogin')
		localStorage.getItem('ft_transcendencePassword') && localStorage.removeItem('ft_transcendencePassword')
        props.setMyProfile(undefined)
    }

    let options = [
        "Logout",
        "Settings",
        "Profile"
    ]

    return (<>
                {options.map((option) => {
					var path = '/' + option
					if (path === '/Logout')
						return (
							<Link to='/' onClick={logout} key={option} className="dropdown-item d-flex align-items-center">
            				    <img src="/images/Login.svg" alt="" />
            				    <span className="ms-1 fw-bold">Logout</span>
            				</Link>
						)
					if (path === '/Profile')
						path = props.page === 'profile' ? '/profiile' : '/profile'
					return (
					<Link to={path + '?' + props.myProfile.id} onClick={() => props.setPage(path.substring(1))} className="dropdown-item d-flex align-items-center" key={option}>
                	    <img src={"/images/".concat(option, ".svg")} alt="" />
                	    <span className="ms-1 fw-bold">{option}</span>
                	</Link>)}
				)}
                {!props.md && menu}
            </>)
}

export default NavBar