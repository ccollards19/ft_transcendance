import React from "react";
import { useEffect } from "react";
import { useState, useRef } from "react";
import { connectSocket } from "./socket";
import './Main.css'
import sound1 from "../sounds/behind.mp3"
import sound2 from "../sounds/goInPeace.mp3"
import sound3 from "../sounds/thereIsChaos.mp3"
import sound4 from "../sounds/victoryIsWithinOur.mp3"
import sound5 from "../sounds/weMustLetGo.mp3"
import sound6 from "../sounds/wonderful.mp3"
import sound7 from "../sounds/youHaveDoneWell.mp3"

function Pong(params) {
    //const socket = connectSocket(params.state.url + params.state.username);
    const svgContainerRef = useRef(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const [gameOn, SetGameOn] = useState(false);
    const [pause, setPause] = useState("Start");
    const [isMovingUp, setMovingUp] = useState(false);
    const [isMovingDown, setMovingDown] = useState(false);
    const [trail, setTrail] = useState([]);
    const [ball, setBall] = useState({ pos: { x: -50, y: -50 }, angle: 0, radius: 0, speed: 5, isSetted: false, collision: false })
    const [player1, setPlayer1] = useState({ name: "guest1", color: 'blue', pos: { x: 0, y: 0 }, width: 0, height: 0, score: 0 })
    const [player2, setPlayer2] = useState({ name: "guest2", color: 'red', pos: { x: 0, y: 0 }, width: 0, height: 0, score: 0 })
    const [sizeChange, setSizeChange] = useState(false)
    //KEY HANDLELING
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp') 
                setMovingUp(true);
            else if (e.key === 'ArrowDown') 
                setMovingDown(true);
        }
        const handleKeyUp = (e) => {
            if (e.key === 'ArrowUp')
                setMovingUp(false);
            else if (e.key === 'ArrowDown')
                setMovingDown(false);
        }
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        }
    }, [])

    useEffect(() => {//capture player inputs
        var dx = (Math.cos(ball.angle) * ball.speed);
        var dy = (Math.sin(ball.angle) * ball.speed)
        const move = () => {
            //console.log(isMovingDown, isMovingUp, barpos1, gameOn);
            if (!gameOn)
                return
            if (isMovingDown && player1.pos.y + player1.height <= containerSize.height)
                setPlayer1(prev => ({ ...prev, pos: { y: prev.pos.y + 5, x: prev.pos.x}}))
            if (isMovingUp && player1.pos.y > 0)
                setPlayer1(prev => ({ ...prev, pos: { y: prev.pos.y - 5, x: prev.pos.x} }))
        }
        const updateBallPosition = () => {
            if (gameOn) {
                const updatedTrail = [...trail, { x: ball.pos.x, y: ball.pos.y }];
                if (updatedTrail.length > 10)
                    updatedTrail.shift(); // Remove the oldest position if the trail exceeds the specified length
                setTrail(updatedTrail)
                setBall((prev) => ({ ...prev, pos:{x: prev.pos.x + dx, y: prev.pos.y + dy }}))
            }

        }
        const handleCollisions = () => {
            if (ball.pos.x + dx <= 30) //BORD GAUCHE
            {
                if (ball.pos.y + dy > player1.pos.y && ball.pos.y + dy < player1.pos.y + player1.height)
                    setBall(prev => ({ ...prev, collision: true, angle: Math.PI - prev.angle }))
                else {
                    setBall(prev => ({ ...prev, collision: true, speed: 5, isSetted: !prev.isSetted, angle: Math.random() * (Math.PI * 2) }))
                    setPlayer2(prev => ({ ...prev, score: prev.score + 1 }))
                }
            }
            else if (ball.pos.x + dx >= containerSize.width - 30)//BORD DROIT
            {
                setBall(prev => ({ ...prev, collision: true }))
                if (ball.pos.y + dy > player2.pos.y && ball.pos.y + dy < player2.pos.y + player2.height)
                    setBall(prev => ({...prev, angle :Math.PI - prev.angle}))
                else {
                    setBall(prev => ({ ...prev, isSetted: !prev.isSetted, angle: Math.random() * (Math.PI * 2), speed: 5 }))
                    setPlayer1(prev => ({ ...prev, score: prev.score + 1 }))
                }
            }
            else if (ball.pos.y + dy <= 10) // BORD HAUT
                setBall(prev => ({ ...prev, angle: -prev.angle, collision: true }))
            else if (ball.pos.y + dy >= containerSize.height - 10) // BORD BAS
                setBall(prev => ({ ...prev, angle: -prev.angle, collision: true }))
        }
        const intervalId = setInterval(() => {
            if (gameOn) {
                if (!ball.collision)
                    handleCollisions();
                move();
                updateBallPosition();
            }

        }, 16);
        return () => {
            clearInterval(intervalId)
        }

    }, [gameOn, isMovingDown, isMovingUp, player1, player2, ball, trail, containerSize])

    useEffect(() => {
        const updateContainerSize = () => {
            const container = svgContainerRef.current;
            if (container) {
                const containerRect = container.getBoundingClientRect();
                setContainerSize(prev => ({ width: containerRect.width, height: containerRect.height }));
                setSizeChange(prev => !prev)
            }
        };
        updateContainerSize();
        window.addEventListener('resize', updateContainerSize);
        return () => {
            window.removeEventListener('resize', updateContainerSize);
        };
    }, []);
    useEffect(() => { //change the button name
        if (gameOn)
            setPause("Pause")
        else
            setPause("Start")
    }, [gameOn])

    useEffect(() => { //prevent infinite collision when on the bar
        const intervalId = setInterval(() => {
            if (gameOn)
                setBall(prev => ({...prev, speed: prev.speed + 0.1}))
            setBall(prev => ({...prev, collision: false}))
        }, 250);
        return () => {
            clearInterval(intervalId)
        }
    }, [gameOn])

    useEffect(() => {//set the ball if not in play when the container size is updated
        if (!ball.isSetted) {
            setBall((prev) => (
                { ...prev, 
                    collision: false, 
                    angle: Math.random() * (Math.PI  * 2), 
                    speed: 5, 
                    isSetted: !prev.isSetted, 
                    radius: containerSize.width * 0.01, 
                    pos:{x: containerSize.width / 2, y: containerSize.height / 2 }}
                    ));
            if (player1.pos.x == 0 )
                setPlayer1(prev => ({...prev, width: containerSize.width * 0.01,height: containerSize.height * 0.2, pos:{x: containerSize.width * 0.001, y: 6}}))
            if (player2.pos.x == 0 )
                setPlayer2(prev => ({...prev, width: containerSize.width * 0.01, height: containerSize.height * 0.2, pos:{x: containerSize.width * 0.988, y: 5}}))
            if (sizeChange)
            {
                setSizeChange(prev => !prev)
                setPlayer1(prev => ({...prev, width: containerSize.width * 0.01,height: containerSize.height * 0.2, pos:{x: containerSize.width * 0.001, y: 6}}))
                setPlayer2(prev => ({...prev, width: containerSize.width * 0.01, height: containerSize.height * 0.2, pos:{x: containerSize.width * 0.988, y: 5}}))
            }
        }
    }, [containerSize, ball, player1, player2, sizeChange])

    const SVGComponent = ({ width, height}) => (
        <svg width={width} height={height} style={{ border: '1px solid #000', opacity: 1 }}>
            <rect x={player1.pos.x} y={player1.pos.y} width={player1.width} height={player1.height} fill="white" /> {/* Left Paddle */}
            <rect x={player2.pos.x} y={player2.pos.y} width={player2.width} height={player2.height} fill="white" /> {/* Left Paddle */}
            {trail.map((pos, index) => (
                <circle key={index} cx={pos.x} cy={pos.y} r={ball.radius / 4} fill="white" opacity={0.5 + (index / 10)} />
            ))}
            <image x={ball.pos.x - ball.radius} y={ball.pos.y - ball.radius} width={ball.radius * 2} height={ball.radius * 2} xlinkHref="https://i.imgur.com/RjyduNQ.gif" />
        </svg>
    );

    return (
        <div style={{ textShadow: '-1px 2px black' }}>
            <div style={{ justifyContent: 'space-arround' }}>
                {player1.name} : {player1.score}
                <button onClick={() => {
                    SetGameOn(prev => !prev)
                }}>
                    {pause}
                </button>
                {player2.name} : {player2.score}
            </div>

            <div ref={svgContainerRef} style={{ width: '50vw', height: '50vh', position: 'relative', backgroundColor: 'black', opacity: 0.7 }}>
                <SVGComponent width={containerSize.width} height={containerSize.height}/>
            </div>
        </div>

    )
}
export default Pong