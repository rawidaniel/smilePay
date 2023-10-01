import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SmilePayServiceModule } from './smile-pay-service/smile-pay-service.module';
import { PaymentModuleModule } from './payment-module/payment-module.module';
import { DerashModule } from './derash/derash.module';


@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot(),
    SmilePayServiceModule,
    PaymentModuleModule,
    DerashModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
