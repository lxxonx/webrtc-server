import { Field, InputType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

@InputType()
export class NewClassInput {
  @Field()
  schedule: Date;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  tutorId?: number;
}
