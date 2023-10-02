import { Module } from '@nestjs/common';
import { SmilePayServiceService } from './smile-pay-service.service';
import { SmilePayServiceController } from './smile-pay-service.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [SmilePayServiceController],
  providers: [SmilePayServiceService],
})
export class SmilePayServiceModule {}
