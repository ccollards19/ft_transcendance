import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


export default function Settings({props}) {

	const navigate = useNavigate()

	useEffect(() => {
		if (!props.myProfile)
			navigate('/')
	})

	if (props.socket.page !== 'settings' && props.socket.readyState === 1) {
		props.socket.page = 'settings'
		props.socket.send(JSON.stringify({component : 'settings'}))
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
		}
	}

    const validateChanges = () => {
		props.setSettings({
			game : document.getElementById('game').value,
			scope : document.getElementById('remote').checked ? 'remote' : 'local',
			challengeable : document.getElementById('challengeable').checked,
			spectate : document.getElementById('spectate').checked
		})
    }

    return (
        <div className="d-flex flex-column align-items-center" style={props.customwindow}>
            <form className={`${props.md ? 'w-50' : 'w-100'} p-2 border border-3 border-black rounded bg-secondary d-flex flex-grow-1 flex-column justify-content-center align-items-center text-dark`}>
                <h2 className="text-center pt-2 fs-3 fw-bold">Settings</h2>
                <label htmlFor="game" className="form-label ps-2 pt-3">What game do you wish to play today ?</label>
                <select name="game" id="game" className="form-select w-50" defaultValue={props.settings.game}>
                    <option id='pong' value="pong">Pong</option>
                    <option id='chess' value="chess">Chess</option>
                </select>
                <span className="form-text">This will affect the display on some parts of the website</span>
                <div className="w-100 pt-4 d-flex justify-content-center gap-2">
                    <div className="w-50 form-check form-check-reverse d-flex justify-content-end">
                        <label className="form-check-label pe-2" htmlFor="remote">Remote
                            <input className="form-check-input" type="radio" name="scope" value='remote' id="remote" defaultChecked={props.settings.scope === 'remote'} />
                        </label>
                    </div>
                    <div className="w-50 form-check d-flex justify-content-start">
                        <label className="form-check-label ps-2" htmlFor="local">Local
                            <input className="form-check-input" type="radio" name="scope" value='local' id="local" defaultChecked={props.settings.scope === 'local'} />
                        </label>
                    </div>
                </div>
                <div className="w-25 pt-4 d-flex justify-content-center">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" name="challengeable" id="challengeable" defaultChecked={props.settings.challengeable} />
                      <label className="form-check-label" htmlFor="challengeable">Challengeable</label>
                    </div>
                </div>
                <div className="form-check py-3">
                    <input className="form-check-input" type="checkbox" name="spectate" id="spectate" defaultChecked={props.settings.spectate} />
                    <label className="form-check-label" htmlFor="spectator">Allow spectators</label>
                </div>
                <button id='validate' onClick={validateChanges} type="button" className="btn btn-primary">Save changes</button>
            </form>
        </div>
    )
}

