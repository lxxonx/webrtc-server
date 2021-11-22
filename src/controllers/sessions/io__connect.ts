import { Request } from "express";
import { Socket } from "socket.io";

const io__connect = async (req: Request) => {
  const io = req.app.get("io");

  io.on("connection", (socket: Socket) => {
    socket.on("join_room", (roomName) => {
      socket.join(roomName);
      socket.to(roomName).emit("welcome");
    });
    socket.on("offer", (offer, roomName) => {
      socket.to(roomName).emit("offer", offer);
    });
    socket.on("answer", (answer, roomName) => {
      socket.to(roomName).emit("answer", answer);
    });
    socket.on("ice", (ice, roomName) => {
      socket.to(roomName).emit("ice", ice);
    });
  });
};

export default io__connect;
