import { Module } from "@nestjs/common";
import { ClassesService } from "./classes.service";
import { ClassesResolver } from "./classes.resolver";
import { ClassesGateway } from "./classes.gateway";

@Module({
  providers: [ClassesResolver, ClassesService, ClassesGateway],
})
export class ClassModule {}
