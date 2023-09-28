import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SiginDto {
  @ApiProperty({
    type: String,
    example: 'test@gmail.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    type: String,
    example: '12345',
    description: 'The password of the user',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
