import React, { useEffect, useRef } from "react";
import { useLoader, useFrame } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import * as THREE from 'three';
import { adjustUVs } from "./Pong3d";

var textures = {}
export function GetMaterial(color, id) {
    if (id === undefined){
        id = 0
        while (textures[id] !== undefined)
            id++
    }
    if (textures === undefined || textures[id] === undefined) {
       // console.log("defining new texture", id)
        const loader = new TextureLoader();
        const marble_arm = loader.load('nico/texture/marble/ARM.jpg')
        const marble_ao = loader.load('nico/texture/marble/AO.jpg')
        const marble_nor = loader.load('nico/texture/marble/NORMAL.jpg')
        const texture_arm = loader.load('nico/textures/arm.jpg');
        const texture_disp = loader.load('nico/textures/disp.jpg');
        const texture_diff = loader.load('nico/textures/diff.jpg');
        const texture_ao = loader.load('nico/textures/ao.jpg');
        const texture_gl = loader.load('nico/textures/norgl.jpg');
        textures[id] = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0,
            map: texture_diff,
            normalMap: texture_gl,
            displacementMap: texture_disp,
            displacementScale: 0, // Adjust displacement scale if necessary
            roughnessMap: texture_arm,
            aoMap: texture_ao,
            aoMapIntensity: 0, // Adjust AO map intensity if necessary
            displacementBias: 0,
            vertexColors: false,
            alphaTest: 0, // Adjust alpha test threshold if necessary
            side: THREE.DoubleSide, // Ensure material is visible from both sides
            depthTest: true,
            depthWrite: true,
        })
       // console.log("Texture is", textures[id])
    }
    //else
    //    console.log("Using already loaded texture", id)
    return textures[id];
}

const Scene = []

function Piece({ onHover, index, outlined, visible, src, zoom, position, rotation, color, material, stopLoading, whitesTurn }) {
    let Light
    const group = useRef();
    const gltf = useLoader(GLTFLoader, src);

    
    if (Scene[index] === undefined){
        const basicMaterial = new THREE.MeshPhongMaterial({color: color})
        const intensity = color === 'black' ? 0 : 0
        Scene[index] = {
            material: basicMaterial,

        }
        
    }
    Light = Scene[index]
    
    useEffect(()=>{
        stopLoading()
    },[gltf])
    useEffect(()=>{
        Light = Scene[index]
        Light.material.color.set(color)
    },[position])
    const handleHover = (index) => {
        onHover(index)
    }
    var geo = gltf.scene;
    const geometry = geo.clone()
    if (geometry)
    {
        geometry.traverse((obj)=>{
            obj.material = Light.material
            try {
                adjustUVs(obj, 0.1, 0.1)
                console.log("SUCCES")
            } catch (error) {

            }    
        })
    }

    useFrame(() => {
        if (group.current) {
            group.current.rotation.x = rotation.x;
            group.current.rotation.y = rotation.y;
        }
    });
    return ((whitesTurn && color === 'lightgrey')|| (!whitesTurn && color === '#353530') ? 
        
        <mesh
            onClick={() => handleHover(index)}>
            <primitive
                ref={group}
                visible={visible}
                object={geometry}
                scale={[zoom, zoom, zoom]}
                position={[position.x, position.y, position.z]}
            />
            </mesh>
            :
            <mesh>
            <primitive
                ref={group}
                visible={visible}
                object={geometry}
                scale={[zoom, zoom, zoom]}
                position={[position.x, position.y, position.z]}
            />
            </mesh>
        )

}
export default Piece