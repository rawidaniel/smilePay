import { Module } from '@nestjs/common';
import { DerashService } from './derash.service';
import { DerashController } from './derash.controller';

@Module({
  controllers: [DerashController],
  providers: [DerashService],
})
export class DerashModule {}
