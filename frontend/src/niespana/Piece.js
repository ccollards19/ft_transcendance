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

function recursivelyFindGeometry(scene){
    let res;
    try {
        scene.children.forEach(element => {
            if (element.geometry !== undefined)
            {
                //console.log("return element =", element)
                res = element.geometry
                return res
            }
            else
                res = recursivelyFindGeometry(element)
    });  
    } catch (error) {
        console.log(error)
    }
    return (res)
}
function Piece({ onHover, index, outlined, visible, src, zoom, position, rotation, color, material, stopLoading }) {
    
    const gltf = useLoader(GLTFLoader, src);
    const group = useRef();
    useEffect(()=>{
        stopLoading()
    },[gltf])
    const handleHover = (index) => {
        onHover(index)
    }
    useFrame(() => {
        if (group.current) {
            group.current.rotation.x = rotation.x;
            group.current.rotation.y = rotation.y;
        }
    });
    if (outlined)
        zoom += 0.1;
    var geometry = gltf.scene;
    geometry = recursivelyFindGeometry(geometry)  
    if (geometry instanceof THREE.BufferGeometry) {
        //console.log("geometry is ", geometry)
        //geometry.material = material
        //adjustUVs(geometry, 1, 1)
    }
    
    const clonedScene = gltf.scene.clone();
        if (clonedScene)
        {
            let i = 0;
            clonedScene.traverse((obj)=>{
                obj.material = material
                try {
                    adjustUVs(obj, 0.1, 0.1)
                    console.log("SUCCES")
                } catch (error) {

                }                   
            })
        }
    return (
        <mesh
            onClick={() => handleHover(index)}>
            <primitive
                ref={group}
                visible={visible}
                object={clonedScene}
                scale={[zoom, zoom, zoom]}
                position={[position.x, position.y, position.z]}
            /></mesh>
    );
}
export default Piece