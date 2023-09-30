import { PartialType } from '@nestjs/swagger';
import { CreateSmilePayServiceDto } from './create-smile-pay-service.dto';

export class UpdateSmilePayServiceDto extends PartialType(
  CreateSmilePayServiceDto,
) {}
