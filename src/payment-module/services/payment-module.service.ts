import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
  CreatePaymentModuleDto,
  SmilePayApiDto,
} from '../dto/create-payment-module.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import { CreateSmilePayServiceDto } from 'src/smile-pay-service/dto/create-smile-pay-service.dto';
import { ConfigService } from '@nestjs/config';

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
  async paySmileBill(createSmileTransaction: SmilePayApiDto) {
    Logger.log(createSmileTransaction, 'createSmileTransaction');

    const smilePayApiUrl =
      this.baseUrl +
      'smile-pay-service' +
      `?status=${createSmileTransaction.status}`;

    Logger.log(smilePayApiUrl, 'smilePayApiUrl');

    try {
      const smilePayApi = await axios.post(smilePayApiUrl, {
        amount: createSmileTransaction.amount,
      });

      Logger.log(smilePayApi, 'smilePayApi');
      return smilePayApi.data;
    } catch (error) {
      Logger.error(error, 'error');
      if (error.response) {
        Logger.error(`Error from SmilePay API: ${error}`);

        throw new HttpException(
          'Error sending request to SmilePay API',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );

        // switch (error.response.status) {
        //   case 400:
        //     throw new HttpException(
        //       'Bad Request from SmilePay API',
        //       HttpStatus.BAD_REQUEST,
        //     );
        //   case 401:
        //     throw new HttpException(
        //       'Unauthorized Access to SmilePay API',
        //       HttpStatus.UNAUTHORIZED,
        //     );
        //   case 404:
        //     throw new HttpException(
        //       'SmilePay API Not Found',
        //       HttpStatus.NOT_FOUND,
        //     );
        //   default:
        //     throw new HttpException(
        //       'Internal Server Error',
        //       HttpStatus.INTERNAL_SERVER_ERROR,
        //     );
        // }
      } else {
        throw new HttpException(
          'Error sending request to SmilePay API',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
