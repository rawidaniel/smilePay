import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
export class CustomerBillDataDto {
  @ApiProperty({
    type: String,
    example: '1263582990003',
    description: 'The manifest id of the customer',
  })
  @IsString()
  @IsNotEmpty()
  manifest_id: string;
  @ApiProperty({
    type: String,
    example: '1263582990003',
    description: 'The bill id of the customer',
  })
  @IsString()
  @IsNotEmpty()
  bill_id: string;
  @ApiProperty({
    type: String,
    example: '390432.20',
    description: 'The customer transaction amount',
  })
  @IsString()
  @IsNotEmpty()
  amount: string;
  @ApiProperty({
    type: String,
    example: '390432.20',
    description: 'The customer paid time',
  })
  @IsString()
  @IsNotEmpty()
  paid_dt: string;
  @ApiProperty({
    type: String,
    example: '0911987654',
    description: 'The customer mobile number',
  })
  @IsString()
  @IsNotEmpty()
  payee_mobile: string;
  @ApiProperty({
    type: String,
    example: 'Arat Kilo branch',
    description: 'The transaction take place',
  })
  @IsString()
  @IsNotEmpty()
  paid_at: string;
  @ApiProperty({
    type: String,
    example: '1263582990003',
    description: 'The transaction code',
  })
  @IsString()
  @IsNotEmpty()
  txn_code: string;
}
