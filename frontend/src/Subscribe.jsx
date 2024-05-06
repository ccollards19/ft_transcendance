import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Subscribe({props}) {

	const navigate = useNavigate()

	useEffect(() => {
		if (props.myProfile)
			navigate('/')
		if (props.socket.page !== 'subscribe' && props.socket.readyState === 1) {
			props.socket.send(JSON.stringify({
				component : 'subscribe',
				action : undefined,
				item : undefined
			}))
			props.socket.page = 'subscribe'
		}
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
		}
	}, [navigate, props.socket, props.socket.page, props.socket.onmessage, props.myProfile])

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
					if (response.details === 'Username or adress already taken')
						document.getElementById('existing').hidden = false
					else if (response.details === 'Wrong Address')
						document.getElementById('wrongAddr').hidden = false
				}
				else if (xhr.status === 201) {
					props.socket.close()
        			props.request.log = true
				}
			}
			xhr.send(JSON.stringify(newProfile))
        }
    }

    const typing = (e) => {
		document.getElementById(e.target.id).setAttribute('class', 'form-control')
		document.getElementById('existing').hidden = true
		document.getElementById('wrongAddr').hidden = true
		if (e.keyCode === 13)
			subscribe()
    }

    return (
    <div className="d-flex flex-column align-items-center" style={props.customwindow}>
        <div className={`${props.md ? 'w-50' : 'w-100'} p-2 border border-3 border-black rounded bg-secondary d-flex flex-grow-1 flex-column justify-content-center align-items-center`}>
            <p className="fs-4 fw-bold px-3 text-center">Welcome to ft_transcendence !</p>
            <form action="" className="d-flex flex-column align-items-center">
                <div className="mb-1">
                    <label htmlFor="subAddress" className="form-label">E-mail Address:</label>
                    <input onKeyDown={typing} name='address' type="email" className='form-control' id="subAddress" />
                    <div id='wrongAddr' className="text-danger-emphasis mt-2" hidden>Invalid address</div>
                    <label htmlFor="subName" className="form-label">Username:</label>
                    <input onKeyDown={typing} name='name' type="text" className='form-control' id="subName" />
                </div>
                <div className="mb-2">
                    <label htmlFor="subPassword" className="form-label">Password:</label>
                    <input onKeyDown={typing} type="password" name='password' className='form-control' id="subPassword" />
                    <label htmlFor="subPasswordConfirm" className="form-label">Password confirmation:</label>
                    <input onKeyDown={typing} type="password" name='passwordConfirm' className='form-control' id="subPasswordConfirm" />
                    <div id='noMatch' className="text-danger-emphasis mt-2" hidden>The passwords do not match</div>
                </div>
                <div id='existing' className="text-danger-emphasis mb-2" hidden>Username or adress already taken</div>
                <button onClick={subscribe} type="button" className="btn btn-info mt-2">Create account</button>
            </form>
        </div>
    </div>)
}

