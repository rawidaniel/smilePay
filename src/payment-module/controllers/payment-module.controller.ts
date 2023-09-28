import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentModuleService } from '../services/payment-module.service';
import { CreatePaymentModuleDto } from '../dto/create-payment-module.dto';
import { UpdatePaymentModuleDto } from '../dto/update-payment-module.dto';

@Controller('payment-module')
export class PaymentModuleController {
  constructor(private readonly paymentModuleService: PaymentModuleService) {}

  @Post()
  create(@Body() createPaymentModuleDto: CreatePaymentModuleDto) {
    return this.paymentModuleService.create(createPaymentModuleDto);
  }
}
