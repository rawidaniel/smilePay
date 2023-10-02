import { Injectable, NestMiddleware } from '@nestjs/common';
import * as passport from 'passport';

@Injectable()
export class PassportMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    passport.initialize()(req, res, () => {
      passport.session()(req, res, next);
    });
  }
}
