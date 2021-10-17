import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { PrismaService } from "src/prisma/prisma.service";
import { Class } from "./models/class.model";

@Injectable()
export class ClassesService {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService
  ) {}

  async createClass(tutorId: number, schedule: Date): Promise<Class> {
    return this.prisma.class.create({
      data: {
        schedule,
        tutorId,
      },
      include: { tutor: true },
    });
  }

  async updateStudent(studentId: number, tutorId: number, schedule: Date) {
    // 이미 학생이 등록되었으면 등록 못하도록
    return this.prisma.class.update({
      where: {
        schedule_tutorId: {
          schedule,
          tutorId,
        },
      },
      data: {
        studentId,
      },
    });
  }
}
