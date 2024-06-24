import './styles.css';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"

export function Timer() {
  const [counter, setCounter] = useState(60);

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  return (
    <div className="timer">{counter}</div>
  )
}

export function Score({ xScore, oScore }) {
  return (
    <div className="score">
      <div>X : {xScore} </div>
      <div>O : {oScore}</div>
    </div>
  )
}

export function Scorex({ xScore, isActive }) {
  return (
    <div className={`scorex ${isActive ? 'active' : ''}`}>
      <div>X : {xScore} </div>
    </div>
  )
}

export function Scoreo({ oScore, isActive }) {
  return (
    <div className={`scoreo ${isActive ? 'active' : ''}`}>
      <div>O : {oScore}</div>
    </div>
  )
}

export function Tile({ tile, onTileClick }) {
  return (
    <button className="tile" onClick={onTileClick}>{tile}</button>
  )
}

export default function TicTacToeRemote({props, socket, room}) {
	const player1 = props.myProfile && props.myProfile.id === room.player1.id
	const player2 = props.myProfile && props.myProfile.id === room.player2.id
  const [board, setBoard] = useState(Array(9).fill(null));
  const [myValue, setMyValue] = useState(null);
  const [playState, setPlayState] = useState(undefined);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
	const [init, setInit] = useState(false)
	
  const tag = "match_id" + room.id
	const chanName = room.player1.name + ' VS ' + room.player2.name
  
  const navigate = useNavigate()

  if (!playState) {
    (player2 || player1) ? setPlayState("start") : setPlayState("waiting")
  }

  const startGame = () => {
    if (socket)
		  socket.send(JSON.stringify({action : 'start', item : {}}))
  }
	
  const quitGame = () => {
		if (player1 || player2)
			props.setMyProfile({...props.myProfile, room : null, playing : false})
		props.setChats(props.chats.filter(chat => chat.tag !== tag))
		if (props.chanTag === tag) {
			props.setChanTag('chat_general')
			props.setChanName('general')
		}
		props.socket.send(JSON.stringify({action : 'leave_chat', item : {chat : tag}}))
    if (socket)
      socket.close()
    navigate("/")
  }
  
  useEffect(() => {
    return () => {
      if (player1 || player2)
        props.setMyProfile({...props.myProfile, room : null, playing : false})
      props.setChats(props.chats.filter(chat => chat.tag !== tag))
      if (props.chanTag === tag) {
        props.setChanTag('chat_general')
        props.setChanName('general')
      }
      props.socket.send(JSON.stringify({action : 'leave_chat', item : {chat : tag}}))
      if (socket)
        socket.close()
    }
	}, [])

  useEffect(() => {
		if (!init) {
			setInit(true)
			if (!props.chats.find(chat => chat.tag === tag)) {
				props.setChats([...props.chats, {tag : tag, name : chanName, autoScroll : true, messages : []}])
				props.setChanTag(tag)
				props.setChanName(chanName)
				props.socket.send(JSON.stringify({action : 'join_chat', item : {chat : tag}}))
			}
		}
		socket.onmessage = e => {
			let data = JSON.parse(e.data)
      console.log(data)
      if (data.action === 'update') {
        setOScore(data.oScore)
        setXScore(data.xScore)
        setBoard(data.board)
      }
      else if (data.action === 'turn')
        setMyValue(data.myValue)
      else if (playState !== data.action)
        setPlayState(data.action)
    }
      
    return () => {} 

	}, [init, socket])

  function handleClick(i) {
    if (board[i] !== null || myValue === null)
      return
    let newBoard = [...board]
    newBoard[i] = myValue
    socket.send(JSON.stringify({action:"update", board : newBoard}))
    setMyValue(null)
  }

  return (
    <>
    { playState === "start" && <>
      <button onClick={startGame} type='button' className='btn btn-success'>{props.language.Play} </button>
      <button onClick={quitGame} type='button' className='btn btn-danger'>{props.language.Quitt} </button>
    </>
    }
    { playState === "waiting" && <>
          <h1>Waiting</h1>
          <button onClick={quitGame} type='button' className='btn btn-danger give-up-button'>{props.language.Quitt} </button>
    </>
    }
    { playState === "watching" && <>
      <div className="game-container">
        <Scorex xScore={xScore}  isActive={myValue === "X"} />
        <div className="container">
          <h1>Tic Tac Toe</h1>
          <div className="board">
            <div className="row">
              <Tile tile={board[0]} onTileClick={() => handleClick(0)} />
              <Tile tile={board[1]} onTileClick={() => handleClick(1)} />
              <Tile tile={board[2]} onTileClick={() => handleClick(2)} />
            </div>
            <div className="row">
            <Tile tile={board[3]} onTileClick={() => handleClick(3)} />
            <Tile tile={board[4]} onTileClick={() => handleClick(4)} />
            <Tile tile={board[5]} onTileClick={() => handleClick(5)} />
            </div>
            <div className="row">
            <Tile tile={board[6]} onTileClick={() => handleClick(6)} />
            <Tile tile={board[7]} onTileClick={() => handleClick(7)} />
            <Tile tile={board[8]} onTileClick={() => handleClick(8)} />
            </div>
          </div>
          <button onClick={quitGame} type='button' className='btn btn-danger give-up-button'>{props.language.Quitt} </button>
        </div>
        <Scoreo oScore={oScore} isActive={myValue === "O"} />
      </div>
    </>
    }
    { playState === "playing" && <>
      <div className="game-container">
        <Scorex xScore={xScore}  isActive={myValue === "X"} />
        <div className="container">
          <h1>Tic Tac Toe</h1>
          <div className="board">
            <div className="row">
              <Tile tile={board[0]} onTileClick={() => handleClick(0)} />
              <Tile tile={board[1]} onTileClick={() => handleClick(1)} />
              <Tile tile={board[2]} onTileClick={() => handleClick(2)} />
            </div>
            <div className="row">
            <Tile tile={board[3]} onTileClick={() => handleClick(3)} />
            <Tile tile={board[4]} onTileClick={() => handleClick(4)} />
            <Tile tile={board[5]} onTileClick={() => handleClick(5)} />
            </div>
            <div className="row">
            <Tile tile={board[6]} onTileClick={() => handleClick(6)} />
            <Tile tile={board[7]} onTileClick={() => handleClick(7)} />
            <Tile tile={board[8]} onTileClick={() => handleClick(8)} />
            </div>
          </div>
          <button onClick={quitGame} type='button' className='btn btn-danger give-up-button'>{props.language.giveup}</button>
        </div>
        <Scoreo oScore={oScore} isActive={myValue === "O"} />
      </div>
    </>
    }
    { playState === "finished" && <>
      <button onClick={quitGame} type='button' className='btn btn-danger'>{props.language.Quitt} </button>
    </>
    }
  </>
  )
}
