import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Logger,
  HttpException,
} from '@nestjs/common';
import { PaymentModuleService } from '../services/payment-module.service';
import {
  CreatePaymentModuleDto,
  SmilePayApiDto,
} from '../dto/create-payment-module.dto';
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
    @Request() req,
  ) {
    const userId = req.user.userId;

    // check the user exists
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    Logger.log(user, 'user');

    // if yes make payment to smile pay api
    const smilePayTransaction = this.paymentModuleService.paySmileBill({
      amount: createPaymentModuleDto.amount,
      status: '200',
    });
    Logger.log(smilePayTransaction, 'smilePayTransaction');

    // if there is error handle the error into user friendly message

    // if there is no error call the derash api to pay the bill

    // if there is error handle the error into user friendly message

    // the reverse the transaction using smile pay reverse api

    // if ther is no error send message to user that the transaction is successful and
    // confirmation code that we got from derash api
  }
}
