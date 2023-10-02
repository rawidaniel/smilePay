import { IsNotEmpty, IsPositive, IsString, IsUUID } from 'class-validator';
import exp from 'constants';

export class CreateSmilePayServiceDto {
  @IsPositive()
  amount: number;

  @IsString()
  userId: string;
}

export class ReverseSmilePayServiceDto {
  @IsUUID()
  transactionCode: string;
}

export class PaymentQueryDto {
  @IsString()
  @IsNotEmpty()
  statusOne: string;

  @IsString()
  @IsNotEmpty()
  statusTwo: string;
}

export class SmileQueryDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class ReversetTransaction {
  @IsString()
  transactionCode: string;
}
