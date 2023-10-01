import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  CreatePaymentModuleDto,
  SmilePayApiDto,
} from '../dto/create-payment-module.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import { CreateSmilePayServiceDto } from 'src/smile-pay-service/dto/create-smile-pay-service.dto';
import { ConfigService } from '@nestjs/config';
import { QueryDto } from 'src/derash/dtos/query.dto';

@Injectable()
export class PaymentModuleService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  public baseUrl = this.configService.get('API_URL');

  async create(
    createPaymentModuleDto: CreatePaymentModuleDto,
    userId: number,
  ) {}

  async paySmileBill(createSmileTransaction: SmilePayApiDto, userId: number) {
    Logger.log(createSmileTransaction, 'createSmileTransaction');

    const smilePayApiUrl =
      this.baseUrl +
      'smile-pay-service' +
      `?status=${createSmileTransaction.status}`;

    Logger.log(smilePayApiUrl, 'smilePayApiUrl');

    try {
      const smilePayApi = await axios.post(smilePayApiUrl, {
        amount: createSmileTransaction.amount,
        userId,
      });

      Logger.log(smilePayApi.data, 'smilePayApi');
      return smilePayApi.data;
    } catch (error) {
      Logger.error(error, 'error');

      console.log('first error');
      throw new HttpException(
        error.response.data.message,
        error.response.status,
      );
    }
  }

  async reverseSmilePayTransaction(transactionCode: string) {
    const smilePayApiUrl = this.baseUrl + 'smile-pay-service/reverse';

    Logger.log(smilePayApiUrl, 'smilePayApiUrl');

    try {
      Logger.log(
        `sending confirmation code ${transactionCode} to ${smilePayApiUrl}`,
      );
      const smilePayApi = await axios.post(smilePayApiUrl, {
        transactionCode,
      });

      Logger.log(smilePayApi.data.message, 'smilePayApi');
      return smilePayApi.data;
    } catch (error) {
      Logger.error(error, 'error');

      console.log('first error');
      throw new HttpException(
        error.response.data.message,
        error.response.status,
      );
    }
  }

  async DerashPaymnet(
    apiSecret: string,
    apiKey: string,
    query: QueryDto,
    response,
  ) {
    Logger.log(query, 'querysecondddddddd');
    const DerashApiUrl =
      this.baseUrl +
      'agent/customer-bill-data' +
      `?status=${query.status}&bill_id=${query.bill_id}&biller_id=${query.biller_id}`;

    Logger.log(DerashApiUrl, 'smilePayApiUrl');

    try {
      const derashResponse = await axios.post(DerashApiUrl, response, {
        headers: {
          'api-key': apiKey ?? this.configService.get('DERASH_API_KEY'),
          'api-secret':
            apiSecret ?? this.configService.get('DERASH_API_SECRET'),
        },
      });
      Logger.log(derashResponse.data, 'derashResponse');
      return derashResponse.data;
    } catch (error) {
      console.log('second error');

      throw new HttpException(
        error.response.data.message,
        error.response.status,
      );
    }
  }
}
