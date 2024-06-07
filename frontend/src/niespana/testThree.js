import React, {useEffect, useRef, useState } from "react";
import { Canvas} from '@react-three/fiber';
import './loading.css'
import ChessBoard from "./ChessBoard.js";
import {OrbitControls } from "@react-three/drei";
import * as THREE from 'three'
import { useControls } from 'leva'
export function getData(url) {
    try {
        fetch(url).then((res) => {
            return res.json()
        }).then((data) => {
            return (data)
        })
    } catch (error) {
        return null
    }
}
export function postData(url, json) {
    try {
        fetch(url, {
            method: "POST",
            body: JSON.stringify(json)
        }).then((res)=>{
            return (res)
        }).then((data)=>{
            return (data)
        })
    }
    catch (error) {
        return null
    }
}
export const base_url = window.location.protocol + "//" + window.location.host + "/"

function Lights({intensity}) {
    const ambientRef = useRef()
    const directionalRef = useRef()

    useControls('Ambient Light', {
      visible: {
        value: true,
        onChange: (v) => {
          ambientRef.current.visible = v
        },
      },
      color: {
        value: '#e8e7c5',
        onChange: (v) => {
          ambientRef.current.color = new THREE.Color(v)
        },
      },
    })
  
    useControls('Directional Light', {
      visible: {
        value: true,
        onChange: (v) => {
          directionalRef.current.visible = v
        },
      },
      position: {
        x: -1,
        y: 3,
        z: 0,
        onChange: (v) => {
          directionalRef.current.position.copy(v)
        },
      },
      color: {
        value: 'white',
        onChange: (v) => {
          directionalRef.current.color = new THREE.Color(v)
        },
      },
    })
  
    return (
      <>
        <ambientLight ref={ambientRef} intensity={intensity}/>
        <directionalLight ref={directionalRef}/>
      </>
    )
  }
function ThreeD({id1, id2, roomid}) {

    let jsonCreateRoom = {
        'player1' : id1,
        'player2' : id2,
        'game' : "chess"
    }
    const [url, setUrl] = useState(base_url)
    const [rotation, setRotation] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(0.7)
    const [position, setPosition] = useState({ x: 0, y: -2, z: 0 })
    const [isLoading, setLoading] = useState(0)
    const [data, setData] = useState(null)
    const [fen, setFen] = useState(null)
    const [color, setColor] = useState(0x64fe21)
    const [key, setKey] = useState(0)
    useEffect(()=>{
        if (data === null) return
        console.log("data has been modified to", data)
    },[data])
    useEffect(() => {
        if (data === null) {
            fetch(base_url + "game/room/"+ roomid + "/").then((res) => {
                return res.json()
            }).then((room) =>{
                setData(room)
                setFen(room.game.state.fen)
            }).catch(error => console.log(error))
        }
        else {
            fetch(url).then((res) => {
                return res.json()
            }).then((room) =>{
                setData(room)
            }).catch(error => console.log(error)) 
        }
    }, [url])

    const board = [
        1, 0, 1, 0, 1, 0, 1, 0,
        1, 0, 1, 0, 1, 0, 1, 0, 
        1, 0, 1, 0, 1, 0, 1, 0, 
        1, 0, 1, 0, 1, 0, 1, 0, 
        1, 0, 1, 0, 1, 0, 1, 0, 
        1, 0, 1, 0, 1, 0, 1, 0,
        1, 0, 1, 0, 1, 0, 1, 0,
        1, 0, 1, 0, 1, 0, 1, 0
    ]

    const stopLoading = () => {
        setLoading((prev) => {
            //console.log("count", prev)
            return prev + 1
        })

    }
    const piecesToLoad = (fen) => {
        if (!fen)
            return
        var count = 0
        let couille = fen.split(" ")[0]
        for (let i = 0; i < couille.length; i++) {
            if (/^[A-Z]$/i.test(couille.at(i).toString()))
                count++
        }
        console.log(count)
        return count;
    }
    const updateData = (room) =>{
      setData(room)
    }
    const interaction = () =>{
      console.log("heya im interacting !");
      setRotation({x: 0, y: 0})
      setZoom(0.7)
      setPosition({ x: 0, y: -2, z: 0 })
      setKey(prev => prev +1)
      setData(null)
      setLoading(0)
      setUrl(()=>{
        if (url === base_url + "/game/room/" + roomid+ "/")
          return base_url + "/game/room/"+ roomid+"/moves/"
        return base_url + "/game/room/"+roomid+"/"

      })
    }
    return (<div>
        {(isLoading < piecesToLoad(fen)) && <div className="loader"/>}
        {data !== null && <Canvas
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            onWheel={() => setZoom(prev => prev +0.001)}>

            <OrbitControls/>
            <Lights intensity={3}/>
            <mesh
            position={[4,2,-4]}
            rotation={[0.1,0,0]}
            geometry={new THREE.BoxGeometry(1,1,0.1)}
            onPointerOver={() =>{setColor(0x669821)}}
            onPointerOut={()=> {setColor(0x63fe21)}}
            onClick={() => {
              interaction()
              }}>
              <meshPhongMaterial color={color}/>
            </mesh>
            <ChessBoard
            key={key}
              board={board} 
              zoom={zoom} 
              rotation={rotation} 
              position={position} 
              stopLoading={stopLoading} 
              room={data} 
              playerIds={{id1: id1, id2: id2}}
              callBack={updateData}
              roomid={roomid}
              />
        </Canvas>}
    </div>

    )
}

export default ThreeD;
