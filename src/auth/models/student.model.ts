import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Class } from "src/classes/models/class.model";

@ObjectType()
export class Student {
  @Field(() => ID)
  id: number;

  @Field(() => ID)
  username: string;

  @Field()
  firstname: string;

  @Field(() => String, { nullable: true })
  lastname?: string;

  @Field()
  birthYear: number;

  @Field(() => Number, { defaultValue: 0 })
  leftClass: number;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field(() => [Class], { nullable: true })
  classes?: [Class];
}
