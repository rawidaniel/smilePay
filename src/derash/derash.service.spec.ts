import { Test, TestingModule } from '@nestjs/testing';
import { DerashService } from './derash.service';

describe('DerashService', () => {
  let service: DerashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DerashService],
    }).compile();

    service = module.get<DerashService>(DerashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
