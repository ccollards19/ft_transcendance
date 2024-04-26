import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Login({props}) {

  const navigate = useNavigate()

  useEffect(() => {
    if (props.myProfile)
      navigate('/')
    if (props.socket.page !== 'login' && props.socket.readyState === 1) {
      props.socket.send(JSON.stringify({
        component : 'login',
        action : '',
        item : undefined
      }))
      props.socket.page = 'login'
    }
    props.socket.onmessage = e => {
      let data = JSON.parse(e.data)
      if (data.action === 'myProfile')
        props.socket.onMyProfile(data)
      else if (data.action === 'chat')
        props.socket.onChat(data)
    }
  }, [props.socket, props.socket.page, props.socket.readyState, props.socket.onmessage, props.myProfile, navigate])

  const checkForms = () => {
    let issue = true
    let forms = ['nameInput', 'PWInput']
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
      username : document.getElementById('nameInput').value,
      password : document.getElementById('PWInput').value
    }
    xhr.open('POST', "/authenticate/sign_in/")
    xhr.onload = () => {
      if (xhr.status === 200) {
        props.socket.close()
        props.request.log = true
        // navigate("/Profile/"+JSON.parse(xhr.response).id)
        navigate("/")
      }
      else {
        document.getElementById('wrongForm').hidden = false
      }
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
            <label htmlFor="nameInput" className="form-label">E-mail or username</label>
            <input id='nameInput' onKeyDown={typing} name="name" type="text" className='form-control' />
          </div>
          <div className="mb-3">
            <label htmlFor="PWInput" className="form-label">Password</label>
            <input id='PWInput' onKeyDown={typing} name="password" type="password" className="form-control" />
          </div>
          <div id='wrongForm' className="text-danger-emphasis my-2" hidden>Wrong address or password</div>
          <button onClick={login} type="button" className="btn btn-info mb-2">Login</button>
        </form>
        <p className="fw-bold px-2 text-center">If you don't have an account, you may <button onClick={() => navigate('/subscribe')} className="nav-link d-inline text-info text-decoration-underline" data-link='Subscribe'>subscribe here</button></p>
        <p className="fw-bold">You may also use your 42 account</p>
        <button className="nav-link"><img src="/images/42_logo.png" alt="" className="border border-black px-3" /></button>
      </div>
    </div>
  )
}

