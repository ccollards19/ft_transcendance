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
