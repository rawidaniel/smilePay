import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

// interface ClassConstructor {
//   new (...args: any[]): {};
// }

export function Seralize(dto: any) {
  return UseInterceptors(new SeralizeInterceptor(dto));
}

export class SeralizeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        const deserializeUser = plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });

        return deserializeUser;
      }),
    );
  }
}
