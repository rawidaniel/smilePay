import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;
  @Expose()
  email: string;
  @Expose()
  fullName: string;
  @Expose()
  smile_id: bigint;
  @Expose()
  balance: number;
  @Expose()
  account_type: string;
  @Expose()
  created_at: Date;
  @Expose()
  last_updated: Date;
}
