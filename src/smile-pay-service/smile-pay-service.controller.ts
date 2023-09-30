import { Controller, Post, Body } from '@nestjs/common';
import { SmilePayServiceService } from './smile-pay-service.service';
import { CreateSmilePayServiceDto } from './dto/create-smile-pay-service.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('smile-pay-service')
@Controller('smile-pay-service')
export class SmilePayServiceController {
  constructor(
    private readonly smilePayServiceService: SmilePayServiceService,
  ) {}

  @Post()
  create(@Body() createSmilePayServiceDto: CreateSmilePayServiceDto) {
    return this.smilePayServiceService.initiatePayment(
      createSmilePayServiceDto,
    );
  }

  @Post('reverse')
  reverseTransaction(@Body() transactionCode: string) {
    return this.smilePayServiceService.reverseTransaction(transactionCode);
  }
}
