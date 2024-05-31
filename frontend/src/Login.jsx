import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Login({props}) {

  const navigate = useNavigate()

  useEffect(() => {
    if (props.myProfile)
      navigate('/')
	}, [navigate, props.myProfile])

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
    if (checkForms()) {
      let logForm = {
        email : document.getElementById('mailInput').value,
        password : document.getElementById('PWInput').value
      }
      fetch('/authenticate/sign_in/', {
        method : 'POST',
        body : JSON.stringify(logForm)
      }).then(response => {
        if (response.status === 404)
          document.getElementById('wrongForm').hidden = false
        if (response.status === 200) {
          props.socket.close()
          let socket = new WebSocket('ws://localhost/ws/')
          socket.onopen = () => props.setChats(props.chats.map(chat => { return {...chat, messages : chat.messages.filter(message => message.type !== 'error')} }))
          socket.onmessage = e => {
            let data = JSON.parse(e.data)
            props.setMyProfile(data.item)
            props.setSocket(socket)
            navigate('/profile/' + data.item.id)
          }
        }
      })
    }
  }

  const typing = e => {
    document.getElementById(e.target.id).setAttribute('class', 'form-control')
    document.getElementById('wrongForm').hidden = true
    if (e.keyCode === 13) {
      e.preventDefault()
      login()
    }
  }

  return (
    <div className="d-flex flex-column align-items-center" style={props.customwindow}>
      <div className={`${props.md ? 'w-50' : 'w-100'} p-2 border border-3 border-black rounded bg-secondary d-flex flex-grow-1 flex-column justify-content-center align-items-center`}>
        <p className="fs-4 fw-bold">{props.language.login}</p>
        <form action="" className="d-flex flex-column align-items-center">
          <div className="mb-2">
            <label htmlFor="mailInput" className="form-label">E-mail</label>
            <input id='mailInput' onKeyDown={typing} name="name" type="text" className='form-control' />
          </div>
          <div className="mb-3">
            <label htmlFor="PWInput" className="form-label">{props.language.password}</label>
            <input id='PWInput' onKeyDown={typing} name="password" type="password" className="form-control" />
          </div>
          <div id='wrongForm' className="text-danger-emphasis my-2" hidden>{props.language.wrongForm}</div>
          <button onClick={login} type="button" className="btn btn-info mb-2">{props.language.log}</button>
        </form>
        <p className="fw-bold px-2 text-center">{props.language.sub1} <button onClick={() => navigate('/subscribe')} className="nav-link d-inline text-info text-decoration-underline" data-link='Subscribe'>{props.language.sub2}</button></p>
      </div>
    </div>
  )
}

