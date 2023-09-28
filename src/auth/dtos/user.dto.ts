import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  email: string;
  @Expose()
  fullName: string;
  @Expose()
  smile_id: bigint;
  @Expose()
  account_type: string;
}
