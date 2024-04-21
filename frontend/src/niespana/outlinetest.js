import React, { useRef, useEffect, useMemo, useState, useContext, useCallback } from "react";
import { BoxGeometry, Vector2} from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import * as THREE from 'three';

extend({ OrbitControls, EffectComposer, RenderPass, OutlinePass, ShaderPass });

const Controls = () => {
  const { camera, gl } = useThree();
  const ref = useRef();
  useFrame(() => ref.current.update());
  return <orbitControls ref={ref} target={[0, 0, 0]} enableDamping args={[camera, gl.domElement]} />;
};

const Thing = ({ position, color, callB }) => {

    const meshRef = useRef();
    return (
      <mesh
      ref={meshRef}
        position={position}
        onPointerOver={() => callB(meshRef.current)}
        onPointerOut={() => callB(null)}
      >
        <cylinderGeometry args={[0.3, 0.3, 0.5, 64]} />
        <meshPhongMaterial color={color} />
      </mesh>
    );
  };

const Test2 = () =>{
    const composer = useRef()
    const { gl, scene, camera, size } = useThree()
    const [hover, setHovered] = useState(null)
    const handleCallback = (value) =>{
        setHovered(value)
    }
    useEffect(()=>{console.log(hover)},[hover])
    useEffect(() => composer.current.setSize(size.width, size.height), [size])
    const aspect = useMemo(() => new Vector2(size.width, size.height), [size])
    return (
        <>
        <ambientLight intensity={1.5} />
        <directionalLight position={[2,2,2]} color={'blue'}/>
        <Controls />
        <Thing position={[0, 1, 0]} color="hotpink" callB={handleCallback}/>
        <Thing position={[-1, -1, 0]} color="indianred" callB={handleCallback}/>
        <Thing position={[1, -1, 0]} color="lightgreen" callB={handleCallback}/>
        <effectComposer ref={composer} args={[gl]}>
        <renderPass attachArray="passes" args={[scene, camera]} />
        <outlinePass
          attachArray="passes"
          args={[aspect, scene, camera]}
          selectedObjects={hover}
          visibleEdgeColor="green"
          edgeStrength={50}
          edgeThickness={10}
        />
        <shaderPass attachArray="passes" args={[FXAAShader]} uniforms-resolution-value={[1 / size.width, 1 / size.height]} />
      </effectComposer>
      </>
    )
}
const Test = () => {

    return (
      <Canvas style={{height: '100%', width: '100%' , position: 'absolute', border: '2px solid white'}}>
        <Test2/>
      </Canvas>
    );
};

export default Test;
