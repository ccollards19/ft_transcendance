import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Subscribe({props}) {

	const navigate = useNavigate()

	props.socket.send(JSON.stringify({
		component : 'subscribe',
		action : undefined,
		item : undefined
	  }))
	  useEffect(() => {
			if (props.myProfile)
			  	navigate('/')
			props.socket.onmessage = e => {
				let data = JSON.parse(e.data)
				if (data.action === 'myProfile')
					props.socket.onMyProfile(data)
				else if (data.action === 'chat')
					props.socket.onChat(data)
			}
		}, [props.socket, props.socket.onmessage, props.myProfile, navigate])

    const checkForms = () => {
		let issue = true
		let forms = ['subAddress', 'subName', 'subPassword', 'subPasswordConfirm']
		for (let form of forms) {
			let input = document.getElementById(form)
			if (input.value === '') {
				input.setAttribute('class', 'form-control border border-3 border-danger')
				issue = false
			}
		}
		return issue
    }

	const checkPW = () => {
		if (document.getElementById('subPassword').value !== document.getElementById('subPasswordConfirm').value) {
			document.getElementById('noMatch').hidden = false
			return false
		}
		return true
	}

    const subscribe = () => {
        if (checkForms() && checkPW()) {
			let newProfile = {
				address : document.getElementById('subAddress').value,
				username : document.getElementById('subName').value,
				password : document.getElementById('subPassword').value
			}
			let xhr = new XMLHttpRequest()
			xhr.open('POST', "/authenticate/sign_up/")
			xhr.onload = () => {
				let response = JSON.parse(xhr.response)
				if ('details' in response) {
					if (response.details === 'Username already taken')
						document.getElementById('existingName').hidden = false
					else if (response.details === 'Address already taken')
						document.getElementById('existingAddr').hidden = false
					else if (response.details === 'Wrong Address')
						document.getElementById('wrongAddr').hidden = false
				}
				else if (xhr.status === 201) {
					props.socket.close()
        			props.socket.log = true
				}
			}
			xhr.send(JSON.stringify(newProfile))
        }
    }

    const typing = e => {
		document.getElementById(e.target.id).setAttribute('class', 'form-control')
		document.getElementById('existingName').hidden = true
		document.getElementById('existingAddr').hidden = true
		document.getElementById('wrongAddr').hidden = true
		if (e.keyCode === 13) {
			e.preventDefault()
			subscribe()
		}
    }

    return (
    <div className="d-flex flex-column align-items-center" style={props.customwindow}>
        <div className={`${props.md ? 'w-50' : 'w-100'} p-2 border border-3 border-black rounded bg-secondary d-flex flex-grow-1 flex-column justify-content-center align-items-center`}>
            <p className="fs-4 fw-bold px-3 text-center">{props.language.welcome} !</p>
            <form action="" className="d-flex flex-column align-items-center">
                <div className="mb-1">
                    <label htmlFor="subAddress" className="form-label">E-mail</label>
                    <input onKeyDown={typing} name='address' type="email" className='form-control' id="subAddress" />
                    <div id='wrongAddr' className="text-danger-emphasis mt-2" hidden>{props.language.invalidAddr}</div>
                    <div id='existingAddr' className="text-danger-emphasis mt-2" hidden>{props.language.existingAddr}</div>
                    <label htmlFor="subName" className="form-label mt-2">{props.language.username}</label>
                    <input onKeyDown={typing} name='name' type="text" className='form-control' id="subName" />
                	<div id='existingName' className="text-danger-emphasis mb-2" hidden>{props.language.existingName}</div>
                </div>
                <div className="mb-2">
                    <label htmlFor="subPassword" className="form-label mt-2">{props.language.password}</label>
                    <input onKeyDown={typing} type="password" name='password' className='form-control' id="subPassword" />
                    <label htmlFor="subPasswordConfirm" className="form-label mt-2">{props.language.passwordConf}</label>
                    <input onKeyDown={typing} type="password" name='passwordConfirm' className='form-control' id="subPasswordConfirm" />
                    <div id='noMatch' className="text-danger-emphasis mt-2" hidden>{props.language.passwordDiff}</div>
                </div>
                <button onClick={subscribe} type="button" className="btn btn-info mt-2">{props.language.createAccount}</button>
            </form>
        </div>
    </div>)
}

