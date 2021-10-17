import { Field, InputType } from "@nestjs/graphql";
import { MaxLength } from "class-validator";

@InputType()
export class LoginInput {
  @Field()
  @MaxLength(20)
  username: string;

  @Field()
  @MaxLength(20)
  password: string;

  @Field(() => Boolean, { defaultValue: false })
  isTutor: Boolean;
}
