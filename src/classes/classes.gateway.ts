import { UnauthorizedException } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { PrismaService } from "src/prisma/prisma.service";
import { ClassesService } from "./classes.service";

@WebSocketGateway(2000, {
  namespace: "stream",
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})
export class ClassesGateway {
  constructor(
    private readonly classesService: ClassesService,
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService
  ) {}
  @WebSocketServer()
  server: Server;

  private disconnect(client: Socket) {
    client.emit("Error", new UnauthorizedException());
    client.disconnect();
  }

  @SubscribeMessage("join-room")
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() { classId }
  ) {
    if (!classId) {
      return this.disconnect(client);
    }
    try {
      const tokens: string[] = client.handshake.headers.cookie.split("; ");
      tokens.forEach(async (t) => {
        const [key, token] = t.split("=");
        if (key === "refresh") {
          const decodedToken = await this.authService.findUserByToken(token);
          if (!decodedToken) {
            return this.disconnect(client);
          } else {
            const classInfo = await this.prismaService.class.findUnique({
              where: { id: classId },
            });
            if (decodedToken.username.startsWith("$t_")) {
              if (classInfo.tutorId !== decodedToken.id) {
                return this.disconnect(client);
              }
              await this.prismaService.class.update({
                where: { id: classId },
                data: {
                  tutorSocket: client.id,
                },
              });
              return client.emit("ready-student");
            } else {
              if (classInfo.studentId !== decodedToken.id) {
                return this.disconnect(client);
              }
              await this.prismaService.class.update({
                where: { id: classId },
                data: {
                  studentSocket: client.id,
                },
              });
              return client.emit("ready-student");
            }
          }
        }
      });
    } catch {
      return this.disconnect(client);
    }
  }

  @SubscribeMessage("answer-call")
  handleAnswerCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() { signal, classId }
  ) {
    if (!classId) {
      return this.disconnect(client);
    }
    try {
      const tokens: string[] = client.handshake.headers.cookie.split("; ");
      tokens.forEach(async (t) => {
        const [key, token] = t.split("=");
        if (key === "refresh") {
          const decodedToken = await this.authService.findUserByToken(token);
          if (!decodedToken) {
            return this.disconnect(client);
          } else {
            const classInfo = await this.prismaService.class.findUnique({
              where: { id: classId },
            });
            if (decodedToken.username.startsWith("$t_")) {
              if (classInfo.tutorId !== decodedToken.id) {
                return this.disconnect(client);
              }
              if (!classInfo.studentSocket) {
                return this.disconnect(client);
              }

              return this.server
                .to(classInfo.studentSocket)
                .emit("call-accepted", signal);
            } else {
              if (classInfo.studentId !== decodedToken.id) {
                return this.disconnect(client);
              }
              if (!classInfo.tutorSocket) {
                return this.disconnect(client);
              }

              return this.server
                .to(classInfo.tutorSocket)
                .emit("call-accepted", signal);
            }
          }
        }
      });
    } catch (e) {
      console.log(e);

      return this.disconnect(client);
    }
  }

  @SubscribeMessage("call-user")
  handleCallUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() { signal, classId }
  ) {
    if (!classId) {
      return this.disconnect(client);
    }
    try {
      const tokens: string[] = client.handshake.headers.cookie.split("; ");
      tokens.forEach(async (t) => {
        const [key, token] = t.split("=");
        if (key === "refresh") {
          const decodedToken = await this.authService.findUserByToken(token);
          if (!decodedToken) {
            return this.disconnect(client);
          } else {
            const classInfo = await this.prismaService.class.findUnique({
              where: { id: classId },
            });
            if (decodedToken.username.startsWith("$t_")) {
              if (classInfo.tutorId !== decodedToken.id) {
                return this.disconnect(client);
              }
              if (!classInfo.studentSocket) {
                return this.disconnect(client);
              }
              return this.server.to(classInfo.studentSocket).emit("call-init", {
                signal,
                name: decodedToken.username.slice(3),
              });
            } else {
              if (classInfo.studentId !== decodedToken.id) {
                return this.disconnect(client);
              }
              if (!classInfo.tutorSocket) {
                return this.disconnect(client);
              }
              return this.server
                .to(classInfo.tutorSocket)
                .emit("call-init", { signal, name: decodedToken.username });
            }
          }
        }
      });
    } catch (e) {
      console.log(e);
      return this.disconnect(client);
    }
  }

  // @SubscribeMessage("disconnect")
  // handleDisconnect(
  //   @ConnectedSocket() client: Socket,
  // @MessageBody() { signal, classId }
  // ) {
  // if (!classId) {
  //   return this.disconnect(client);
  // }
  // try {
  //   const tokens: string[] = client.handshake.headers.cookie.split("; ");
  //   tokens.forEach(async (t) => {
  //     const [key, token] = t.split("=");
  //     if (key === "refresh") {
  //       const decodedToken = await this.authService.findUserByToken(token);
  //       if (!decodedToken) {
  //         return this.disconnect(client);
  //       } else {
  //         const classInfo = await this.prismaService.class.findUnique({
  //           where: { id: classId },
  //         });
  //         if (decodedToken.username.startsWith("$t_")) {
  //           if (classInfo.tutorId !== decodedToken.id) {
  //             return this.disconnect(client);
  //           }
  //           if (!classInfo.studentSocket) {
  //             return this.disconnect(client);
  //           }
  //         } else {
  //           if (classInfo.studentId !== decodedToken.id) {
  //             return this.disconnect(client);
  //           }
  //           if (!classInfo.tutorSocket) {
  //             return this.disconnect(client);
  //           }
  //         }
  //       }
  //     }
  //   });
  // } catch {
  //   return this.disconnect(client);
  // }
  // }
}
