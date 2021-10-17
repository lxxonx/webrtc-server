import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => String)
  refreshToken: string;

  @Field()
  id: number;
}
