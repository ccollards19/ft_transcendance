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

export function TicTacToeRemote({props, socket, room}) {
	const player1 = props.myProfile && props.myProfile.id === room.player1.id
	const player2 = props.myProfile && props.myProfile.id === room.player2.id
  const [board, setBoard] = useState(Array(9).fill(null));
  const [myValue, setMyValue] = useState(null);
  const [playState, setPlayState] = (player1 || player2) ? useState("start") : useState("waiting");
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  
  const navigate = useNavigate()

  const startGame = () => {
    if (socket)
		  socket.send(JSON.stringify({action : 'start', item : {}}))
  }

  const giveUp = () => {
    if (socket)
		  socket.send(JSON.stringify({action : 'giveUp', item : {}}))
  }

  const quitGame = () => {
    if (socket && playState !== "finished") {
      socket.close()
    }
    props.setMyProfile({...props.myProfile, room : undefined, playing : false})
    navigate("/")
    console.log("quit")
  }

  useEffect(() => {
		socket.onmessage = e => {
			let data = JSON.parse(e.data)
      if (playState !== data.action)
        setPlayState(data.action)
			if (data.action === 'playing') {
        setMyValue(data.value)
        setMyTurn(data.myTurn)
        setOScore(data.oScore)
        setXScore(data.xScore)
        setBoard(data.board)
      }
			else if (data.action === 'watching') {
        setOScore(data.oScore)
        setXScore(data.xScore)
        setBoard(data.board)
      }
    }
      
    return () => {} 

  }, [socket])

  function handleClick(i) {
    if (board[i] !== null || myValue === null)
      return
    let newBoard = [...board]
    newBoard[i] = myValue
    socket.send(JSON.stringify({action:"update", board : newBoard}))
    setBoard(newBoard)
  }

  return (
    <>
    { playState === "start" && <>
      <button onClick={startGame} type='button' className='btn btn-success'>play</button>
      <button onClick={quitGame} type='button' className='btn btn-danger'>Quit</button>
    </>
    }
    { playState === "waiting" && <>
          <h1>Waiting</h1>
          <button onClick={quitGame} type='button' className='btn btn-danger give-up-button'>Leave</button>
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
          <button onClick={quitGame} type='button' className='btn btn-danger give-up-button'>Leave</button>
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
          <button onClick={giveUp} type='button' className='btn btn-danger give-up-button'>Give up</button>
        </div>
        <Scoreo oScore={oScore} isActive={myValue === "O"} />
      </div>
    </>
    }
    { playState === "endRound" && <>
      <button onClick={startGame} type='button' className='btn btn-success'>Replay</button>
      <button onClick={quitGame} type='button' className='btn btn-danger'>Quit</button>
    </>
    }
    { playState === "finished" && <>
      <button onClick={quitGame} type='button' className='btn btn-danger'>Quit</button>
    </>
    }
  </>
  )
}
