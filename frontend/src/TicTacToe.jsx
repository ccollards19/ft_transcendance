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
  const [playState, setPlayState] = useState("waiting");

  const startGame = () => {
    setBoard(Array(9).fill(null))
    setPlayState("playing")
  }

  const giveUp = () => {
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
    winner = checkWin(board);
    if (winner === "X") {
      setXScore(xScore + 1);
      setPlayState("endRound")
    }
    else if (winner === "O") {
      setOScore(oScore + 1);
      setPlayState("endRound")
    }
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
    <div>
    { playState === "start" && <>
      <button onClick={startGame} type='button' className='btn btn-success'>play</button>
      <button onClick={quitGame} type='button' className='btn btn-danger'>Quit</button>
    </>
    }
    { playState === "play" && <>
        <button onClick={giveUp} type='button' className='btn btn-danger'>Give up</button>
        <div className="container">
      	  <h1>Tic Tac Toe</h1>
          <div className="flex col">
            <Timer></Timer>
            <Score xScore={xScore} oScore={oScore} />
            <div className="row-mt">
              <Tile tile={board[0]} onTileClick={() => handleClick(0)}></Tile>
              <Tile tile={board[1]} onTileClick={() => handleClick(1)}></Tile>
              <Tile tile={board[2]} onTileClick={() => handleClick(2)}></Tile>
            </div>
            <div className="row-mt-2">
              <Tile tile={board[3]} onTileClick={() => handleClick(3)}></Tile>
              <Tile tile={board[4]} onTileClick={() => handleClick(4)}></Tile>
              <Tile tile={board[5]} onTileClick={() => handleClick(5)}></Tile>
            </div>
            <div className="row-mt-3">
              <Tile tile={board[6]} onTileClick={() => handleClick(6)}></Tile>
              <Tile tile={board[7]} onTileClick={() => handleClick(7)}></Tile>
              <Tile tile={board[8]} onTileClick={() => handleClick(8)}></Tile>
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
    </div>
  )
}

export default function TicTacToeRemote({props, socket, room}) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [myTurn, setMyTurn] = useState(false);
  const [myValue, setMyValue] = useState(null);
  const [playState, setPlayState] = useState("waiting");
  
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
			if (data.action === 'state')
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
    <div>
    { playState === "start" && <>
      <button onClick={startGame} type='button' className='btn btn-success'>play</button>
      <button onClick={quitGame} type='button' className='btn btn-danger'>Quit</button>
    </>
    }
    { playState === "play" && <>
        <button onClick={winGame} type="button" className="btn btn-success">Success</button>
        <button onClick={giveUp} type='button' className='btn btn-danger'>Give up</button>
        <div className="container">
          <span>Tic Tac Toe</span>
          <div className="flex col">
            <Timer></Timer>
            <div className="row-mt">
              <Tile tile={board[0]} onTileClick={() => handleClick(0)}></Tile>
              <Tile tile={board[1]} onTileClick={() => handleClick(1)}></Tile>
              <Tile tile={board[2]} onTileClick={() => handleClick(2)}></Tile>
            </div>
            <div className="row-mt-2">
              <Tile tile={board[3]} onTileClick={() => handleClick(3)}></Tile>
              <Tile tile={board[4]} onTileClick={() => handleClick(4)}></Tile>
              <Tile tile={board[5]} onTileClick={() => handleClick(5)}></Tile>
            </div>
            <div className="row-mt-3">
              <Tile tile={board[6]} onTileClick={() => handleClick(6)}></Tile>
              <Tile tile={board[7]} onTileClick={() => handleClick(7)}></Tile>
              <Tile tile={board[8]} onTileClick={() => handleClick(8)}></Tile>
            </div>
          </div>
        </div>
      </>
    }
    { playState === "endRound" && <>
        <button onClick={replay} type='button' className='btn btn-success'>Replay</button>
        <button onClick={quitGame} type='button' className='btn btn-danger'>Quit</button>
      </>
    }
    { playState === "finished" && <>
        <button onClick={quitGame} type='button' className='btn btn-danger'>Quit</button>
      </>
    }
    </div>
  )
}
