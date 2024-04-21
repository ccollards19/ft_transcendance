import React from "react";
import { useEffect } from "react";
import { useState, useRef } from "react";
import './Main.css'
import sound1 from "../sounds/behind.mp3"
import sound2 from "../sounds/goInPeace.mp3"
import sound3 from "../sounds/thereIsChaos.mp3"
import sound4 from "../sounds/victoryIsWithinOur.mp3"
import sound5 from "../sounds/weMustLetGo.mp3"
import sound6 from "../sounds/wonderful.mp3"
import sound7 from "../sounds/youHaveDoneWell.mp3"

function Game(params) {
  const svgContainerRef = useRef(null);
  const [name1, setName1] = useState("Mark");
  const [name2, setName2] = useState("Nolan");
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [barpos1, setBarpos1] = useState(5);
  const [barpos2, setBarpos2] = useState(5);
  const [angle, setAngle] = useState(Math.random() * (Math.PI * 2));
  const [speed, SetSpeed] = useState(5);
  const [radius, SetRadius] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [ballPos, setBallPos] = useState({ x: 50, y: 50 });
  const [ballsetted, Setballsetted] = useState(false);
  const [gameOn, SetGameOn] = useState(false);
  const [pause, setPause] = useState("Start");
  const [collision, setCollision] = useState(false);
  const [isMovingUp, setMovingUp] = useState(false);
  const [isMovingDown, setMovingDown] = useState(false);
  const [trail, setTrail] = useState([])
  //const [rendered, Setrendered] = useState(0);
  const ball = {
    pos: ballPos,
    angle: angle,
    radius: radius,
    speed: speed,
    set: ballsetted,
    collision: collision,
  };

  const bar1 = {
    posy: barpos1,
    posx: containerSize.width * 0.01,
    widght: containerSize.width * 0.01,
    height: containerSize.height * 0.2,
    color: 'red'

  };
  const player1 = {
    score: score1,
    name: name1,
    barPos: bar1
  };
  const bar2 = {
    posy: barpos2,
    posx: containerSize.width * 0.98,
    widght: containerSize.width * 0.01,
    height: containerSize.height * 0.2,
    color: 'blue'

  };
  const player2 = {
    score: score2,
    name: name2,
    barPos: bar2
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        setMovingUp(true);
      } else if (e.key === 'ArrowDown') {
        setMovingDown(true);
      }
    }
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp') {
        setMovingUp(false);
      } else if (e.key === 'ArrowDown') {
        setMovingDown(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    }
  }, [])

  useEffect(() => {//capture player inputs
    var dx = (Math.cos(ball.angle) * speed);
    var dy = (Math.sin(ball.angle) * speed)
    const move = () => {
      //console.log(isMovingDown, isMovingUp, barpos1, gameOn);
      if (!gameOn)
        return
      if (isMovingDown && barpos1 + bar1.height <= containerSize.height)
        setBarpos1(prev => prev + 5)
      if (isMovingUp && barpos1 > 0)
        setBarpos1(prev => prev - 5)
    }
    const scoreSoundEffect = () => {
      
      var value = Math.floor((Math.random() * 7) + 1);
      console.log("inside soundeffect", value)
      switch (value) {
        case 1:
          var voiceLine1 = new Audio(sound1)
          voiceLine1.play()
          //voiceLine1.remove()
          break;
        case 2:
          var voiceLine2 = new Audio(sound2)
          voiceLine2.play()
          break;
        case 3:
          var voiceLine3 = new Audio(sound3)
          voiceLine3.play()
          break;
        case 4:
          var voiceLine4 = new Audio(sound4)
          voiceLine4.play()
          break;
        case 5:
          var voiceLine5 = new Audio(sound5)
          voiceLine5.play()
          break;
        case 6:
          var voiceLine6 = new Audio(sound6)
          voiceLine6.play()
          break;
        case 7:
          var voiceLine7 = new Audio(sound7)
          voiceLine7.play()
          break;
        default:
          break;
      }

    }
    const updateBallPosition = () => {
      if (gameOn) {
        const updatedTrail = [...trail, { x: ball.pos.x, y: ball.pos.y }];
        if (updatedTrail.length > 10) {
          updatedTrail.shift(); // Remove the oldest position if the trail exceeds the specified length
        }
        setTrail(updatedTrail)
        setBallPos((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
      }

    }
    const handleCollisions = () => {
      var currentAngle = angle;
      if (ballPos.x + dx <= 30) //BORD GAUCHE
      {
        setCollision(true)
        if (ballPos.y + dy > barpos1 && ballPos.y + dy < barpos1 + bar1.height) {
          setAngle(prev => Math.PI - prev)
        }
        else {
          scoreSoundEffect();
          setScore2((score) => score + 1)
          Setballsetted(prev => !prev)
          setAngle(Math.random() * (Math.PI * 2))
          SetSpeed(5)
        }
      }
      else if (ballPos.x + dx >= containerSize.width - 30)//BORD DROIT
      {
        setCollision(true)
        if (ballPos.y + dy > barpos2 && ballPos.y + dy < barpos2 + bar2.height) {
          setAngle(prev => Math.PI - prev)
        }
        else {
          scoreSoundEffect()
          setScore1((score) => score + 1)
          Setballsetted(prev => !prev)
          setAngle(Math.random() * (Math.PI * 2))
          SetSpeed(5)
        }
      }
      else if (ballPos.y + dy <= 10) // BORD HAUT
      {
        setCollision(true)
        setAngle(prev => -prev)
      }
      else if (ballPos.y + dy >= containerSize.height - 10) // BORD BAS
      {
        setCollision(true)
        setAngle(prev => -prev)
      }
    }
    const intervalId = setInterval(() => {
      if (gameOn) {

        if (!ball.collision)
          handleCollisions();
        move();
        move();
        updateBallPosition();
      }

    }, 16);
    return () => {
      clearInterval(intervalId)
    }

  }, [gameOn, isMovingDown, isMovingUp, barpos1, ball])


  useEffect(() => {//get the size of the container and setup the resize of it 
    const updateContainerSize = () => {
      const container = svgContainerRef.current;

      if (container) {
        const containerRect = container.getBoundingClientRect();
        setContainerSize({ width: containerRect.width, height: containerRect.height });
      }
    };
    // Call the function initially and add event listener for window resize
    updateContainerSize();
    window.addEventListener('resize', updateContainerSize);
    // Cleanup the event listener on component unmount
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
        SetSpeed(prev => prev + 0.1)
      setCollision(false);
    }, 250);
    return () => {
      clearInterval(intervalId)
    }
  }, [gameOn])

  useEffect(() => {//set the ball if not in play when the container size is updated
    if (!ballsetted) {
      setBallPos((prev) => ({ ...prev, x: containerSize.width / 2, y: containerSize.height / 2 }));
      SetRadius(containerSize.width * 0.01);

      Setballsetted(prev => !prev);
    }
  }, [containerSize, ballsetted])

  return (
    <div style={{ textShadow: '-1px 2px black' }}>
      <div style={{ justifyContent: 'space-arround' }}>
        {player1.name} : {score1}
        <button onClick={() => {
          SetGameOn(prev => !prev)
        }}>
          {pause}
        </button>
        {player2.name} : {score2}
      </div>

      <div ref={svgContainerRef} style={{ width: '50vw', height: '50vh', position: 'relative', backgroundColor: 'gray', opacity: 0.7 }}>
        {/*width {containerSize.width} height {containerSize.height}*/}
        <svg width={containerSize.width} height={containerSize.height} style={{ border: '1px solid #000', opacity: 1 }}>
          <rect x={bar1.posx} y={bar1.posy} width={bar1.widght} height={bar1.height} fill={bar1.color} /> {/* Left Paddle */}
          <rect x={bar2.posx} y={bar2.posy} width={bar2.widght} height={bar2.height} fill={bar2.color} /> {/* Left Paddle */}
          {trail.map((pos, index) => (
            <circle key={index} cx={pos.x} cy={pos.y} r={ball.radius / 4} fill="white" opacity={0.5 + (index / 10)} />
          ))}
          <image x={ball.pos.x - ball.radius} y={ball.pos.y - ball.radius} width={ball.radius * 2} height={ball.radius * 2} xlinkHref="https://i.imgur.com/RjyduNQ.gif" />
        </svg>
      </div>
    </div>

  )
}
export default Game