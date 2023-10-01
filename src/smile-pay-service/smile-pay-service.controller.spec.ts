import { Test, TestingModule } from '@nestjs/testing';
import { SmilePayServiceController } from './smile-pay-service.controller';
import { SmilePayServiceService } from './smile-pay-service.service';

describe('SmilePayServiceController', () => {
  let controller: SmilePayServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmilePayServiceController],
      providers: [SmilePayServiceService],
    }).compile();

    controller = module.get<SmilePayServiceController>(
      SmilePayServiceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
