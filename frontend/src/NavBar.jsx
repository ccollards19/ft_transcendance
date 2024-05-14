import React from 'react'
import { Link } from 'react-router-dom'
import { leaveAllChats } from './Social.js'

export default function NavBar({ props }) {

	const menu = <Menu props={props} />

   	return (
        <>
            <div className={`w-100 d-flex ${props.settings.game === 'pong' ? 'bg-primary' : 'bg-warning'} px-3`} style={{height: '50px'}}>
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
                        <Link id='homeButton' to='/'><img src="/images/house.svg" alt="" /></Link>
                    </button>
                    {props.md && <nav className="nav d-flex gap-2">{menu}</nav>}
                </div>
                <nav className='d-flex gap-2 align-items-center ps-2 fs-6'>
                        <button onClick={() => props.setLanguage('en')} className={`nav-link fw-bold ${props.language === 'en' && 'text-decoration-underline text-danger-emphasis'}`}>EN</button>
                        <button onClick={() => props.setLanguage('fr')} className={`nav-link fw-bold ${props.language === 'fr' && 'text-decoration-underline text-danger-emphasis'}`}>FR</button>
                        <button onClick={() => props.setLanguage('de')} className={`nav-link fw-bold ${props.language === 'de' && 'text-decoration-underline text-danger-emphasis'}`}>DE</button>
                </nav>
            </div>
        </>
  	)
}

function Menu({props}) {

    var images = [
        "Play",
        "Leaderboard",
        "Tournaments",
        "About"
    ]

    var options = [
        props.languages[props.language].menu5,
        props.languages[props.language].menu6,
        props.languages[props.language].menu7,
        props.languages[props.language].menu8
    ]
    
    let image = 0
    let index = 0

    return  <>
                {options.map(option => {
					var path = '/' + images[index++]
					if (option === 'Tournaments' || option === 'Tournois' || option === 'Turniere')
						path = '/Tournaments/0'
					return (
					<Link to={path} className={`d-flex align-items-center ${!props.md ? 'dropdown-item fw-bold gap-1' : 'nav-link alert-link gap-1'}`} key={option}>
                        <img src={"/images/".concat(images[image++], ".svg")} alt=""  />
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
                <span className="ms-1 fw-bold">{props.languages[props.language].menu1}</span>
            </Link>
            {!props.md && menu}
        </>
    )
}

function DropDownIn({ props, menu }) {

    const logout = () => {
        leaveAllChats(props.socket, props.chats, props.setChats, props.setChanName, props.setChanTag)
        props.setMyProfile(undefined)
		let xhr = new XMLHttpRequest()
		xhr.open("POST", "/authenticate/sign_out/")
        xhr.onload = () => props.setSocket(new WebSocket('ws://localhost/ws/'))
		xhr.send()   
    }

    let images = [
        "Logout",
        "Settings",
        "Profile"
    ]

    let image = 1
    let index = 0

    let options = [
        props.languages[props.language].menu2,
        props.languages[props.language].menu3,
        props.languages[props.language].menu4
    ]

    return (<>
                {options.map((option) => {
					var path = '/' + images[index++]
					if (option === 'Logout' || option === 'Déconnexion' || option === 'Trennung')
						return (
							<Link to='/' onClick={logout} key={option} className="dropdown-item d-flex align-items-center">
            				    <img src="/images/Logout.svg" alt="" />
            				    <span className="ms-1 fw-bold">{props.languages[props.language].menu2}</span>
            				</Link>
						)
					if (path === '/Profile')
						path = path + '/' + props.myProfile.id
					return (
					<Link to={path} className="dropdown-item d-flex align-items-center" key={option}>
                	    <img src={"/images/".concat(images[image++], ".svg")} alt="" />
                	    <span className="ms-1 fw-bold">{option}</span>
                	</Link>)}
				)}
                {!props.md && menu}
            </>)
}
