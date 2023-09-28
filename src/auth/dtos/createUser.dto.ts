import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsBigInt } from '../decorators/isBigInt.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'test@gmail.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    type: String,
    example: 'Jhon Ramsea',
    description: 'The full name of the user',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;
  @ApiProperty({
    type: String,
    example: '12345',
    description: 'The password of the user',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
  @ApiProperty({
    type: String,
    example: '1678905432',
    description: 'The smile id  of the user',
  })
  @IsBigInt()
  smile_id: bigint;
  @ApiProperty({
    type: String,
    example: 'Account type',
    description: 'The account type of the user',
  })
  @IsNotEmpty()
  @IsString()
  account_type: string;
}
