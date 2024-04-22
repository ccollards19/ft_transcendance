import React, { memo, useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { fromHalfFloat } from "three/src/extras/DataUtils.js";
import Piece from "./Piece.js"
import { GetMaterial } from "./Piece.js";
import { adjustUVs } from "./Pong3d.js";
import { getData, postData, base_url } from "./testThree.js"
import LightColumn from "./effects.js";
const pawn = "nico/chess/pawn.glb"
const bishop = "nico/chess/bishop.glb"
const queen = "nico/chess/queen.glb"
const king = "nico/chess/king.glb"
const knight = "nico/chess/knight.glb"
const rook = "nico/chess/rook.glb"
// const pawn="/nico/chess/lppawn.glb"
// const bishop="/nico/chess/lpbishop.glb"
// const queen="/nico/chess/lpqueen.glb"
// const king="/nico/chess/lpking.glb"
// const knight="/nico/chess/lpknight.glb"
// const rook="/nico/chess/lprook.glb"
const offset = 3.5
const black = "#353530"
const white = "lightgrey"
const colors = ['#FFCE9E', '#D18B47']
const groundMaterials = [GetMaterial(colors[0], 5), GetMaterial(colors[1]), 6]
const square = new THREE.BoxGeometry(1, 0.5, 1);
adjustUVs(square, 0.02, 0.064)
const piecesMaterials = [GetMaterial(black, 7), GetMaterial(white, 8)]
const Socle = () => {
  return (
    <mesh>

    </mesh>
  )
}
function ChessBoard({ board, zoom, rotation, position, stopLoading, room, playerIds, callBack }) {
  //console.log("room:", room, "fen:", fen)
  const [hover, setHoveredIndex] = useState(-1)
  const [movesList, setList] = useState(null)
  const [moves, setMoves] = useState(null)
  const [data, setData] = useState(room)
  const [fen, setFen] = useState(room.game.state.fen)
  const [fenX, setFenX] = useState("rnbqkbnrppppppppXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXPPPPPPPPRNBQKBNR")
  const [whitesTurn, setTurn] = useState(true)
  const [reload, setReload] = useState(false)
  const ref = useRef();

  const callBacktoCallback = (room) => {
    setTurn(prev => !prev)
    console.log("UDPATE ROOM")
    setMoves(null)
    setData(room)
    setFen(room.game.state.fen)
  }
  useEffect(() => {
    if (movesList !== null)
      return
		const interval = setInterval(() => {
			setReload(!reload)
		}, 5000)
		return () => clearInterval(interval)
	})
  useEffect(() => {
    try {
      fetch(base_url + "game/chess/" + room.id + "/moves/").then((res) => {
        return res.json()
      }).then((data) => {
        try {
          let list = data.game.state.moves
          setList(list)
        } catch (error) {
          setList(null)
        }         
      })
    }
    catch (error) {
      console.log(error)
    }
  }, [whitesTurn, reload])
  useEffect(() => {
    if (fen === undefined || fen === null)
      return
    let tmp = fen.split(" ");
    console.log(tmp[0])
    let fenNoModif = tmp[0]
    let res = ""
    for (const i in fenNoModif) {
      let letter = fenNoModif.at(i)
      if (/^[A-Z]$/i.test(letter.toString()))
        res += letter
      else {
        if (letter === '/')
          continue
        for (let i = 0; i < letter; i++) {
          res += "X"
        }
      }
    }
    //console.log(res)
    setFenX(res)
  }, [fen])
  const handleHover = (index) => {
    console.log(index, room)
    if (hover === index) {
      //console.log("HOVER === INDEX");
      setMoves([])
      setHoveredIndex(-1);
    }
    else {
      setHoveredIndex(index);
      try {
        let currentMoves = movesList[index]
        let dataArray = JSON.parse(currentMoves.replace(/'/g, '"'));
        let res = []
        console.log("dataArray:", dataArray)
        for (const key in dataArray) {
          res.push(moveToIndex(dataArray[key]))
        }
        setMoves(res)
        console.log(res)
      } catch (error) {

      }
    }
  }
  useEffect(() => {
    console.log("current moves:", moves)
  }, [moves])

  const stopLoading2 = () => {
    console.log("relaying...")
    stopLoading()
  }
  const moveToIndex = (move) => {
    console.log("HEY", move)
    const fileToX = [8, 7, 6, 5, 4, 3, 2, 1, 0]
    const file = move.charCodeAt(0) - 97;
    const rank = parseInt(move.charAt(1), 10);
    console.log("rank", fileToX[rank], "file", file)
    const res = fileToX[rank] * 8 + file;
    console.log("res=", res)
    return res
  }
  return (
    <group ref={ref}>
      <LightColumn height={0.2} moves={moves} offset={offset} pos={position} selected={hover} callB={callBacktoCallback} roomid={room.id}/>
      {board.map((e, index) => {
        const x = Math.floor((index) % 8)
        const z = Math.floor((index) / 8)
        let src = 'nico/chess/pawn.glb';
        let color = black
        var currentpiece = fenX.at(index)
        //console.log(index," : ", currentpiece)
        let show = currentpiece !=='X';
        let isUpper = currentpiece === String(currentpiece).toUpperCase()
        if (isUpper)
          color = white;
        else
          currentpiece = String(currentpiece).toUpperCase()
        //console.log(index," : ", color)
        src = {
          R: rook,
          N: knight,
          B: bishop,
          Q: queen,
          K: king,
          P: pawn,
        }[currentpiece]
        let h = 0.29
        h = {
          R: 0.251,
          N: 0.231,
          B: 0.255,
          Q: 0.258,
          K: 0.225,
          P: 0.294,
        }[currentpiece]
        const rotationY = color === black ? -1.55 : 1.55;
        const material = piecesMaterials[color === black ? 0 : 1]
        const attackedColor = color === black ? 0xb00925 : 0xde2f4c
        return (
          <React.Fragment key={index}>
            <mesh
              key={index}
              geometry={square}
              material={groundMaterials[(x + z) % 2]}
              position={[-offset + position.x + x, + position.y + 0, -offset + position.z + z]}
              scale={[1, 1, 1]}>
            </mesh>
            {show ? <Piece
              onHover={handleHover}
              index={index}
              outlined={index === hover}
              visible={show}
              src={src}
              zoom={0.2}
              position={{ x: position.x + x - offset, y: position.y + h, z: position.z + z - offset }}
              rotation={{ x: 0, y: rotationY }}
              color={hover !== -1 && 
              (fenX.at(hover) === String(fenX[hover]).toUpperCase()) !== isUpper
                && moves !== null && moves.find(e => e === index) !== undefined ?
                attackedColor : color}
              material={material}
              stopLoading={stopLoading2}
              moves={moves}
              whitesTurn={whitesTurn} /> : <></>}
          </React.Fragment>)
      }
      )}
    </group>

  );
}
export default memo(ChessBoard)