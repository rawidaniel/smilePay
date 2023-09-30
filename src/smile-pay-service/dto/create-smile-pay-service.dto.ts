import { IsPositive, IsUUID } from 'class-validator';

export class CreateSmilePayServiceDto {
  @IsUUID()
  userId: string;

  @IsPositive()
  amount: number;
}

export class ReverseSmilePayServiceDto {
  @IsUUID()
  transactionCode: string;
}
