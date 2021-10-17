import { BadRequestException } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthService } from "src/auth/auth.service";
import { PrismaService } from "src/prisma/prisma.service";
import { Class } from "./models/class.model";
import { ClassesService } from "./classes.service";

@Resolver()
export class ClassesResolver {
  constructor(
    private readonly classesService: ClassesService,
    private readonly authService: AuthService,
    private readonly prisma: PrismaService
  ) {}

  // tutor side
  @Mutation(() => Class)
  async createClass(
    @Args("schedule") schedule: Date,
    @Context() { request }
  ): Promise<Class> {
    const token = request.cookies.refresh;
    if (!token) {
      return null;
    }
    const user = await this.authService.findUserByToken(token);
    if (!user.username.startsWith("$t_")) {
      throw new BadRequestException();
    }

    return this.prisma.class.create({
      data: {
        schedule,
        tutorId: user.id,
      },
      include: { tutor: true },
    });
  }

  @Query(() => [Class])
  async getManyClassesByTutor(@Context() { request }): Promise<Array<Class>> {
    // get class list by tutor
    const token = request.cookies.refresh;
    if (!token) {
      throw new UnauthorizedException();
    }
    const user = await this.authService.findUserByToken(token);
    // not tutor? throw error
    if (!user) {
      throw new BadRequestException();
    }
    if (user.username.startsWith("$t_")) {
      // if user is a tutor
      return this.prisma.class.findMany({
        where: { tutorId: user.id },
        include: { student: true, tutor: true },
      });
    } else {
      // if user is a student
      return this.prisma.class.findMany({
        where: { studentId: user.id },
        include: { student: true, tutor: true },
      });
    }
  }

  // // student side
  // @Mutation(() => Class)
  // async updateStudent(
  //   @Args("schedule") schedule: Date,
  //   @Args("tutorId", { nullable: true }) tutorId: number,
  //   @Args("studentId", { nullable: true }) studentId: number,
  //   @Context() { request }
  // ) {
  //   // register students
  //   const token = request.cookies.refresh;
  //   if (!token) {
  //     return null;
  //   }
  //   const user = await this.authService.findUserByToken(token);
  //   if (user.isTutor) {
  //     // when this user is tutor
  //     if (!studentId) {
  //       // studentId must be provided
  //       throw new BadRequestException();
  //     }
  //     // add student id to session
  //     return this.prisma.class.update({
  //       where: {
  //         schedule_tutorId: {
  //           schedule,
  //           tutorId: user.id,
  //         },
  //       },
  //       data: {
  //         studentId,
  //       },
  //     });
  //   } else {
  //     // when this user is student
  //     if (!tutorId) {
  //       // tutor id must be provided
  //       throw new BadRequestException();
  //     }
  //     // update this user id to session
  //     return this.prisma.class.update({
  //       where: {
  //         schedule_tutorId: {
  //           schedule,
  //           tutorId,
  //         },
  //       },
  //       data: {
  //         studentId: user.id,
  //       },
  //     });
  //   }
  // }

  createRoom() {
    // create room id
  }
  uploadVideo() {
    // upload video link
  }
}
