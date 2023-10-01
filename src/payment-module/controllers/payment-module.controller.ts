import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Logger,
} from '@nestjs/common';
import { PaymentModuleService } from '../services/payment-module.service';
import { CreatePaymentModuleDto } from '../dto/create-payment-module.dto';
import { UsersService } from 'src/users/users.service';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import axios from 'axios';

@Controller('payment')
export class PaymentModuleController {
  constructor(
    private readonly paymentModuleService: PaymentModuleService,
    private userService: UsersService,
  ) {}

  @UseGuards(AuthenticatedGuard)
  @Post()
  async create(
    @Body() createPaymentModuleDto: CreatePaymentModuleDto,
    @Request() req: any,
  ) {
    const id = req.user.userId;
    const user = await this.userService.findById(id);

    if (!user) {
      return {
        message: 'user not found',
        status: false,
      };
    }

    const isTransactionSuccessful =
      await this.paymentModuleService.mockSmilePayTransaction();

    if (isTransactionSuccessful.statusCode !== 200) {
      return {
        message: 'transaction not successful',
        status: false,
      };
    }

    const derashApiKey = process.env.DERASH_API_KEY;
    const derashApiSecret = process.env.DERASH_API_SECRET;
    const derashBaseUrl = process.env.DERASH_API_URL;

    const derashMockData = {
      manifest_id: '1263582990003',
      bill_id: '1263582990003',
      amount: '390432.20',
      paid_dt: '2017-06-08',
      payee_mobile: '0911987654',
      paid_at: 'Arat Kilo branch',
      txn_code: '1263582990003',
    };
    let derashResponse;

    try {
      Logger.log(
        `derash request: ${JSON.stringify(
          derashMockData,
        )} to ${derashBaseUrl}agent/customer-bill-data`,
      );
      derashResponse = await axios.post(
        `${derashBaseUrl}agent/customer-bill-data`,
        derashMockData,
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': derashApiKey,
            'api-secret': derashApiSecret,
          },
        },
      );

      Logger.log('derash response ', derashResponse);
      Logger.log(`derash response: ${JSON.stringify(derashResponse.data)}`);

      // if the status code is not 200 we return the smile pay transaction
      const reversedTrasnaction =
        await this.paymentModuleService.mockSmilePayTransactionReverse();

      // if the status code is 200 we return the smile pay transaction
      // we customize our response that the transaction is failed but
      // the money is reversed

      if (reversedTrasnaction.statusCode === 200) {
        return {
          message: 'transaction not successful but the money is reversed',
          status: false,
        };
      }

      return {
        message: 'transaction successful',
        status: true,
      };
    } catch (error) {
      Logger.error(
        'Error with Derash API:',
        error.response ? error.response.data : error.message,
      );

      if (error.response) {
        return {
          message: error.response.data.message || 'Error from Derash API',
          status: false,
          statusCode: error.response.status,
        };
      } else {
        // This means the error wasn't due to a server response, could be network issues or other problems.
        return {
          message: error.message,
          status: false,
        };
      }
    }
  }
}
