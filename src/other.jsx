import React from 'react'
import { useState } from "react"
import { displayNewWindow } from "./NavBar.jsx"

export function FriendList({profileId, setProfileId, myProfile, friends, game}) {
    
    const seeProfile = (e) => { setProfileId(parseInt(e.target.dataset.id, 10)) }

    return (
        <ul className="w-25 d-flex rounded w-100 list-group overflow-auto noScrollBar" style={{maxHeight: '100%', maxWidth: '280px'}}>
            {friends.map((profile) => <li className='list-group-item d-flex ps-2 friend' key={profile.id}>
                <div style={{height: '70px', width: '70px'}}>
                    <img className='rounded-circle' style={{height: '70px', width: '70px'}} src={'/images/'.concat(profile.avatar)} alt="" />
                </div>
                <div className='d-flex flex-wrap align-items-center ms-3'>
                    <span className='w-100'>{profile.name}</span>
                    <span className={'fw-bold text-capitalize '.concat(profile.status === "online" ? 'text-success' : 'text-danger')}>
                        {profile.status}
                    </span>
                    <button type='button' data-bs-toggle='dropdown' className='btn btn-secondary ms-3'>Options</button>
                    <ul className='dropdown-menu' style={{backgroundColor: '#D8D8D8'}}>
                        <li type='button' className='ps-2 dropdown-item nav-link' hidden={!profile.challengeable || profile.game !== game || profile.status !== 'online' || myProfile === 'none' || profile.id === myProfile.id}>Challenge</li>
                        <li type='button' className='ps-2 dropdown-item nav-link' hidden={profile.status !== 'online' || myProfile === 'none' || profile.id === myProfile.id}>Direct message</li>
                        <li type='button' className='ps-2 dropdown-item nav-link' hidden={profileId !== myProfile.id}>Unfriend</li>
                        <li onClick={seeProfile} type='button' data-id={profile.id} className='ps-2 dropdown-item nav-link'>See profile</li>
                    </ul>
                </div>
            </li>)}
        </ul>
    )
}

export function Ladder({ladder, setProfileId, game}) {

    const [profiles, setProfiles] = useState('none')

    if (profiles === 'none') {
        var request = new XMLHttpRequest()
        request.open("GET", "/data/profiles.json")
        request.setRequestHeader('Cache-Control', 'no-cache, no-store, max-age=0')
        request.responseType = 'json'
        request.send()
        request.onload = () => { setProfiles(request.response) }
        return <div className="d-none"></div>
    }

    const seeProfile = (e) => {
        setProfileId(parseInt(e.target.dataset.id, 10))
        displayNewWindow('Profile')
    }

    let champions = getProfiles(ladder, profiles)
    let rank = 1

    return ( <>
        {champions.map((profile) => <li className="list-group-item w-100 d-flex align-items-center p-1" style={{minHeight: '50px'}} key={profile.id}>
            <span style={{width: '5%'}} className="d-flex justify-content-center">{rank++}</span>
            <span style={{width: '5%'}} className="h-100">
                <img onClick={(seeProfile)} src={'/images/'.concat(profile.avatar)} className="profileLink rounded-circle" data-id={profile.id} alt="" title='See profile' style={{height: '45px', width: '45px'}} />
            </span>
            <span style={{width: '50%'}}>{profile.name}</span>
            <span style={{width: '10%'}} className="d-flex justify-content-center">{profile[game].matches}</span>
            <span style={{width: '10%'}} className="d-flex justify-content-center">{profile[game].wins}</span>
            <span style={{width: '10%'}} className="d-flex justify-content-center">{profile[game].loses}</span>
            <span style={{width: '10%'}} className="d-flex justify-content-center">{profile[game].level}</span>
        </li>)}
        </>
    )
}

function getProfiles(ladder, profiles) {
    let result = []
    for (let player of ladder) {
        result.push(profiles[player])
    }
    return result
}

export function Local({myProfile, setMyProfile, setGame}) {
	const [ready, setReady] = useState({
		player1: false,
		player2: false
	})
	const [start, setStart] = useState(false)
	const [profile1, setProfile1] = useState('none')
	const [profile2, setProfile2] = useState('none')
    const [form1, setForm1] = useState({
        login: '',
        password: ''
    })
    const [form2, setForm2] = useState({
        login: '',
        password: ''
    })
    const [emptyLogin1, setEmptyLogin1] = useState(false)
    const [emptyLogin2, setEmptyLogin2] = useState(false)
    const [emptyPW1, setEmptyPW1] = useState(false)
    const [emptyPW2, setEmptyPW2] = useState(false)
    const [wrongForm1, setWrongForm1] = useState(true)
    const [wrongForm2, setWrongForm2] = useState(true)

    if (myProfile !== 'none' && profile1 === 'none')
        setProfile1({
            name: myProfile.name,
            avatar: myProfile.avatar,
            id: myProfile.id
    })

    const changeGame = (e) => { setGame(e.target.dataset.game) }

	function checkReady(player, check) {
		if (player === 'player1' && check && ready.player2)
			setStart(true)
		else if (player === 'player2' && check && ready.player1)
			setStart(true)
		else
			setStart(false)
	}
	
	const playerReady = (e) => {
		let newStatus = {
			...ready,
			[e.target.dataset.player]: e.target.checked
		}
		checkReady(e.target.dataset.player, e.target.checked)
		setReady(newStatus)
	}

    function checkIssue(form, player) {
        let issue = false
        if (form.login === '') {
            player === 'player1' ? setEmptyLogin1(true) : setEmptyLogin2(true)
            issue = true
        }
        if (form.password === '') {
            player === 'player1' ? setEmptyPW1(true) : setEmptyPW2(true)
            issue = true
        }
        return issue
    }

	const loginLocal = (e) => {
		// let newProfile = {
		// 	name: 'Monkey D. Luffy',
		// 	avatar: 'luffy.jpeg'
		// }
		// if (e.target.dataset.player == 'player1')
        //     setProfile1(newProfile)
		// else
		// 	setProfile2(newProfile)
        let player = e.target.dataset.player
        let form = player === 'player1' ? form1 : form2
        if (!checkIssue(form, player)) {
            // let profile = getProfile()
            let profile = {
		    	name: 'Monkey D. Luffy',
		    	avatar: 'luffy.jpeg'
		    }
            if (profile < 0 && player === 'player1')
                setWrongForm1(false)
            else if (profile < 0)
                setWrongForm2(false)
            else if (player === 'player1')
                setProfile1(profile)
            else
                setProfile2(profile)
        }
	}

	const logout = () => {
		setProfile1('none')
		document.getElementById('avatar-small').src = '/images/base_profile_picture.png'
        setMyProfile('none')
		displayNewWindow('Home')
	}

	const logoutLocal = (e) => {
		if (e.target.dataset.player === 'player1' && myProfile !== 'none') {
			if(window.confirm('Warning ! You will be disconnected from the website'))
				logout()
		}
		else if (e.target.dataset.player === 'player1')
			setProfile1('none')
		else
			setProfile2('none')
	}

    const typing = (e) => {
        let {name, value} = e.target
        if (e.target.dataset.player === 'player1') {
            setForm1({
                ...form1,
                [name]: value    
            })
            setEmptyLogin1(false)
            setEmptyPW1(false)
            setWrongForm1(true)
        }
        else {
            setForm2({
                ...form2,
                [name]: value    
            })
            setEmptyLogin2(false)
            setEmptyPW2(false)
            setWrongForm2(true)
        }

    }

	return (
		<>
            <div className="w-100 text-center dropdown-center mb-4">
                <button id="chooseGame" type="button" className="btn btn-success" data-bs-toggle="dropdown">What game will you play?</button>
                <ul className="dropdown-menu">
                	<li type='button' onClick={changeGame} data-game='pong' className="dropdown-item d-flex align-items-center">
                	    <img data-game='pong' src="/images/joystick.svg" alt="" />
                	    <span data-game='pong' className="ms-2">Pong</span>
                	</li>
                	<li type='button' onClick={changeGame} data-game='chess' className="dropdown-item d-flex align-items-center">
                	    <img data-game='chess' src="/images/hourglass.svg" alt="" />
                	    <span data-game='chess' className="ms-2">Chess</span>
                	</li>
                </ul>
            </div>
            <div className="d-flex flex-grow-1 align-items-center justify-content-between my-2" style={{height: '80%'}}>
                <div className="border border-black border-3 rounded d-flex justify-content-center align-items-center" style={{height: '100%', width: '50%'}}>
					{profile1 !== 'none' ? 
						<div className="d-flex flex-column align-items-center">
							<img src={'/images/'.concat(profile1.avatar)} alt="" className="rounded-circle" style={{width: '150px', height: '150px'}} />
							<span className="mt-2 fw-bold fs-1">{profile1.name}</span>
							<span className="d-flex gap-2 mt-3">
								<input onChange={playerReady} className="form-check-input" data-player='player1' type="checkbox" name="ready1" id="ready1" />
								<label className="form-check-label" htmlFor="ready1">Ready ?</label>
							</span>
							<button onClick={logoutLocal} data-player='player1' type='button' className="btn btn-primary mt-3">Logout</button>
						</div> :
						<div className="d-flex flex-column align-items-center border border-black border-2 rounded p-5 bg-secondary">
							<form action="" className="d-flex flex-column align-items-center">
                			    <div className="mb-2">
                			        <label htmlFor="logAddressLocal1" className="form-label">Username</label>
                			        <input onChange={typing} data-player='player1' name="login" type="text" className={"form-control ".concat(emptyLogin1 ? 'border border-3 border-danger' : '')} id="logAddressLocal1" />
                			    </div>
                			    <div className="mb-3">
                			        <label htmlFor="logPasswordLocal1" className="form-label">Password</label>
                			        <input onChange={typing} data-player='player1' name="password" type="password" className={"form-control ".concat(emptyPW1 ? 'border border-3 border-danger' : '')} id="logPasswordLocal1" />
                			    </div>
                                <div className="text-danger-emphasis mt-2" hidden={wrongForm1}>Wrong address or password</div>
                			    <button onClick={loginLocal} data-player='player1' type="button" className="btn btn-info mb-2">Login</button>
                			</form>
							<span className="d-flex gap-2 mt-3">
								<input onChange={playerReady} className="form-check-input" data-player='player1' type="checkbox" name="guest1" id="guest1" />
								<label className="form-check-label" htmlFor="guest1">Play as a guest</label>
							</span>
						</div>
					}
				</div>
                <img src="/images/versus.png" className="mx-3" alt="" style={{height: '150px',width: '100px'}} />
                <div className="border border-black border-3 rounded d-flex justify-content-center align-items-center" style={{height: '100%', width: '50%'}}>
					{profile2 !== 'none' ? 
						<div className="d-flex flex-column align-items-center">
							<img src={'/images/'.concat(profile2.avatar)} alt="" className="rounded-circle" style={{width: '150px', height: '150px'}} />
							<span className="mt-2 fw-bold fs-1">{profile2.name}</span>
							<span className="d-flex gap-2 mt-3">
								<input onChange={playerReady} className="form-check-input" data-player='player2' type="checkbox" name="ready1" id="ready1" />
								<label className="form-check-label" htmlFor="ready1">Ready ?</label>
							</span>
							<button onClick={logoutLocal} type='button' className="btn btn-primary mt-3">Logout</button>
						</div> :
						<div className="d-flex flex-column align-items-center border border-black border-2 rounded p-5 bg-secondary">
							<form action="" className="d-flex flex-column align-items-center">
                			    <div className="mb-2">
                			        <label htmlFor="logAddressLocal2" className="form-label">Username</label>
                			        <input onChange={typing} data-player='player2' name="login" type="text" className={"form-control ".concat(emptyLogin2 ? 'border border-3 border-danger' : '')} id="logAddressLocal2" />
                			    </div>
                			    <div className="mb-3">
                			        <label htmlFor="logPasswordLocal2" className="form-label">Password</label>
                			        <input onChange={typing} data-player='player2' name="password" type="password" className={"form-control ".concat(emptyPW2 ? 'border border-3 border-danger' : '')} id="logPasswordLocal2" />
                			    </div>
                                <div className="text-danger-emphasis mt-2" hidden={wrongForm2}>Wrong address or password</div>
                			    <button onClick={loginLocal} data-player='player2' type="button" className="btn btn-info mb-2">Login</button>
                			</form>
							<span className="d-flex gap-2 mt-3">
								<input onChange={playerReady} className="form-check-input" data-player='player2' type="checkbox" name="guest2" id="guest2" />
								<label className="form-check-label" htmlFor="guest2">Play as a guest</label>
							</span>
						</div>
					}
				</div>
            </div>
            <div className="text-center mt-4">
                <button type="button" className="btn btn-warning" disabled={!start}>Let's rock !</button>
            </div>
			{/* <div className="mt-2 d-flex align-items-center justify-content-center gap-2">
				<img src="/images/exclamation-triangle.svg" alt="" />
				Playing local will have no incidence on your ELO rank
				<img src="/images/exclamation-triangle.svg" alt="" />
			</div> */}
        </>
	)
}

export function Remote({challengers, challenged, tournaments, game, setProfileId, setTournamentId}) {

    let style = {
        minHeight: '100px',
        maxHeight: '250px',
        width: '90%'
    }

    return <>
                <p className="fs-2 fw-bold text-center">So you wanna play {game} ?</p>
                <hr className="mx-5" />
                <span className="ms-2" hidden={challengers.length === 0 && challenged.length === 0}>Tip : Click on an avatar to see the player's profile</span>
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">You've been challenged by</p>
                {challengers !== 'none' ?
                    <Challengers challengers={challengers} setProfileId={setProfileId} style={style} /> :
                    <div className="d-flex rounded border border-black align-items-center justify-content-center fw-bold" style={style}>Nobody's here. That's kinda sad...</div> 
                }
                <hr className="mx-5" />
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">You challenged</p>
                {challenged !== 'none' ?
                    <Challenged challenged={challenged} setProfileId={setProfileId} style={style} /> :
                    <div className="d-flex rounded border border-black align-items-center justify-content-center fw-bold" style={style}>Don't be shy. Other people want to play too</div> 
                }
                <hr className="mx-5" />
                <p className="fs-4 text-decoration-underline fw-bold text-danger-emphasis ms-2">You're a contender in</p>
                {tournaments !== 'none' ?
                    <MyTournaments tournaments={tournaments} setTournamentId={setTournamentId} style={style} /> :
                    <div className="d-flex rounded border border-black align-items-center justify-content-center fw-bold" style={style}>What are you doing !? Go and conquer the world !</div> 
                }
            </>
}

function Challengers({challengers, setProfileId, style}) {

	const addClick = (e) => {
		setProfileId(e.target.dataset.player)
		displayNewWindow("Profile")
	}

	return (
		<ul className="list-group overflow-auto noScrollBar" style={style}>
			{challengers.map((player) => 
			<li className="list-group-item d-flex" key={player.id}>
				<div onClick={addClick} data-player={player.id} className="d-flex align-items-center" style={{width: '50px', height: '50px'}}>
					<img data-player={player.id} className="rounded-circle profileLink" title='See profile' src={"/images/".concat(player.avatar)} alt="" style={{width: '45px', height: '45px'}} />
				</div>
				<div className="d-flex justify-content-between align-items-center fw-bold ms-2 flex-grow-1">
					{player.name} {player.playing ? '(In a match)' : '(Available)'}
					<div>
						<button type='button' className="btn btn-success me-3" disabled={player.playing}>{player.playing ? 'Please Wait' : 'Direct message'}</button>
						<button type='button' className="btn btn-danger">Dismiss challenge</button>
					</div>
				</div>
			</li>)}
		</ul>
	)
}

function Challenged({challenged, setProfileId, style}) {

	const addClick = (e) => {
		setProfileId(e.target.dataset.player)
		displayNewWindow("Profile")
	}

	return (
		<ul className="list-group overflow-auto noScrollBar" style={style}>
			{challenged.map((player) => 
			<li className="list-group-item d-flex" key={player.id}>
				<div onClick={addClick} data-player={player.id} className="d-flex align-items-center" style={{width: '50px', height: '50px'}}>
					<img data-player={player.id} className="rounded-circle profileLink" title='See profile' src={"/images/".concat(player.avatar)} alt="" style={{width: '45px', height: '45px'}} />
				</div>
				<div className="d-flex justify-content-between align-items-center fw-bold ms-2 flex-grow-1">
					<span>{player.name} <span className={'fw-bold text-capitalize '.concat(player.status === 'online' ? 'text-success' : 'text-danger')}>({player.status})</span></span>
					<div>
						<button type='button' className="btn btn-success me-3" hidden={player.status === 'offline'}>Direct message</button>
						<button type='button' className="btn btn-danger">Dismiss challenge</button>
					</div>
				</div>
			</li>)}
		</ul>
	)

}

function MyTournaments({tournaments, setTournamentId, style}) {

	const addClick = (e) => {
		setTournamentId(e.target.dataset.tournament)
		// displaySpecificTournament()
	}

	return (
		<ul className="list-group overflow-auto noScrollBar" style={style}>
			{tournaments.map((tournament) => 
			<li className="list-group-item d-flex" key={tournament.id}>
				<div className="d-flex align-items-center" style={{width: '50px', height: '50px'}}>
					<img className="rounded-circle" title='See profile' src={"/images/".concat(tournament.picture)} alt="" style={{width: '45px', height: '45px'}} />
				</div>
				<div className="d-flex justify-content-between align-items-center fw-bold ms-2 flex-grow-1">
					{tournament.title}
					<div><button onClick={addClick} data-tournament={tournament.id} type='button' className="btn btn-secondary">See tournament's page</button></div>
				</div>
			</li>)}
		</ul>
	)
}