import { useEffect } from "react"

export default function NoPage({props}) {

	useEffect(() => {
		if (props.socket.page !== 'noPage' && props.socket.readyState === 1) {
			props.socket.send(JSON.stringify({component : 'noPage'}))
			props.socket.page = 'noPage'
		}
		props.socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'myProfile')
				props.socket.onMyProfile(data)
			else if (data.action === 'chat')
				props.socket.onChat(data)
		}
	})

	return (
		<div className="d-flex justify-content-center align-items-center fw-bold fs-1" style={props.customwindow}>This page does not exist. Please check url and try again</div>
	)

}

