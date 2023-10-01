import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSmilePayServiceDto } from './dto/create-smile-pay-service.dto';
import { UpdateSmilePayServiceDto } from './dto/update-smile-pay-service.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SmilePayServiceService {
  constructor(private readonly usersService: UsersService) {}

  async initiatePayment(dto: CreateSmilePayServiceDto) {
    const user = await this.usersService.findById(dto.userId);
    if (!user) {
      throw new HttpException('User does not exist.', HttpStatus.NOT_FOUND);
    }

    // update the user type to include a balance field

    if (dto.amount <= 0) {
      throw new HttpException(
        'Invalid transaction amount.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.balance < dto.amount) {
      throw new HttpException(
        'Insufficient funds.',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    if (Math.random() < 0.35) {
      throw new HttpException(
        'System error. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    user.balance -= dto.amount;

    const transactionCode = this.generateMockTransactionId();
    const manifestId = '1263582990003';
    return {
      manifest_id: manifestId,
      bill_id: manifestId,
      amount: dto.amount.toFixed(2),
      paid_dt: new Date().toISOString().split('T')[0],
      payee_mobile: '0912345678',
      paid_at: 'Arat Kilo branch',
      txn_code: transactionCode,
    };
  }

  async reverseTransaction(transactionCode: string) {
    return {
      status: 'SUCCESS',
      message: `Transaction ${transactionCode} has been reversed.`,
    };
  }

  private generateMockTransactionId() {
    return 'TXN-' + Math.random().toString(36).substr(2, 9);
  }
}