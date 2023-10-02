import {
  Controller,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SmilePayServiceService } from './smile-pay-service.service';
import {
  CreateSmilePayServiceDto,
  ReversetTransaction,
  SmileQueryDto,
} from './dto/create-smile-pay-service.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('smile-pay-service')
@Controller('smile-pay-service')
export class SmilePayServiceController {
  constructor(
    private readonly smilePayServiceService: SmilePayServiceService,
  ) {}

  @Post()
  create(
    @Body() createSmilePayServiceDto: CreateSmilePayServiceDto,
    @Query() query: SmileQueryDto,
  ) {
    return this.smilePayServiceService.initiatePayment(
      createSmilePayServiceDto,
      query.status,
    );
  }

  @Post('reverse')
  @HttpCode(HttpStatus.OK)
  reverseTransaction(@Body() transactionCode: ReversetTransaction) {
    return this.smilePayServiceService.reverseTransaction(transactionCode);
  }
}
