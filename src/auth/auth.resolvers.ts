import { NotFoundException } from "@nestjs/common";
import { Mutation, Args, Resolver, Context, Query } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { LoginInput } from "./Dto/login.input";
import { NewUserInput } from "./Dto/new-user.input";
import { Student } from "./models/student.model";
import { Tutor } from "./models/tutor.model";
import { FieldError } from "../common/Dto/fieldError.model";
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // tutor resolvers
  @Query(() => Tutor)
  async getTutorById(@Args("id") id: number): Promise<Tutor> {
    const tutor = await this.authService.findTutorById(id);
    if (!tutor) {
      throw new NotFoundException(id);
    }
    return tutor;
  }
  @Mutation(() => Tutor)
  async createTutor(
    @Args("newTutorData") newTutorData: NewUserInput
  ): Promise<Tutor> {
    const tutor = await this.authService.create_tutor(newTutorData);
    return tutor;
  }
  @Mutation(() => Tutor)
  async loginTutor(
    @Args("loginInput") loginInput: LoginInput,
    @Context() { response }
  ): Promise<Tutor> {
    const { accessToken, refreshToken, id } =
      await this.authService.login_tutor(loginInput);
    response.setCookie("token", accessToken, {
      maxAge: 60 * 60 * 2,
    });
    response.setCookie("refresh", refreshToken, {
      maxAge: 60 * 60 * 24 * 7,
    });
    return this.getTutorById(id);
  }

  // student resolvers
  @Query(() => Student)
  async getStudentById(@Args("id") id: number): Promise<Student> {
    const student = await this.authService.findStudentById(id);
    if (!student) {
      throw new NotFoundException(id);
    }
    return student;
  }
  @Mutation(() => Student)
  async createStudent(
    @Args("newStudentData") newStudentData: NewUserInput
  ): Promise<Student> {
    const student = await this.authService.create_student(newStudentData);
    return student;
  }
  @Mutation(() => Student)
  async loginStudent(
    @Args("loginInput") loginInput: LoginInput,
    @Context() { response }
  ): Promise<Student> {
    const { accessToken, refreshToken, id } =
      await this.authService.login_student(loginInput);
    response.setCookie("token", accessToken, {
      maxAge: 60 * 60 * 2,
    });
    response.setCookie("refresh", refreshToken, {
      maxAge: 60 * 60 * 24 * 7,
    });
    return this.getStudentById(id);
  }

  // common resolvers
  @Mutation(() => Boolean)
  async logout(@Context() { response }) {
    try {
      response.clearCookie("token");
      response.clearCookie("refresh");
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  @Query(() => Tutor || Student || FieldError)
  async getCurrentUser(@Context() { response }) {
    return this.authService.findUserByToken(
      response.request.cookies["refresh"]
    );
  }
}
