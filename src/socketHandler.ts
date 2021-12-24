import dayjs from "dayjs";
import { Socket } from "socket.io";
import prisma from "./prisma";
import jwt from "./utils/jwt";

const socketHandler = async (socket: Socket) => {
  if (!socket.handshake.headers.authorization) {
    socket.to(socket.id).emit("error", "Not Authorized");
    return socket.disconnect();
  }
  const authToken =
    socket.handshake.headers.authorization?.split("Bearer ")[1] || "";

  const result = jwt.verify(authToken);
  if (result.ok === false) {
    return socket.emit("unauthorized", {
      ok: false,
      message: result.message,
    });
  }
  const user = await prisma.user.findUnique({
    where: {
      id: result.userId,
    },
    select: {
      role: true,
      studentSession: {
        where: {
          schedule: { gt: dayjs().subtract(15, "m").toDate() },
        },
        orderBy: {
          schedule: "asc",
        },
        take: 1,
      },
      tutorSession: true,
    },
  });
  if (!user) {
    socket.to(socket.id).emit("error", "Not Authorized");
    return socket.disconnect();
  }
  if (!user?.studentSession[0]) {
    socket.to(socket.id).emit("error", "Not Authorized");
    return socket.disconnect();
  }
  if (user?.studentSession[0]?.schedule <= dayjs().subtract(15, "m").toDate()) {
    socket.to(socket.id).emit("error", "Not Authorized");
    return socket.disconnect();
  }
  const roomID = user?.studentSession[0].id || user?.tutorSession[0].id;
  socket.emit("message", "welcome");

  socket.on("joinRoom", async () => {
    await socket.join(roomID);
    console.log("joinRoom");
    socket.nsp.to(roomID).emit("welcome", roomID);
  });
  socket.on("offer", (offer) => {
    console.log("offer");
    socket.nsp.to(roomID).emit("offer", offer);
  });
  socket.on("answer", (answer) => {
    socket.nsp.to(roomID).emit("answer", answer);
  });
  socket.on("ice", (ice) => {
    socket.nsp.to(roomID).emit("ice", ice);
  });
  socket.on("disconnecting", () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit("user has left", socket.id);
      }
    }
  });

  return;
};

export default socketHandler;
