import React from 'react';

export const connectSocket = (url) =>{
    const socket = new WebSocket(url);
    return (socket);
}