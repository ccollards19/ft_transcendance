import React, { memo, useEffect, useRef, useState } from "react";
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import * as THREE from 'three';
import Piece from "./Piece.js"
import { GetMaterial } from "./Piece.js";
import { adjustUVs } from "./Pong3d.js";
import './loading.css'
import ChessBoard from "./ChessBoard.js";

async function getData(url) {
    try {
        const response = await fetch(url);
        const jsonData = await response.json();
        if (Array.isArray(jsonData) && jsonData.length > 0) {
            return jsonData
        }
        else {
            return {}
        }
    } catch (error) {
        return null
    }
}
async function postData(url, json) {
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(json)
        })
        return response.json()
    } catch (error) {
        return null
    }
}
function ThreeD({id1, id2}) {

    let jsonCreateRoom = {
        'player1' : id1,
        'player2' : id2,
        'game' : "chess"
    }
    const base_url = "http://127.0.0.1:8000/"
    let fen = "RNBKQBNRPPPP1PPP84P388pppppppprnbqkbnr"
    fen = fen.replace(/\d/g, (match) => "X".repeat(parseInt(match)))
    const [url, setUrl] = useState(base_url)
    const [isDragging, setDragging] = useState(false)
    const [prevMousePosition, setPrevMousePosition] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState({ x: 13, y: 0 })
    const [zoom, setZoom] = useState(0.7)
    const [cameraMove, setCameraMove] = useState(false)
    const [mouse, setMouse] = useState(null)
    const [isLoading, setLoading] = useState(0)
    const [data, setData] = useState(null)
    useEffect(() => {
        if (data === null) {
            let user1 = postData(base_url + "authenticate/sign_up/", {
                "name" : "usernul",
                "password" : "nuuuuul",
                "address" : "nul@nul.be"
            }).catch(error => {
                console.log("error = ", error)
            console.log("datauser =",user1)
            })
            console.log(getData(base_url + "api/user/0/"))
            let roomdata = (postData("http://127.0.0.1:8000/room/create/", jsonCreateRoom))
            console.log(roomdata)
        }
        else {
            setData(getData(url))
        }
    }, [url])
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Control') setCameraMove(true)
        }
        const handleKeyUp = (e) => {
            if (e.key === 'Control') setCameraMove(false)
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])
    const handleMouseDown = (event) => {
        setDragging(true)
        setPrevMousePosition({
            x: event.clientX,
            y: event.clientY
        })
    }

    const handleMouseMove = (event) => {
        if (cameraMove) {

        } else if (isDragging) {
            const deltaMove = {
                x: event.clientX - prevMousePosition.x,
                y: event.clientY - prevMousePosition.y
            }

            setPrevMousePosition({
                x: event.clientX,
                y: event.clientY
            })

            setRotation({
                x: rotation.x + deltaMove.y * 0.01,
                y: rotation.y + deltaMove.x * 0.01
            })
        }
    }

    const handleMouseUp = () => {
        setDragging(false)
    }

    const handleZoom = (event) => {
        if (zoom + event.deltaY * 0.001 >= 0) setZoom((prev) => prev + event.deltaY * 0.001)
    }
    const board = [
        1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
        0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0
    ]
    useEffect(() => {
        window.addEventListener("mousemove", e => {
            setMouse({ x: e.x, y: e.y })
        })
    }, [])
    const stopLoading = () => {
        setLoading((prev) => {
            //console.log("count", prev)
            return prev + 1
        })

    }
    const piecesToLoad = (fen) => {
        var count = 0
        for (let i = 0; i < fen.length; i++) {
            if (fen.at(i) !== 'X')
                count++
        }
        return count;
    }
    return (<div>
        {(data == null || isLoading < piecesToLoad(fen)) && <div className="loader" />}
        <Canvas
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleZoom}
        >
            <ambientLight intensity={4} />

            <ChessBoard board={board} zoom={zoom} rotation={rotation} fen={fen} position={{ x: -3.5, y: -2, z: -5 }} stopLoading={stopLoading} />
        </Canvas>
    </div>

    )
}

export default ThreeD;
