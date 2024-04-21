import React, { useEffect, useState, useRef } from 'react';
const useCountdown = (initialTimer, initialPlaying) => {
    const milisecond = useRef(initialTimer * 1000);
    const previous = useRef(milisecond);
    const [timer, setTimer] = useState(initialTimer);
    const [isPlaying, setIsPlaying] = useState(initialPlaying);

    useEffect(() => {
        if (!isPlaying || milisecond.current <= 0) return;

        let effectInitialMs = milisecond.current;
        let effectInitialTimeStamp, handle;

        const step = (timestampMs) => {
            if (effectInitialTimeStamp === undefined)
                effectInitialTimeStamp = timestampMs;
            const elapsed = timestampMs - effectInitialTimeStamp;
            milisecond.current = effectInitialMs - elapsed;

            if (milisecond.current <= 0) {
                setTimer(0);
                //console.log("cancelAnimationFrame(zero)", handle, milisecond.current);
                cancelAnimationFrame(handle);
            } else {
                const seconds = Math.floor(milisecond.current / 1000);
                const isUpdate = seconds !== Math.floor(previous.current / 1000);
                previous.current = milisecond.current;

                if (isUpdate) {
                    setTimer(seconds);
                }

                if (isPlaying) {
                    handle = window.requestAnimationFrame(step);
                }
            }
        };

        handle = window.requestAnimationFrame(step);

        return () => {
            console.log("cancelAnimationFrame(pause)", handle, milisecond.current);
            cancelAnimationFrame(handle);
        };
    }, [isPlaying]);

    return [timer, isPlaying, setIsPlaying];
};

function Timer(time, turn){
    const [timerPlayer1, isPlaying, setIsPlaying] = useCountdown(time, true);
    const [timerPlayer2, isPlaying2, setIsPlaying2] = useCountdown(time, false);
    
    const convertTime = (count) => {
        console.log("count", count)
        let minutes = Math.floor(count / 60);
        let seconds = parseFloat(count % 60).toFixed(0);
        if (minutes < 10) minutes = `0${minutes}`;
        if (seconds < 10) seconds = `0${seconds}`;
        return `${minutes}:${seconds}`;
    };
    useEffect(()=>{
        console.log("rerendering")
        if (turn === undefined)
            return ;
        setIsPlaying(prev => !prev)
        setIsPlaying2(prev => !prev)
    }, [turn])
    return turn % 2 == 0 ? <div>{convertTime(timerPlayer1)}</div> : <div>{convertTime(timerPlayer2)}</div>
}

export default Timer