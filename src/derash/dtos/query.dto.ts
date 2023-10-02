import { IsNotEmpty, IsString } from 'class-validator';

export class QueryDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  biller_id: string;

  @IsString()
  @IsNotEmpty()
  bill_id: string;
}
