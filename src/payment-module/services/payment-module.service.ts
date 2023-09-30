import { Injectable } from '@nestjs/common';
import { CreatePaymentModuleDto } from '../dto/create-payment-module.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentModuleService {
  constructor(private prisma: PrismaService) {}
  async create(createPaymentModuleDto: CreatePaymentModuleDto) {}

  async mockSmilePayTransaction() {
    return {
      message: 'transaction successful',
      statusCode: 200,
    };
  }

  async mockSmilePayTransactionFail() {
    return {
      message: 'transaction not successful',
      statusCode: 400,
    };
  }

  async mockSmilePayTransactionReverse() {
    return {
      message: 'transaction reversed',
      statusCode: 200,
    };
  }
}
