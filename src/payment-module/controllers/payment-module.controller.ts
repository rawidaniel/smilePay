import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Logger,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PaymentModuleService } from '../services/payment-module.service';
import {
  CreatePaymentModuleDto,
  SmilePayApiDto,
} from '../dto/create-payment-module.dto';
import { UsersService } from 'src/users/users.service';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import axios from 'axios';
import { PaymentQueryDto } from 'src/smile-pay-service/dto/create-smile-pay-service.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('payment')
export class PaymentModuleController {
  constructor(
    private readonly paymentModuleService: PaymentModuleService,
    private userService: UsersService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(
    @Body() createPaymentModuleDto: CreatePaymentModuleDto,
    @Query() query: PaymentQueryDto,
    @Request() req,
  ) {
    const userId = req.user.userId;

    // check the user exists
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    Logger.log(userId, 'userId');

    try {
      // if yes make payment to smile pay api
      const smilePayTransaction = await this.paymentModuleService.paySmileBill(
        {
          amount: createPaymentModuleDto.amount,
          status: query.statusOne,
        },
        userId,
      );
      Logger.log(smilePayTransaction, 'smilePayTransaction');

      // return smilePayTransaction;

      // if there is error handle the error into user friendly message

      // if there is no error call the derash api to pay the bill
      // const queryString = {
      //   status: query.statusTwo,
      //   bill_id: smilePayTransaction.bill_id,
      //   biller_id: smilePayTransaction.manifest_id,
      // };
      // const apiSecret = this.configService.get('DERASH_API_SECRET');
      // const apiKey = this.configService.get('DERASH_API_KEY');
      // const derashTransaction = await this.paymentModuleService.DerashPaymnet(
      //   apiSecret,
      //   apiKey,
      //   queryString,
      //   smilePayTransaction,
      // );

      // return derashTransaction;
      // if there is error handle the error into user friendly message

      let derashTransaction;
      try {
        const queryString = {
          status: query.statusTwo,
          bill_id: smilePayTransaction.bill_id,
          biller_id: smilePayTransaction.manifest_id,
        };
        const apiSecret = this.configService.get('DERASH_API_SECRET');
        const apiKey = this.configService.get('DERASH_API_KEY');

        derashTransaction = await this.paymentModuleService.DerashPaymnet(
          apiSecret,
          apiKey,
          queryString,
          smilePayTransaction,
        );

        if (
          query.statusOne === '200' &&
          query.statusTwo === '200' &&
          smilePayTransaction
        ) {
          Logger.log('this is the data we saving ', smilePayTransaction);
          const bill_payment = await this.prisma.billPayment.create({
            data: {
              manifest_id: smilePayTransaction.manifest_id,
              bill_id: smilePayTransaction.bill_id,
              biller_id: smilePayTransaction.manifest_id,
              amount: +smilePayTransaction.amount,
              paid_data: 'this is dummy data',
              paid_at: 'aratkillo branch',
              payee_mobile: smilePayTransaction.payee_mobile,
              txn_id: smilePayTransaction.txn_code,
              confirmation_code:
                derashTransaction.confirmation_code || '39y238h93283u9',
              user_id: userId,
            },
          });

          Logger.log('Data have been saved', bill_payment);
        }
        return derashTransaction;
      } catch (error) {
        // Here, Derash transaction failed. We need to reverse SmilePay transaction.
        try {
          const reverseTransaction =
            await this.paymentModuleService.reverseSmilePayTransaction(
              '34df343f343rf',
            );

          Logger.error('reversed data', reverseTransaction);
          if (reverseTransaction.status === '200') {
            throw new HttpException(
              `Derash Payment failed. Your SmilePay transaction has been reversed. Reason: ${error.message}`,
              HttpStatus.BAD_REQUEST,
            );
          } else {
            throw new HttpException(
              `Derash Payment failed, and we couldn't reverse the SmilePay transaction. Please contact support.`,
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        } catch (reverseError) {
          throw new HttpException(
            `Error reversing SmilePay transaction: ${reverseError.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }

      // the reverse the transaction using smile pay reverse api

      // if ther is no error send message to user that the transaction is successful and
      // confirmation code that we got from derash api
    } catch (error) {
      throw new HttpException(
        error.response ? error.response : 'An error occurred.',
        error.response ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
