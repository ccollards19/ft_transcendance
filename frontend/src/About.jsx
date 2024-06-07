export default function About({props}) {

	return (
        <div style={props.customwindow} className='noScrollBar'>
            <h1 className="text-center">{props.language.aboutTitle}</h1>
            <hr className="mx-5" />
            <p className="mx-5 text-center">
				{props.language.about1}
            </p>
            <p className="mx-5 text-center">
				{props.language.about2}
            </p>
            <p className="mx-5 text-center mb-4">
				{props.language.about3}
            </p>
            <ul className="aboutList text-center p-0">
                <li className="mb-2"><i>{props.language.module1}</i></li>
                <li className="mb-2"><i>{props.language.module2}</i></li>
                <li className="mb-2"><i>{props.language.module3}</i></li>
                <li className="mb-2"><i>{props.language.module4}</i></li>
                <li className="mb-2"><i>{props.language.module5}</i></li>
                <li className="mb-2"><i>{props.language.module6}</i></li>
                <li className="mb-2"><i>{props.language.module7}</i></li>
                <li className="mb-2"><i>{props.language.module8}</i></li>
                <li className="mb-2"><i>{props.language.module9}</i></li>
                <li className="mb-2"><i>{props.language.module10}</i></li>
                <li className="mb-2"><i>{props.language.module11}</i></li>
            </ul>
            <hr className="mx-5" />
            <h3 className="mx-5 text-center mb-4">
				{props.language.about4}
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
				{props.language.question1}
			</p>
			<p className="mx-5 text-center">
				<strong>
					{props.language.answer1_1}
					<br/>
					{props.language.answer1_2}
				</strong>
			</p>
			<p className="mx-5 text-center">
				{props.language.question2}
			</p>
			<p className="mx-5 text-center">
				<strong>
					{props.language.answer2}
				</strong>
			</p>
			<p className="mx-5 text-center">
				{props.language.question3}
			</p>
			<p className="mx-5 text-center">
				<strong>
					{props.language.answer3}
				</strong>
			</p>
			<p className="mx-5 text-center">
				{props.language.question4}
			</p>
			<p className="mx-5 text-center">
				<strong>
					{props.language.answer4}
				</strong>
			</p>
			<p className="mx-5 text-center">
				{props.language.question5}
			</p>
			<p className="mx-5 text-center">
				<strong>
					{props.language.answer5}
				</strong>
			</p>
			<p className="mx-5 text-center">
				{props.language.question6}
			</p>
			<p className="mx-5 text-center">
				<strong>
					{props.language.answer6}
				</strong>
			</p>
        </div>
    )
}

