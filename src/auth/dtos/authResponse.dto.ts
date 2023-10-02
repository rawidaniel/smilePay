import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty({
    type: String,
    example: '1ee60fbc-bf4e-6b5c-9ef4-e9f1ced1a1ed',
    description: 'The unique identifier of user',
  })
  id: string;
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
    example: '340.56',
    description: 'The balance of the user',
  })
  balance: number;
  @ApiProperty({
    type: String,
    example: 'Account type',
    description: 'The account type of the user',
  })
  account_type: string;

  @ApiProperty({
    type: String,
    example: '2023-10-02 11:09:22',
    description: 'The date the user was created',
  })
  created_at: Date;

  @ApiProperty({
    type: String,
    example: '2023-10-02 11:09:22',
    description: 'The date the user was updated',
  })
  last_updated: Date;
}
