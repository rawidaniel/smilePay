import { Test, TestingModule } from '@nestjs/testing';
import { DerashController } from './derash.controller';
import { DerashService } from './derash.service';

describe('DerashController', () => {
  let controller: DerashController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DerashController],
      providers: [DerashService],
    }).compile();

    controller = module.get<DerashController>(DerashController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
