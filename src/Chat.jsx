import React from 'react'

function Chat({ myProfile, setProfileId }) {

	let title = myProfile !== 'none' ? '' : 'You need to be logged in to use the chat'

    return (
        <div className="mh-100 bg-dark-subtle d-flex flex-column" style={{width: '300px'}}>
            <div className="d-flex justify-content-center py-2">
                <h5 className="my-0"><i>#</i> <ChanName /></h5>
            </div>
            <hr className="mx-5 mt-0 mb-2" />
            <div className="w-100 px-2 d-flex flex-column justify-content-end overflow-y-auto flex-grow-1">
                <ChatContent setprofileId={setProfileId} />
            </div>
            <hr className="mx-5 mt-2 mb-2" />
            <div className="w-100 ps-4 pe-5 pb-3 pt-2 align-self-end">
                <div className="d-flex pt-1 row ps-1">
                    <div className="input-group p-0 m-0">
                        <span className="pt-1 pe-2 m-0 border-0" id="basic-addon1"><img src="/images/wechat.svg" alt="" /></span>
                        <input type="text" name="chatPrompt" id="chatPrompt" title={title} className="form-control border-0" placeholder="Say something nice..." aria-label="Username" aria-describedby="basic-addon1" disabled={myProfile === 'none'} />
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