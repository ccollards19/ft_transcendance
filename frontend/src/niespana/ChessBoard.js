import React, { memo, useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { fromHalfFloat } from "three/src/extras/DataUtils.js";
import Piece from "./Piece.js"
import { GetMaterial } from "./Piece.js";
import { adjustUVs } from "./Pong3d.js";
import {getData, postData, base_url} from "./testThree.js"
const pawn="nico/chess/pawn.glb"
const bishop="nico/chess/bishop.glb"
const queen="nico/chess/queen.glb"
const king="nico/chess/king.glb"
const knight="nico/chess/knight.glb"
const rook="nico/chess/rook.glb"
// const pawn="/nico/chess/lppawn.glb"
// const bishop="/nico/chess/lpbishop.glb"
// const queen="/nico/chess/lpqueen.glb"
// const king="/nico/chess/lpking.glb"
// const knight="/nico/chess/lpknight.glb"
// const rook="/nico/chess/lprook.glb"
const black = "#4e4e4e"
const white = "f0f0f0"
const colors = ['#FFCE9E', '#D18B47']
const groundMaterials = [GetMaterial(colors[0], 5), GetMaterial(colors[1]), 6]
const square = new THREE.BoxGeometry(1, 0.5, 1);
adjustUVs(square, 0.02, 0.064)
const piecesMaterials = [GetMaterial(white, 7), GetMaterial(black, 8)]

function ChessBoard({board, zoom, rotation, fen, position, stopLoading, room, playerIds}) {
  const [hover, setHoveredIndex] = useState(-1)
  const [moves, setMoves] = useState({})
  const ref = useRef();
  const handleHover = (index) =>{
    console.log(index, room)
    if (hover === index){
      console.log("HOVER === INDEX");
      setHoveredIndex(-1);
    }  
    else{
      console.log("NOT EQUAL LOL")
      let Allmoves = getData(base_url + "game/chess/" + room.id + "/moves/")
      setMoves(Allmoves)
      setHoveredIndex(index);
    }
      
  }
  useEffect(()=>{
    console.log("current moves:", moves)
  },[moves])
  useEffect(() => {
    
    if (ref.current) {
      //console.log("rota =", props.rotation.x, props.rotation.y)
      ref.current.rotation.x = rotation.x;
      ref.current.rotation.y = rotation.y;
      ref.current.scale.set(zoom, zoom, zoom);
    }
  }, [rotation, zoom]);

  const stopLoading2 = () =>{
    console.log("relaying...")
    stopLoading()
  }
  return (
    <group ref={ref}>
      {board.map((e, index) => {
        const x = Math.floor((index) % 8)
        const z = Math.floor((index) / 8)
        let src = 'nico/chess/pawn.glb';
        let color = black
        var currentpiece = fen.at(index)
        let show = currentpiece != 'X';     
        if (currentpiece === String(currentpiece).toUpperCase())
            color = white;
        else 
            currentpiece = String(currentpiece).toUpperCase()
        src = {
            R: rook,
            N: knight,
            B: bishop,
            Q: queen,
            K: king,
            P: pawn,
        }[currentpiece]
        let h = 0
        h = {
            R: 0.251,
            N: 0.24,
            B: 0.216,
            Q: 0.245,
            K: 0.24,
            P: 0.251, 
        }[currentpiece]
        const rotationY = color === black ? 1.55 : -1.55;
        const material = piecesMaterials[color === black ? 0 : 1]
        return (<React.Fragment key={index}> 
          <mesh
            key={index}
            geometry={square}
            material={groundMaterials[(x + z) % 2]}
            position={[position.x + x, position.y + 0, position.z + z]}
            scale={[1, 1, 1]}>     
          </mesh>
          {show ?<Piece
            onHover={handleHover}
            index={index}
            outlined={index === hover}
            visible={show}
            src={src}
            zoom={0.2}
            position={{ x: position.x + x, y: position.y + h, z: position.z + z }}
            rotation={{ x: 0, y: rotationY }}
            color={color}
            material={material}
            stopLoading={stopLoading2}/> : <></>}
        </React.Fragment>)
      }
      )}
    </group>
    
  );
}
export default memo(ChessBoard)