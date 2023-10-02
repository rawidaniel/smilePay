import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { CreateSmilePayServiceDto } from '../../smile-pay-service/dto/create-smile-pay-service.dto';

export class CreatePaymentModuleDto {
  @IsNumber()
  amount: number;
}

export class SmilePayApiDto extends PartialType(CreateSmilePayServiceDto) {
  @IsString()
  status: string;
}
