import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon2 from "argon2";
import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NewUserInput } from "./Dto/new-user.input";
import { LoginInput } from "./Dto/login.input";
import { LoginResponse } from "./Dto/loginResponse.model";
import { Student, Tutor } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async create_student({
    username,
    password,
    firstname,
    lastname,
    birthYear,
    leftClass,
  }: NewUserInput): Promise<Student> {
    try {
      const hash = await argon2.hash(password);
      return this.prisma.student.create({
        data: {
          password: hash,
          username,
          firstname,
          lastname,
          birthYear,
          leftClass,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async create_tutor({
    username,
    password,
    firstname,
    lastname,
    birthYear,
  }: NewUserInput): Promise<Tutor> {
    try {
      const tutor_username = `$t_${username}`;
      const hash = await argon2.hash(password);
      return this.prisma.tutor.create({
        data: {
          password: hash,
          username: tutor_username,
          firstname,
          lastname,
          birthYear,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }
  async login_tutor({
    username,
    password,
  }: LoginInput): Promise<LoginResponse> {
    let tutor: Tutor;
    const tutor_username = `$t_${username}`;
    try {
      tutor = await this.prisma.tutor.findUnique({
        where: {
          username: tutor_username,
        },
      });
    } catch (e) {
      if (e.code === "P2021") {
        throw new NotFoundException("user not found");
      }
      console.log(e);
    }

    try {
      if (!argon2.verify(tutor.password, password)) {
        throw new UnauthorizedException();
      }
      const accessToken = await this.jwt.signAsync(
        {
          tutorId: tutor.id,
        },
        { expiresIn: "2h", secret: process.env.JWT_ACCESS_TOKEN_SECRET }
      );
      const refreshToken = await this.jwt.signAsync(
        {
          tutorId: tutor.id,
        },
        { expiresIn: "7d", secret: process.env.JWT_ACCESS_TOKEN_SECRET }
      );

      return {
        accessToken,
        refreshToken,
        id: tutor.id,
      };
    } catch {
      return null;
    }
  }
  async login_student({
    username,
    password,
  }: LoginInput): Promise<LoginResponse> {
    let student: Student;
    try {
      student = await this.prisma.student.findUnique({
        where: {
          username,
        },
      });
    } catch (e) {
      if (e.code === "P2021") {
        throw new NotFoundException("user not found");
      }
      console.log(e);
    }

    try {
      if (!argon2.verify(student.password, password)) {
        throw new UnauthorizedException();
      }
      const accessToken = await this.jwt.signAsync(
        {
          studentId: student.id,
        },
        { expiresIn: "2h", secret: process.env.JWT_ACCESS_TOKEN_SECRET }
      );
      const refreshToken = await this.jwt.signAsync(
        {
          studentId: student.id,
        },
        { expiresIn: "7d", secret: process.env.JWT_ACCESS_TOKEN_SECRET }
      );

      return {
        accessToken,
        refreshToken,
        id: student.id,
      };
    } catch {
      return null;
    }
  }

  async findStudentById(id: number): Promise<Student> {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (student.deletedAt == null) {
      return student;
    }
    return null;
  }
  async findStudentByToken(token: string): Promise<Student> {
    const { studentId } = await this.jwt.verifyAsync(token, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
    if (!studentId) {
      throw new UnauthorizedException();
    }
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException();
    }
    if (student.deletedAt == null) {
      return student;
    }
    return null;
  }

  async findTutorById(id: number): Promise<Tutor> {
    return this.prisma.tutor.findUnique({ where: { id } });
  }
  async findTutorByToken(token: string): Promise<Tutor> {
    const { tutorId } = await this.jwt.verifyAsync(token, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
    if (!tutorId) {
      throw new UnauthorizedException();
    }
    const tutor = await this.prisma.tutor.findUnique({
      where: { id: tutorId },
    });
    if (!tutor) {
      throw new NotFoundException();
    }
    return tutor;
  }
  async findUserByToken(token: string): Promise<Student | Tutor> {
    const { tutorId, studentId } = await this.jwt.verifyAsync(token, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
    if (!tutorId && !studentId) {
      throw new UnauthorizedException();
    }
    if (tutorId) {
      const tutor = await this.prisma.tutor.findUnique({
        where: { id: tutorId },
      });
      if (!tutor) {
        throw new NotFoundException();
      }
      return tutor;
    }
    if (studentId) {
      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
      });
      if (!student) {
        throw new NotFoundException();
      }
      return student;
    }
  }
  // async findAll({ take, skip }: UsersArgs): Promise<User[]> {
  //   return this.prisma.user.findMany({
  //     where: {
  //       deletedAt: null,
  //     },
  //     take,
  //     skip,
  //     orderBy: { createdAt: "desc" },
  //   });
  // }

  // async remove(id: number): Promise<boolean> {
  //   try {
  //     await this.prisma.user.update({
  //       where: { id },
  //       data: {
  //         deletedAt: new Date(),
  //       },
  //     });
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // }
}
