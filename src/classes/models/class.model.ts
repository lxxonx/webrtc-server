import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Student } from "src/auth/models/student.model";
import { Tutor } from "src/auth/models/tutor.model";
import { Message } from "src/messages/models/messge.model";

@ObjectType()
export class Class {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  videoUrl?: string;

  @Field(() => Date)
  schedule: Date;

  @Field(() => Boolean)
  isCreated: Boolean;

  @Field(() => Number, { nullable: true })
  studentId?: number;

  @Field(() => Student, { nullable: true })
  student?: Student;

  @Field(() => Number)
  tutorId: number;

  @Field(() => Tutor)
  tutor: Tutor;

  @Field(() => [Message])
  messages?: [Message];
}
