import React from 'react'

function Chat({ props }) {

    const sendMessage = () => {
        let message = document.getElementById('chatPrompt') 
        console.log(message.value)
        // send(message.value, props.myProfile)
        message.value = ''
    }
    const captureKey = (e) => {
        if (e.keyCode === 13)
            sendMessage()
    }

	return (
        <div className={`h-100 ${props.xlg ? 'bg-dark-subtle' : 'bg-white'} d-flex flex-column`} style={{width: '300px'}}>
            <div className="d-flex justify-content-center py-2">
                <h5 className="my-0"><i>#</i> <ChanName /></h5>
            </div>
            <hr className="mx-5 mt-0 mb-2" />
            <div className="w-100 px-2 d-flex flex-column justify-content-end overflow-y-auto flex-grow-1">
                <ChatContent props={props} />
            </div>
            <hr className="mx-5 mt-2 mb-2" />
            <div className="w-100 ps-4 pe-5 pb-3 pt-2 align-self-end">
                <div className="d-flex gap-3 pt-1 row ps-3">
                    <div className="input-group p-0 m-0">
                        <span className="pt-1 me-2 m-0 border-0"><img src="/images/wechat.svg" alt="" /></span>
                        <input onKeyDown={captureKey} type="text" name="chatPrompt" id="chatPrompt" className={`form-control ${props.xlg ? 'border-0' : 'border-1 border-black'} rounded`} placeholder={props.myProfile !== 'none' ? 'Say something nice' : 'Log in to chat'} disabled={props.myProfile === 'none'} />
                        <button onClick={sendMessage} className="pt-1 ms-2 nav-link"><img src="/images/send.svg" alt="" /></button>
                      </div>                              
                </div>
            </div>
        </div>
    )
}

function ChatContent({ props }) {
    
}

function ChanName() {
    return 'Général'
}

export default Chat