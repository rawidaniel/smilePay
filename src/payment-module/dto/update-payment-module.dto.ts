import { PartialType } from '@nestjs/swagger';
import { CreatePaymentModuleDto } from './create-payment-module.dto';

export class UpdatePaymentModuleDto extends PartialType(
  CreatePaymentModuleDto,
) {}
