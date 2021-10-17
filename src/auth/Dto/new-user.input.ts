import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, MaxLength } from "class-validator";

@InputType()
export class NewUserInput {
  @Field()
  @MaxLength(20)
  username: string;

  @Field()
  @MaxLength(20)
  password: string;

  @Field()
  @MaxLength(20)
  firstname: string;

  @Field({ nullable: true })
  @MaxLength(20)
  lastname: string;

  @Field()
  birthYear: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  leftClass?: number;
}
