import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { SmilePayServiceService } from './smile-pay-service.service';
import {
  CreateSmilePayServiceDto,
  ReverseSmilePayServiceDto,
  ReversetTransaction,
  SmileQueryDto,
} from './dto/create-smile-pay-service.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';

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
  reverseTransaction(@Body() transactionCode: ReversetTransaction) {
    return this.smilePayServiceService.reverseTransaction(transactionCode);
  }
}
