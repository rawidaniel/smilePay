import { Module } from '@nestjs/common';
import { PaymentModuleService } from './services/payment-module.service';
import { PaymentModuleController } from './controllers/payment-module.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [PaymentModuleController],
  providers: [PaymentModuleService],
})
export class PaymentModuleModule {}
