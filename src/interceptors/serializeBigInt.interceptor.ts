import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export function SerializeBigInt() {
  return UseInterceptors(SerializeBigIntInterceptor);
}

export class SerializeBigIntInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        if (typeof data === 'object') {
          const replaced = JSON.stringify(data, (_, value) =>
            typeof value === 'bigint' ? value.toString() : value,
          );
          return replaced;
        }
        return data;
      }),
    );
  }
}
