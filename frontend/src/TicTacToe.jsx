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

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  const [playState, setPlayState] = useState("start");
  const navigate = useNavigate()

  const startGame = () => {
    setBoard(Array(9).fill(null))
    setPlayState("playing")
  }

  const giveUp = () => {
    if (isX)
      setOScore(oScore + 1);
    else
      setXScore(xScore + 1);
    setPlayState("endRound")
  }

  const quitGame = () => {
    navigate("/")
  }

  function handleClick(i) {
    if (board[i] !== null) return;
    const newBoard = [...board];
    newBoard[i] = isX ? 'X' : 'O';
    setBoard(newBoard);
    setIsX(!isX);
    let winner = checkWin(newBoard);
    if (winner === "X") {
      setXScore(xScore + 1);
      setPlayState("endRound")
    }
    else if (winner === "O") {
      setOScore(oScore + 1);
      setPlayState("endRound")
    }
    else if (!(newBoard.includes(null)))
      setPlayState("endRound")
  }

  function checkWin(board) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }


  return (
    <>
    { playState === "start" && <>
      <button onClick={startGame} type='button' className='btn btn-success'>play</button>
      <button onClick={quitGame} type='button' className='btn btn-danger'>Quit</button>
    </>
    }
    { playState === "playing" && <>
    <div className="game-container">
      <Scorex xScore={xScore}  isActive={isX} />
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
      <Scoreo oScore={oScore} isActive={!isX} />
    </div>
</>
  }
    { playState === "endRound" && <>
        <button onClick={startGame} type='button' className='btn btn-success'>Replay</button>
        <button onClick={quitGame} type='button' className='btn btn-danger'>Quit</button>
      </>
    }
    </>
  )
}

export function TicTacToeRemote({props, socket, room}) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [myTurn, setMyTurn] = useState(false);
  const [myValue, setMyValue] = useState(null);
  const [playState, setPlayState] = useState("start");
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);
  
  const navigate = useNavigate()
	const player1 = props.myProfile && props.myProfile.id === room.player1.id
	const player2 = props.myProfile && props.myProfile.id === room.player2.id
  
  const startGame = () => {
    if (socket)
		  socket.send(JSON.stringify({action : 'start', item : {}}))
  }

  const giveUp = () => {
    if (socket)
		  socket.send(JSON.stringify({action : 'giveUp', item : {}}))
  }

  const replay = () => {
    if (socket)
		  socket.send(JSON.stringify({action : 'replay', item : {}}))
    setPlayState("play")
  }

  const quitGame = () => {
    if (socket && playState !== "finished") {
		  socket.send(JSON.stringify({action : 'quit', item : {}}))
      socket.close()
    }
    props.setMyProfile({...props.myProfile, room : undefined, playing : false})
    navigate("/")
    console.log("quit")
  }

  useEffect(() => {
		socket.onmessage = e => {
			let data = JSON.parse(e.data)
			if (data.action === 'update')
        setBoard(data.board)
			else if (data.action === 'init') {
        setMyValue(data.value)
        setMyValue(data.myturn)
        setBoard(data.board)
      }
			else if (data.action === 'win') {
        // setScore
      }
			else if (data.action === 'giveUp') {}
			else if (data.action === 'quit') {} 
    }
      
    return () => {} 

  }, [socket])

  function handleClick(i) {
    if (!myTurn || board[i] !== null)
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
    { playState === "playing" && <>
        <button onClick={giveUp} type='button' className='btn btn-danger'>Give up</button>
        <div className="container">
      <h1>Tic Tac Toe</h1>
      <Score xScore={xScore} oScore={oScore} />
      <div className="flex col">
        <Timer />
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
      </div>
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
    { playState === "paused" && <>
        <div className="container">Paused</div>
      </>
    }
    </>
  )
}
