import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field(() => Boolean)
  error: boolean;

  @Field()
  message: string;
}
