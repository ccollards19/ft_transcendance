import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Login({props}) {

  const navigate = useNavigate()

  props.socket.send(JSON.stringify({
    component : 'login',
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
    let forms = ['mailInput', 'PWInput']
    for (let form of forms) {
      let input = document.getElementById(form)
      if (input.value === '') {
        input.setAttribute('class', 'form-control border border-3 border-danger')
        issue = false
      }
    }
    return issue
  }

  const login = () => {
    if (!checkForms())
      return ;
    let xhr = new XMLHttpRequest()
    xhr.logForm = {
      username : document.getElementById('mailInput').value,
      password : document.getElementById('PWInput').value
    }
    xhr.open('POST', "/authenticate/sign_in/")
    xhr.onload = () => {
      if (xhr.status === 200) {
        props.socket.close()
        props.request.log = true
      }
      else
        document.getElementById('wrongForm').hidden = false
    }
    xhr.send(JSON.stringify(xhr.logForm))
  }

  const typing = e => {
    document.getElementById(e.target.id).setAttribute('class', 'form-control')
    document.getElementById('wrongForm').hidden = true
    if (e.keyCode === 13)
      login()
  }

  return (
    <div className="d-flex flex-column align-items-center" style={props.customwindow}>
      <div className={`${props.md ? 'w-50' : 'w-100'} p-2 border border-3 border-black rounded bg-secondary d-flex flex-grow-1 flex-column justify-content-center align-items-center`}>
        <p className="fs-4 fw-bold">Please login</p>
        <form action="" className="d-flex flex-column align-items-center">
          <div className="mb-2">
            <label htmlFor="mailInput" className="form-label">E-mail</label>
            <input id='mailInput' onKeyDown={typing} name="name" type="text" className='form-control' />
          </div>
          <div className="mb-3">
            <label htmlFor="PWInput" className="form-label">Password</label>
            <input id='PWInput' onKeyDown={typing} name="password" type="password" className="form-control" />
          </div>
          <div id='wrongForm' className="text-danger-emphasis my-2" hidden>Wrong address or password</div>
          <button onClick={login} type="button" className="btn btn-info mb-2">Login</button>
        </form>
        <p className="fw-bold px-2 text-center">If you don't have an account, you may <button onClick={() => navigate('/subscribe')} className="nav-link d-inline text-info text-decoration-underline" data-link='Subscribe'>subscribe here</button></p>
      </div>
    </div>
  )
}

