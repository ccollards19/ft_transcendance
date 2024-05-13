import { useEffect } from "react"

export default function About({props}) {

	props.socket.send(JSON.stringify({
		component : 'about',
		action : undefined,
		item : undefined
	}))
	useEffect(() => {
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data.item)
			else if (data.action === 'chat')
				props.socket.onChat(data)
		}
	}, [props.socket, props.socket.onmessage])	

    return (
        <div style={props.customwindow} className='noScrollBar'>
            <h1 className="text-center">{props.languages[props.settings.language].aboutTitle}</h1>
            <hr className="mx-5" />
            <p className="mx-5 text-center">
				{props.languages[props.settings.language].about1}
            </p>
            <p className="mx-5 text-center">
				{props.languages[props.settings.language].about2}
            </p>
            <p className="mx-5 text-center mb-4">
				{props.languages[props.settings.language].about3}
            </p>
            <ul className="aboutList text-center p-0">
                <li className="mb-2"><i>{props.languages[props.settings.language].module1}</i></li>
                <li className="mb-2"><i>{props.languages[props.settings.language].module2}</i></li>
                <li className="mb-2"><i>{props.languages[props.settings.language].module3}</i></li>
                <li className="mb-2"><i>{props.languages[props.settings.language].module4}</i></li>
                <li className="mb-2"><i>{props.languages[props.settings.language].module5}</i></li>
                <li className="mb-2"><i>{props.languages[props.settings.language].module6}</i></li>
                <li className="mb-2"><i>{props.languages[props.settings.language].module7}</i></li>
                <li className="mb-2"><i>{props.languages[props.settings.language].module8}</i></li>
                <li className="mb-2"><i>{props.languages[props.settings.language].module9}</i></li>
                <li className="mb-2"><i>{props.languages[props.settings.language].module10}</i></li>
                <li className="mb-2"><i>{props.languages[props.settings.language].module11}</i></li>
            </ul>
            <hr className="mx-5" />
            <h3 className="mx-5 text-center mb-4">
				{props.languages[props.settings.language].about4}
            </h3>
            <ul className="aboutList text-center p-0">
                <li className="mb-2">Karim Talbi</li>
                <li className="mb-2">Cyril Collard</li>
                <li className="mb-2">Nicolas Espana Ribera</li>
                <li className="mb-2">Gilles Poncelet</li>
            </ul>
			<hr className="mx-5" />
			<h3 className="mx-5 text-center mb-4">
                F.A.Q.
            </h3>
			<p className="mx-5 text-center">
				{props.languages[props.settings.language].question1}
			</p>
			<p className="mx-5 text-center">
				<strong>
					{props.languages[props.settings.language].answer1_1}
					<br/>
					{props.languages[props.settings.language].answer1_2}
				</strong>
			</p>
			<p className="mx-5 text-center">
				{props.languages[props.settings.language].question2}
			</p>
			<p className="mx-5 text-center">
				<strong>
					{props.languages[props.settings.language].answer2}
				</strong>
			</p>
			<p className="mx-5 text-center">
				{props.languages[props.settings.language].question3}
			</p>
			<p className="mx-5 text-center">
				<strong>
					{props.languages[props.settings.language].answer3}
				</strong>
			</p>
			<p className="mx-5 text-center">
				{props.languages[props.settings.language].question4}
			</p>
			<p className="mx-5 text-center">
				<strong>
					{props.languages[props.settings.language].answer4}
				</strong>
			</p>
			<p className="mx-5 text-center">
				{props.languages[props.settings.language].question5}
			</p>
			<p className="mx-5 text-center">
				<strong>
					{props.languages[props.settings.language].answer5}
				</strong>
			</p>
			<p className="mx-5 text-center">
				{props.languages[props.settings.language].question6}
			</p>
			<p className="mx-5 text-center">
				<strong>
					{props.languages[props.settings.language].answer6}
				</strong>
			</p>
        </div>
    )
}

