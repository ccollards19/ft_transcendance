import { Local, Remote } from "./other.jsx"

export default function Play({props}) {

    return (
		<div style={props.customwindow}>
			{props.myProfile && props.settings.scope === 'remote' ?
				<Remote props={props} /> :
				<Local props={props} />
			}
		</div>
	)
}

