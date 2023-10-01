import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SentryFilter } from './filters/sentry.filter';
import * as Sentry from '@sentry/node';

import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  Sentry.init({
    dsn: process.env.SENTRY_DNS,
  });

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryFilter(httpAdapter));
  app.use(
    session({
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        // maxAge: 6000,
        // httpOnly: true,
        // secure: true,
      },
    }),
  );

  app.enableCors({
    origin: '*',
  });

  app.use(passport.initialize());
  app.use(passport.session());

  const config = new DocumentBuilder()
    .addCookieAuth()
    .setTitle('SmilePay API')
    .setDescription('SmilePay API description')
    .setVersion('1.0')
    .addTag('SmilePay')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT).then(() => {
    Logger.log(`Server running on http://localhost:${PORT}`, 'Bootstrap');
    Logger.log(`Swagger running on http://localhost:${PORT}/api`, 'Bootstrap');
  });
}
bootstrap();
