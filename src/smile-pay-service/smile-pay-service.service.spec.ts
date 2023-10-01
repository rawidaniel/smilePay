import { Test, TestingModule } from '@nestjs/testing';
import { SmilePayServiceService } from './smile-pay-service.service';

describe('SmilePayServiceService', () => {
  let service: SmilePayServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmilePayServiceService],
    }).compile();

    service = module.get<SmilePayServiceService>(SmilePayServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
