import express from "express";
import http from "http";
import { Server } from "socket.io";
import { isMember, isRoomExists } from "./lib/utils.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://infinity-chat-frontend.onrender.com",
  },
});
const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
  socket.on("check-room", ({ roomId }, callback) => {
    callback(isRoomExists(io, roomId));
  });

  socket.on("create-room", ({ roomId }, callback) => {
    socket.join(roomId);
    callback(roomId);
    const room = io.sockets.adapter.rooms.get(roomId);
    const members = room ? room.size : 0;
    io.to(roomId).emit("set-members", { members });
    setTimeout(() => {
      socket.emit("send-popup", { message: "Successfully created Room." });
    }, 100);
  });

  socket.on("get-members", ({ roomId }) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    const members = room ? room.size : 0;
    socket.emit("set-members", { members });
  });

  socket.on("join-room", ({ roomId, userName = "Anonymous" }, callback) => {
    socket.join(roomId);
    callback(true);
    const room = io.sockets.adapter.rooms.get(roomId);
    const members = room ? room.size : 0;
    io.to(roomId).emit("set-members", { members });
    io.to(roomId).emit("send-popup", {
      message: `${userName} joined the room.`,
    });
  });

  socket.on("message", ({ roomId, message }, callback) => {
    if (isRoomExists(io, roomId)) {
      if (isMember(io, roomId, socket)) {
        socket.to(roomId).emit("broadcast", { message });
        console.log("message received: " + JSON.stringify(message));
        callback({ success: true, message: "Message sent successfully." });
      } else {
        callback({
          success: false,
          message: `You are not the member of the room.`,
        });
      }
    } else {
      callback({ success: false, message: `Room doesn't exist.` });
    }
  });

  socket.on("leave-room", ({ roomId, userName = "Anonymous" }, callback) => {
    if (isRoomExists(io, roomId)) {
      socket.leave(roomId);
      callback({ success: true, message: "You left the room." });
      setTimeout(() => {
        const room = io.sockets.adapter.rooms.get(roomId);
        const members = room?.size || 0;
        io.to(roomId).emit("set-members", { members });
      }, 0);
      io.to(roomId).emit("send-popup", {
        message: `${userName} left the room.`,
      });
    } else {
      callback({ success: false, message: "Room not exist." });
    }
  });

  socket.on("close-room", ({ roomId, userRole }, callback) => {
    if (userRole !== "admin") {
      callback({ success: false, message: "Only admin can close the room." });
      return;
    }
    if (!isRoomExists(io, roomId)) {
      callback({ success: false, message: "Room doesn't Exists." });
      return;
    }
    // Notify all users in the room
    io.to(roomId).emit("room-closed", { message: "The room is closed." });
    const room = io.sockets.adapter.rooms.get(roomId);
    if (room) {
      // Remove all users from the room
      for (const socketId of room) {
        const socket = io.sockets.sockets.get(socketId);
        if (socket) socket.leave(roomId);
      }
    }
    callback({ success: true, message: "The room is closed." });
  });

  socket.on("disconnecting", () => {
    // For each room the socket is in, emit updated members count
    socket.rooms.forEach((roomId) => {
      if (roomId !== socket.id) {
        setTimeout(() => {
          const room = io.sockets.adapter.rooms.get(roomId);
          const members = room ? room.size : 0;
          io.to(roomId).emit("set-members", { members });
        }, 0);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});
