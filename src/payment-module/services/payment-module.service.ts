import { HttpException, Injectable } from '@nestjs/common';
import { CreatePaymentModuleDto } from '../dto/create-payment-module.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class PaymentModuleService {
  constructor(private prisma: PrismaService) {}
  async create() {
    let smileResponse;
    try {
      smileResponse = await axios.post(
        `${process.env.API_URL}smile-pay-service?status=200`,
        200,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      return smileResponse.data;
    } catch (error) {
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  async mockSmilePayTransaction() {
    const derashMockData = {
      manifest_id: '12635829905003',
      bill_id: '12635829900403',
      amount: '390432.20',
      paid_dt: '2017-06-08',
      payee_mobile: '0911987654',
      paid_at: 'Arat Kilo branch',
      txn_code: '1263582990003',
    };
    return {
      data: derashMockData,
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
