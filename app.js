import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { create } from "domain";
import { Socket } from "dgram";

const port = 4000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
     cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(
     cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    })
)

io.on("connection", (socket) => {
    socket.on('join-room', (room) => {
        socket.join(room);
    });

    socket.on("delete-for-everyone", ({room, id}) => {
        io.to(room).emit("delete-message", id);
    })

    socket.on("music", ({query, room}) => {
        io.to(room).emit("play-music", query);
    })

    socket.on("message", ({ newMsg, room, Id }) => {
        socket.to(room).emit("recieve-message", {newMsg, Id});
    });

})

server.listen(port, () => {
    console.log(`server is running on port ${port}`);
})