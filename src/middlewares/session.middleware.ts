import { Injectable, NestMiddleware } from '@nestjs/common';
import * as session from 'express-session';
import { Pool } from 'pg';
import * as PgSession from 'connect-pg-simple';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: any, res: any, next: () => void) {
    const pgPool = new Pool({
      user: 'smilepay',
      host: 'localhost',
      database: 'smilepay',
      password: 'smilepay',
      port: 5433,
    });
    const PgStore = PgSession(session);

    const sessionOptions = {
      store: new PgStore({
        pool: pgPool,
        tableName: 'session',
      }),
      secret: this.configService.get('SESSION_SECRET'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: this.configService.get('NODE_ENV') === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    };
    session(sessionOptions)(req, res, next);
  }
}
