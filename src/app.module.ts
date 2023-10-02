import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SmilePayServiceModule } from './smile-pay-service/smile-pay-service.module';
import { PaymentModuleModule } from './payment-module/payment-module.module';
import { DerashModule } from './derash/derash.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { SessionMiddleware } from './middlewares/session.middleware';
import { PassportMiddleware } from './middlewares/passport.middleware';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SmilePayServiceModule,
    PaymentModuleModule,
    DerashModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware, PassportMiddleware).forRoutes('*'); // Apply for all routes
  }
}
