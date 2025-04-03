import {Server} from 'socket.io';
import http from 'http';
import express from 'express';// Import your Message model
import {removeonlineusers} from '../controllers/onlineusers.controller.js'
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
    }
});
const activeUsers = new Map(); // { userId: socketId }
export const getsocketid =(userid)=>{
    return activeUsers[userid];
}
// Track active users

io.on('connection', (socket) => {
    const id = socket.handshake.query.userId;
    activeUsers[id] = socket.id;
    // console.log(activeUsers)
    io.emit('getOnlineUsers',Object.keys(activeUsers));
    socket.on('disconnect', async() => {
        delete activeUsers[id];
        console.log('socket disconnedcted',id);
        await removeonlineusers(id);
        io.emit('getOnlineUsers',Object.keys(activeUsers));
    });
});

export {app, server, io};