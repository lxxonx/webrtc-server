import {
  Field,
  ID,
  ObjectType,
  FieldMiddleware,
  NextFn,
} from "@nestjs/graphql";
import { Class } from "src/classes/models/class.model";

const tutornameMiddleware: FieldMiddleware = async (_, next: NextFn) => {
  const username: string = await next();
  const value = username.slice(3);
  return value;
};

@ObjectType()
export class Tutor {
  @Field(() => ID)
  id: number;

  @Field(() => String, { middleware: [tutornameMiddleware] })
  username: string;

  @Field()
  firstname: string;

  @Field(() => String, { nullable: true })
  lastname?: string;

  @Field()
  birthYear: number;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => [Class], { nullable: true })
  classes?: [Class];
}
