import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import * as PgSession from 'connect-pg-simple';
import * as Redis from 'redis';
import { promisify } from 'util';

async function bootstrap() {
  const pgPool = new Pool({
    // Your PostgreSQL configuration here
    user: 'smilepay',
    host: 'localhost',
    database: 'smilepay',
    password: 'smilepay',
    port: 5433,
  });
  const PgStore = PgSession(session);
  // const redisClient = Redis.createClient();
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.use(
    session({
      store: new PgStore({
        pool: pgPool,
        tableName: 'session',
      }),
      secret: configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: configService.get('NODE_ENV') === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    }),
  );

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
  const PORT = 3000;
  await app.listen(PORT).then(() => {
    Logger.log(`Server running on http://localhost:${PORT}`, 'Bootstrap');
    Logger.log(`Swagger running on http://localhost:${PORT}/api`, 'Bootstrap');
  });
}
bootstrap();
