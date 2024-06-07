import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getLanguage } from './trad.js'

export default function Settings({props}) {

    const [change, setChange] = useState(false)

	const navigate = useNavigate()

	useEffect(() => {
		if (!props.myProfile)
			navigate('/')
	}, [navigate])

    const validateChanges = () => {
        let form = {
			game : document.getElementById('game').value,
			scope : document.getElementById('remote').checked ? 'remote' : 'local',
			spectate : document.getElementById('spectate').checked,
			challengeable : document.getElementById('challengeable').checked,
            language : document.getElementById('language').value
		}
		props.setSettings(form)
        fetch('/profiles/updateSettings/', {method : 'POST', body : JSON.stringify(form)})
        props.setLanguage(getLanguage(form.language))
        setChange(false)
        if (!form.challengeable)
            props.socket.send(JSON.stringify({action : 'notChallengeable', item : {}}))
    }

    const checkChanges = e => {
        if (e.target.name === 'game' && e.target.value !== props.settings.game)
            setChange(true)
        else if (e.target.name === 'scope' && e.target.value !== props.settings.scope)
            setChange(true)
        else if (e.target.name === 'challengeable' && e.target.value !== props.settings.challengeable)
            setChange(true)
        else if (e.target.name === 'spectate' && e.target.value !== props.settings.spectate)
            setChange(true)
        else
            setChange(false)
    }

    const deleteAccount = () => {
        if (window.confirm(props.language.delete1)) {
            if (window.confirm(props.language.delete2)) {
                props.socket.close()
                fetch('/authenticate/resign/', {method : 'DELETE'}).then(response => {
                    if (response.status === 204) {
                        props.setSocket(new WebSocket('ws://localhost/ws/'))
                        window.alert(props.language.deleted)
                        navigate('/')
                    }
                })
            }
        }
    }

    return (
        <div className="d-flex flex-column align-items-center" style={props.customwindow}>
            <form className={`${props.md ? 'w-50' : 'w-100'} p-2 border border-3 border-black rounded bg-secondary d-flex flex-grow-1 flex-column justify-content-center align-items-center text-dark`}>
                <h2 className="text-center pt-2 fs-3 fw-bold">{props.language.menu3}</h2>
                <label htmlFor="game" className="form-label ps-2 pt-3">{props.language.defaultLanguage}</label>
                <select onChange={checkChanges} name="game" id="language" className="form-select w-50" defaultValue={props.settings.language}>
                    <option id='en' value="en">{props.language.english}</option>
                    <option id='fr' value="fr">{props.language.french}</option>
                    <option id='de' value="de">{props.language.german}</option>
                </select>
                <label htmlFor="game" className="form-label ps-2 pt-3">{props.language.whatGame}</label>
                <select onChange={checkChanges} name="game" id="game" className="form-select w-50" defaultValue={props.settings.game}>
                    <option id='pong' value="pong">Pong</option>
                    <option id='chess' value="chess">{props.language.chess}</option>
                </select>
                <span className="form-text">{props.language.gameAffect}</span>
                <div onChange={checkChanges} name='scope' className="w-100 pt-4 d-flex justify-content-center gap-2">
                    <div className="w-50 form-check form-check-reverse d-flex justify-content-end">
                        <label className="form-check-label pe-2" htmlFor="remote">{props.language.online}
                            <input className="form-check-input" type="radio" name="scope" value='remote' id="remote" defaultChecked={props.settings.scope === 'remote'} />
                        </label>
                    </div>
                    <div className="w-50 form-check d-flex justify-content-start">
                        <label className="form-check-label ps-2" htmlFor="local">{props.language.local}
                            <input className="form-check-input" type="radio" name="scope" value='local' id="local" defaultChecked={props.settings.scope === 'local'} />
                        </label>
                    </div>
                </div>
                <div className="w-25 pt-4 d-flex justify-content-center">
                    <div className="form-check">
                      <input onChange={checkChanges} className="form-check-input" type="checkbox" name="challengeable" id="challengeable" defaultChecked={props.settings.challengeable} />
                      <label className="form-check-label" htmlFor="challengeable">{props.language.challengeable}</label>
                    </div>
                </div>
                <div className="form-check py-3">
                    <input onChange={checkChanges} className="form-check-input" type="checkbox" name="spectate" id="spectate" defaultChecked={props.settings.spectate} />
                    <label className="form-check-label" htmlFor="spectator">{props.language.spectate}</label>
                </div>
                <button id='validate' onClick={validateChanges} type="button" className="btn btn-primary" disabled={!change}>{props.language.saveChange}</button>
                <button id='delete' onClick={deleteAccount} type="button" className="btn btn-danger mt-3">{props.language.resign}</button>
            </form>
        </div>
    )
}

