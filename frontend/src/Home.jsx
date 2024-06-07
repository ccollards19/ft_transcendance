import { Link } from "react-router-dom"

export default function Home({props}) {

	return (
        <div style={props.customwindow} className='noScrollBar'>
            <h1 className="text-center pt-2">{props.language.home1}</h1>
            <hr className="mx-5" />
            <h3 className="text-center mb-3">{props.language.home2}</h3>
            <h4 className="text-center">{props.language.home3}</h4>
            <p className="text-center mb-2">
                {props.language.home4} <Link to='/login' className={'nav-link d-inline '.concat(props.myProfile ? 'text-danger' : 'text-primary')}>{props.language.home5}</Link> {props.language.home6}
            </p>
            <p className="px-5 mt-2 text-center">
                {props.language.home7} <Link to='/subscribe' className={'nav-link d-inline '.concat(props.myProfile ? 'text-danger' : 'text-primary')}>{props.language.home8}</Link>.
            </p>
			<p className="px-5 mt-2 text-center">
                {props.language.home9}
			</p>
            <p className="text-center">
                {props.language.home10}
            </p>
            <p className="text-center">
                {props.language.home11}
            </p>
            <p className="text-center">
                {props.language.home12}
            </p>
            <p className="text-center">
                {props.language.home13}
            </p>
            <p className="text-center">
                {props.language.home14}
            </p>
            <p className="text-center">
                {props.language.home15}
            </p>
            <p className="text-center">
                {props.language.home16}
            </p>
            <p className="text-center">
                {props.language.home17}
            </p>
            <p className="text-center">
                {props.language.home18}
            </p>
			<p className="text-center">
                {props.language.home19}
			</p>
            <p className="text-center">
                {props.language.home20}
            </p>
            <p className="text-center">
                {props.language.home21}
            </p>
            <p className="text-center">
                {props.language.home22}
            </p>
            <p className="text-center">
                {props.language.home23}
            </p>
        </div>
    )
}
