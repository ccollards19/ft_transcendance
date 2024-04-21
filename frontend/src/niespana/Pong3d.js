import { React, useEffect, useState, useRef } from "react";
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import * as THREE from 'three';
import { GetMaterial } from "./Piece";
const scale = 0.2;
const width = 10 * scale;
const depth = 0.3 * scale;
const length = 15 * scale;
export function adjustUVs(geometry, scaleX, scaleY) {
    const uvAttribute = geometry.getAttribute('uv');

    for (let i = 0; i < uvAttribute.count; i++) {
        uvAttribute.setX(i, uvAttribute.getX(i) * scaleX);
        uvAttribute.setY(i, uvAttribute.getY(i) * scaleY);
    }

    uvAttribute.needsUpdate = true;
}
function Field(props) {
    const color = "#5f4b5c"
    const colorGround = "#785769"
    const groundMaterial = GetMaterial(colorGround, 0)
    const groundMaterialSurroundering = GetMaterial(color, 1)
    const surrounderingMaterial = GetMaterial(color, 2)

    let ground = new THREE.BoxGeometry(width, length, depth)
    adjustUVs(ground, 0.1, 0.1)
    let border = new THREE.BoxGeometry(depth, length, depth * 2)
    adjustUVs(border, 0.01, 1)
    let border2 = new THREE.BoxGeometry(depth, length, depth * 2)
    adjustUVs(border2, 0.01, 1)
    const ref = useRef()
    const array = [
    /*border bas*/{ pos: { x: 0, y: 0, z: 0 }, geo: ground, material: groundMaterial, scale: {x: 1, y: 1, z: 0.3} },
    /*sol haut*/{ pos: { x: (width / 2 - depth / 2) + depth, y: 0, z: depth / 2 }, geo: border, material: surrounderingMaterial, scale: {x: 1, y: 1, z: 1} },
    /*sol bas*/{ pos: { x: -(width / 2 - depth / 2) - depth, y: 0, z: depth / 2 }, geo: border2, material: groundMaterialSurroundering, scale: {x: 1, y: 1, z: 1} },
    /*border haut*/{pos:{ x: 0, y: 0, z: -depth/3}, geo: ground, material: surrounderingMaterial, scale: {x: 1, y:1, z: 0.3}}]
    return (
        <group>
            {array.map((e, index) => {
                return (
                    <mesh 
                        material={e.material}
                        geometry={e.geo}
                        position={[e.pos.x, e.pos.y, e.pos.z]}
                        scale={[e.scale.x, e.scale.y, e.scale.z]}>
                    </mesh>
                )
            })}

        </group>

    )
}
function Pong(props) {
    const [ballrotation, setR] = useState(0)
    const [P1Moving, setP1Moving] = useState(0);
    const [P2Moving, setP2Moving] = useState(0);
    const material = GetMaterial("lightgrey", 4)
    const group = useRef();
    useFrame(() => {
        setR(prev => prev+ 0.1)
        if (group.current) {
            if (group.current.rotation.x !== props.rotation.x)
                console.log("x",props.rotation.x)
            if (group.current.rotation.y !== props.rotation.y)
                console.log("y",props.rotation.y)
            if (group.current.rotation.z !== props.rotation.z)
                console.log("z",props.rotation.z)
            group.current.rotation.x = props.rotation.x;
            group.current.rotation.y = props.rotation.y;
            group.current.rotation.z = props.rotation.z;
            group.current.scale.set(props.zoom, props.zoom, props.zoom);
        }
    });
    const ballGeo = new THREE.SphereGeometry(0.25)
    adjustUVs(ballGeo, 0.01, 1)
    const paddleGeo1 = new THREE.BoxGeometry(1, 1, 1)
    adjustUVs(paddleGeo1, 1, 0.5)
    const paddleGeo2 = new THREE.BoxGeometry(1, 1, 1)
    adjustUVs(paddleGeo2, 1, 0.5)
    return (
        <group ref={group}>
            <Field />
            <mesh
                onClick={(e) => console.log('click on')}
                onPointerOver={(e) => console.log('hover on')}
                onPointerOut={(e) => console.log('unhover')}
                material={material}
                geometry={paddleGeo1}
                position={[props.paddles.P1, length / 2.06, depth * 0.66]}
                scale={[2 * scale, 0.5 * scale, scale * 0.3]}>
            </mesh>
            <mesh
                onClick={(e) => console.log('click on')}
                onPointerOver={(e) => console.log('hover on')}
                onPointerOut={(e) => console.log('unhover')}
                geometry={ballGeo}
                rotation={[ballrotation, 0, 0]}
                material={material}
                position={[props.ball.x, props.ball.y, 0.3 * scale]}
                scale={[scale, scale, scale]}>
            </mesh>
            <mesh
                onClick={(e) => console.log('click on')}
                onPointerOver={(e) => console.log('hover on')}
                onPointerOut={(e) => console.log('unhover')}
                geometry={paddleGeo2}
                material={material}
                position={[props.paddles.P2, -length / 2.06, depth * 0.66]}
                scale={[2 *scale, 0.5 * scale, scale * 0.3]}>
            </mesh>
        </group>
    )
}
function Pong3D({json}) {
    const [isDragging, setDragging] = useState(false)
    const [prevMousePosition, setPrevMousePosition] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState({ x: -13, y: 0, z: -1.57 })
    const [zoom, setZoom] = useState(1.8)
    const [cameraMove, setCameraMove] = useState(false)
    const [P1moving, setP1Moving] = useState(0);
    const [P2moving, setP2Moving] = useState(0);
    const [data, setData] = useState(null)
    useEffect(()=>{
        if (data === null) {setData(json)}
    }, json)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Control') setCameraMove(true)
            if (e.key === 'ArrowUp') setP1Moving(0.01);
            if (e.key === 'ArrowDown') setP1Moving(-0.01);
            if (e.key === 'w') setP2Moving(0.01);
            if (e.key === 's') setP2Moving(-0.01);
        }
        const handleKeyUp = (e) => {
            if (e.key === 'Control') setCameraMove(false)
            if (e.key === 'ArrowUp') setP1Moving(0);
            if (e.key === 'ArrowDown') setP1Moving(0);
            if (e.key === 'w') setP2Moving(0);
            if (e.key === 's') setP2Moving(0);
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
        if (isDragging) {
            const deltaMove = {
                x: event.clientX - prevMousePosition.x,
                y: event.clientY - prevMousePosition.y
            }

            setPrevMousePosition({
                x: event.clientX,
                y: event.clientY
            })
            cameraMove ?    setRotation((prev) => ({ ...prev, z: prev.z + deltaMove.y * 0.01 })) :
                            setRotation(prev => ({...prev, x: rotation.x + deltaMove.y * 0.01, y: rotation.y + deltaMove.x * 0.01}))
        }
    }
    const handleMouseUp = () => {
        setDragging(false)
    }

    const handleZoom = (event) => {
        if (zoom + event.deltaY * 0.001 >= 0) setZoom((prev) => prev + event.deltaY * 0.001)
    }

    return data !== null && data !== undefined ? (
        <Canvas
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleZoom}>
            <ambientLight intensity={5} />
            <Pong rotation={rotation} zoom={zoom} ball={{ x: data.game.state.ball.x, y: data.game.state.ball.y }} paddles={{ P1: data.game.state.paddle.P1, P2: data.game.state.paddle.P2 }} />
        </Canvas>
    ):<div> FETCHING </div>
}
export default Pong3D