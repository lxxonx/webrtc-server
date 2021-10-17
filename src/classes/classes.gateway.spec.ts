import { Test, TestingModule } from "@nestjs/testing";
import { ClassesGateway } from "./classes.gateway";
import { ClassesService } from "./classes.service";

describe("ClassesGateway", () => {
  let gateway: ClassesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassesGateway, ClassesService],
    }).compile();

    gateway = module.get<ClassesGateway>(ClassesGateway);
  });

  it("should be defined", () => {
    expect(gateway).toBeDefined();
  });
});
