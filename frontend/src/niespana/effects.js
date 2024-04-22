import base_url  from './testThree.js'
import React, { useRef, useEffect, useMemo, useState, useContext, useCallback } from "react"
import { Vector2 } from "three"
import { extend, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader"
import { element } from 'three/examples/jsm/nodes/shadernode/ShaderNode.js'

extend({ OrbitControls, EffectComposer, RenderPass, OutlinePass, ShaderPass })

const Element = ({ index, position, height, callB}) => {
  const columnRef = useRef();
  const speed = 0.001;
  let scale = 0;
  const [color, setColor] = useState('yellow')
  // Rotate the board around its center
  useFrame(() => {
    scale = Math.sin(Date.now() * speed) * 0.2 + 1.2; // Adjust the amplitude and frequency as needed
    columnRef.current.scale.set(scale, 1, scale);
  });
  return (
    <mesh 
    ref={columnRef} 
    position={position}
    onPointerEnter={()=>setColor('lightyellow')}
    onPointerLeave={()=>setColor('yellow')}
    onClick={() => {
      console.log("calling back with", index)
      callB(index)
    }}
    >
      <cylinderGeometry attach="geometry" args={[0.25, 0.25, height, 64]} />
      <meshBasicMaterial attach="material" color={color} transparent opacity={0.5} />
    </mesh>
  );
};
const LightColumn = ({ height, moves, offset, pos, selected, callB, roomid }) => {
  const groupRef = useRef();
  const [index, setIndex] = useState(undefined)

  useEffect(()=>{
    console.log(index)
    if (index === undefined)
    {
      console.log("index is undefined")
      return
    }
    try {
      console.log("index=", index, "selected=",selected)
      const lexique = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      const replace = [8,7,6,5,4,3,2,1]
      let y = Math.floor(index / 8);
      let x = Math.floor(index % 8);
      const to = lexique[x] + replace[y];
      y = Math.floor(selected / 8);
      x = Math.floor(selected % 8);
      const from = lexique[x] + replace[y]      
      const move = from + to
      console.log(move)
      fetch("http://127.0.0.1/" + "game/chess/"+ roomid+"/post/", {
        method: 'POST',
        body: JSON.stringify({
          "move":move,
          "AI":false,
          "depth":0
        })
      }).then((res)=>{
        return res.json()
      }).then((data)=>{
        console.log(data)
        setIndex(undefined)
        callB(data)
      }).catch((error)=>{
        setIndex(undefined)
      console.error("Error sending move:", error);
      });
    } catch (error) {
      
    }
  }, [index])
  const handleCallback = (index) => {
    console.log("reveived", index)
    setIndex(index)
  }


  return (
    <group ref={groupRef}>
      {moves && moves.map((element) => (
        <Element
          key={element}
          index = {element}
          position={[pos.x + Math.floor(element % 8) - offset, pos.y + height, pos.z + Math.floor(element / 8) - offset]} 
          height={height}
          callB={handleCallback}
          />
      ))}
    </group>
  )
};

export default LightColumn;
