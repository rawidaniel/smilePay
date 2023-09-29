import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponse({ description: 'Shows the status of the server' })
  @Get('/status')
  status() {
    return { status: 'OK!' };
  }

  @Get('/error')
  throwError() {
    throw new Error('this is test error');
  }
}
