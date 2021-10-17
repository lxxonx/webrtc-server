import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Class } from "src/classes/models/class.model";

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  text: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  deletedAt: Date;

  @Field(() => String)
  classId: string;

  @Field(() => Class)
  class: Class;
}
