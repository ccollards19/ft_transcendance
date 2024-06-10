import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"

export function Timer() {
  const [counter, setCounter] = useState(60);

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  return (
    <button>{counter}</button>
  )
}

export function Score() {
  return (
    <button>Score</button>
  )
}

export function Tile({ tile, onTileClick }) {
  return (
    <button className="btn" onClick={onTileClick}>{tile}</button>
  )
}

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(false);

  function handleClick(i) {
    if (board[i] !== null)
      return
    const newBoard = [...board]
    if (isX)
      newBoard[i] = 'X'
    else
      newBoard[i] = 'O'
    setIsX(!isX)
    setBoard(newBoard)
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

  if (checkWin(board) !== null)
    console.log(checkWin(board) + "won")

  return (
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
  )
}

export default function TicTacToeRemote({props, socket, room}) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [myTurn, setMyTurn] = useState(false);
  const [myValue, setMyValue] = useState(null);
  
  const navigate = useNavigate()
	const player1 = props.myProfile && props.myProfile.id === room.player1.id
	const player2 = props.myProfile && props.myProfile.id === room.player2.id

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
			else if (data.action === 'win') {}
			else if (data.action === 'giveUp') {}
			else if (data.action === 'quit') {}
      
    }
      
    return () => {} 

  }, [socket])

  function handleClick(i) {
    if (!myTurn || board[i] !== null)
      return
    const newBoard = [...board]
    newBoard[i] = myValue
    setBoard(newBoard)
  }

  return (
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
  )
}

