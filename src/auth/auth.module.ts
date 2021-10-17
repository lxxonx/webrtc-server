import { Global, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthResolver } from "./auth.resolvers";
import { AuthService } from "./auth.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    }),
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
@Global()
export class AuthModule {}
