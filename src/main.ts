import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SentryFilter } from './filters/sentry.filter';
import * as Sentry from '@sentry/node';

import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as Redis from 'redis';
import { promisify } from 'util';

async function bootstrap() {
  // const redisClient = Redis.createClient();
  const app = await NestFactory.create(AppModule);

  Sentry.init({
    dsn: process.env.SENTRY_DNS,
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new SentryFilter(httpAdapter));

  // app.use(async (req, res, next) => {
  //   const sessionId = req.session.id;

  //   // Check Redis for the session
  //   const getAsync = promisify(redisClient.get).bind(redisClient);
  //   const sessionData = await getAsync(sessionId);

  //   if (sessionData) {
  //     console.log('Session found in Redis', sessionId);
  //     req.session = JSON.parse(sessionData);
  //   } else {
  //     // If not in Redis, it'll be fetched from PostgreSQL by express-session
  //     // Save this session data to Redis for next time
  //     console.log('Session not found in Redis', req.session);
  //     redisClient.set(sessionId, JSON.stringify(req.session));
  //   }

  //   next();
  // });

  // redisClient.on('error', (err) => {
  //   console.error('Redis error:', err);
  // });

  // redisClient.on('end', () => {
  //   console.log('Redis client disconnected');
  // });

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    origin: '*',
  });

  // app.use(passport.initialize());
  // app.use(passport.session());

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
