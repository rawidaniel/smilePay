import { Injectable } from '@nestjs/common';
import { CreatePaymentModuleDto } from '../dto/create-payment-module.dto';

@Injectable()
export class PaymentModuleService {
  create(createPaymentModuleDto: CreatePaymentModuleDto) {}
}
