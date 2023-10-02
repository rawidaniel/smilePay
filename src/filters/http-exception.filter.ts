import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const errorResponse = exception.getResponse() as any;
    // const { statusCode, message } = errorResponse;
    const statusCode = errorResponse.statusCode || exception.getStatus();
    const message = errorResponse.message || errorResponse;

    response.status(exception.getStatus()).json({
      statusCode,
      message,
    });
  }
}
