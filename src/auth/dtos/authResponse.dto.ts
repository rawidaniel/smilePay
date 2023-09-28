import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({
    type: String,
    example: 'test@gmail.com',
    description: 'The email address of the user',
  })
  email: string;
  @ApiProperty({
    type: String,
    example: 'Jhon Ramsea',
    description: 'The full name of the user',
  })
  fullName: string;
  @ApiProperty({
    type: String,
    example: '1678905432',
    description: 'The smile id  of the user',
  })
  smile_id: bigint;
  @ApiProperty({
    type: String,
    example: 'Account type',
    description: 'The account type of the user',
  })
  account_type: string;
}
