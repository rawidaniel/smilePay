import {
  Controller,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Param,
  Request,
  HttpException,
} from '@nestjs/common';
import { DerashService } from './derash.service';
import { QueryDto } from './dtos/query.dto';
import { CustomerBillDataDto } from './dtos/customerBillData.dto';
import { ApiTags, ApiHeader } from '@nestjs/swagger';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

// @UseGuards(AuthenticatedGuard)
@ApiHeader({
  name: 'api-key',
  description: 'API Key Authentication',
  // required: true, // This indicates that the header is mandatory.
})
@ApiHeader({
  name: 'api-secret',
  description: 'API Secret Authentication',
  // re quired: true,
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
    console.log(req.headers['api-key']);
    if (!req.headers['api-key'] || !req.headers['api-secret']) {
      throw new HttpException('Please provide your api-key or api-secret', 400);
    }
    return this.derashService.createCustomerBillData(query, body);
  }

  @Get()
  async getCustomerBillData(@Query() query: QueryDto, @Request() req) {
    console.log('param', query);

    if (!req.headers['api-key'] || !req.headers['api-secret']) {
      throw new HttpException('Please provide your api-key or api-secret', 400);
    }
    console.log(req.headers);
    return this.derashService.getCustomerBillData(query);
  }
}
