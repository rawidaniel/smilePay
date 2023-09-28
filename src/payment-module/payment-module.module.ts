import { Module } from '@nestjs/common';
import { PaymentModuleService } from './services/payment-module.service';
import { PaymentModuleController } from './controllers/payment-module.controller';

@Module({
  controllers: [PaymentModuleController],
  providers: [PaymentModuleService],
})
export class PaymentModuleModule {}
