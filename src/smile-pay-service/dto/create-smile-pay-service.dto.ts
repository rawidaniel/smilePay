import { IsNotEmpty, IsPositive, IsString, IsUUID } from 'class-validator';
import exp from 'constants';

export class CreateSmilePayServiceDto {
  @IsPositive()
  amount: number;
}

export class ReverseSmilePayServiceDto {
  @IsUUID()
  transactionCode: string;
}

export class QueryDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
