import {
  Controller,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  HttpException,
} from '@nestjs/common';
import { DerashService } from './derash.service';
import { QueryDto } from './dtos/query.dto';
import { CustomerBillDataDto } from './dtos/customerBillData.dto';
import { ApiTags, ApiHeader } from '@nestjs/swagger';

@ApiHeader({
  name: 'api-key',
  description: 'API Key Authentication',
  required: true,
})
@ApiHeader({
  name: 'api-secret',
  description: 'API Secret Authentication',
  required: true,
})
@ApiTags('agent')
@Controller('agent/customer-bill-data')
export class DerashController {
  constructor(private readonly derashService: DerashService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async createCustomerBillData(
    @Query() query: QueryDto,
    @Body() body: CustomerBillDataDto,
    @Request() req,
  ) {
    if (!req.headers['api-key'] || !req.headers['api-secret']) {
      throw new HttpException('Please provide your api-key or api-secret', 400);
    }
    return this.derashService.createCustomerBillData(query, body);
  }

  @Get()
  async getCustomerBillData(@Query() query: QueryDto, @Request() req) {
    if (!req.headers['api-key'] || !req.headers['api-secret']) {
      throw new HttpException('Please provide your api-key or api-secret', 400);
    }
    return this.derashService.getCustomerBillData(query);
  }
}
