import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateSmilePayServiceDto,
  ReversetTransaction,
} from './dto/create-smile-pay-service.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class SmilePayServiceService {
  constructor(private readonly usersService: UsersService) {}

  async initiatePayment(dto: CreateSmilePayServiceDto, status: string) {
    const userId = dto.userId;
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new HttpException('User does not exist.', HttpStatus.NOT_FOUND);
    }

    if (status === '400') {
      throw new HttpException(
        'Invalid transaction amount.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (status === '402') {
      throw new HttpException(
        'Insufficient funds.',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    if (status === '200') {
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

    throw new HttpException(
      'System error. Please try again later.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async reverseTransaction(transactionCode: ReversetTransaction) {
    return {
      status: '200',
      message: `Transaction ${transactionCode.transactionCode} has been reversed.`,
    };
  }

  private generateMockTransactionId() {
    return 'TXN-' + Math.random().toString(36).substr(2, 9);
  }
}
