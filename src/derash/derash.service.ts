import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { QueryDto } from './dtos/query.dto';
import { CustomerBillDataDto } from './dtos/customerBillData.dto';
import { ParamDto } from './dtos/param.dto';

@Injectable()
export class DerashService {
  async createCustomerBillData(query: QueryDto, body: CustomerBillDataDto) {
    const queryStr = query.status;
    switch (queryStr) {
      case '200':
        return this.mockDerashTransactionSuccess();
      case '400':
        return this.mockDerashTransactionPartialPayment();
      case '404':
        return this.mockDerashTransactionCustomerBillAlreadyPaid();
      case '422':
        return this.mockDerashTransactionCustomerBillNotFound();
      case '500':
        return this.mockDerashTransactionServerNotAvailable();
      default:
        throw new HttpException('Bad Request', 400);
    }
  }

  async getCustomerBillData(query: QueryDto) {
    const queryStr = query.status;
    switch (queryStr) {
      case '200':
        return this.mockDerashTransactionCustomerBillDataSuccess();
      case '402':
        return this.mockDerashTransactionCustomerBillPaid();
      case '403':
        return this.mockDerashTransactionCustomerBillExpired();
      case '404':
        return this.mockDerashTransactionCustomerBillNotFound();
      case '500':
        return this.mockDerashTransactionServerNotAvailable();
      default:
        throw new HttpException('Bad Request', 400);
    }
  }
  async mockDerashTransactionSuccess() {
    return {
      confirmation_code: 'IUzI1NiIsInR5cCI6',
    };
  }

  async mockDerashTransactionPartialPayment() {
    throw new HttpException(
      {
        message:
          'Partial payment is not allowed. Customer should pay the full amount due 234.50',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  async mockDerashTransactionCustomerBillAlreadyPaid() {
    throw new HttpException(
      {
        message: 'Bill already paid!',
        details: {
          agent: 'Same',
          confirmation_code: '241c7a7f-42f2-4318-b591-a7aadf81360d',
          agent_tx_code: 'FTA353253',
        },
      },
      HttpStatus.NOT_FOUND,
    );
  }

  async mockDerashTransactionCustomerBillNotFound() {
    throw new HttpException(
      {
        message: 'The bill id 1263582990003 not found',
      },
      HttpStatus.NOT_FOUND,
    );
  }

  async mockDerashTransactionUnknownManifestId() {
    throw new HttpException(
      {
        message: 'The manifest id 1263582990003 is not correct',
      },
      422,
    );
  }
  async mockDerashTransactionServerNotAvailable() {
    throw new HttpException(
      {
        message: 'An error occurred. Please try again later.',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async mockDerashTransactionCustomerBillDataSuccess() {
    return {
      manifest_id: 'IUzI1NiIsInR5cCI6',
      customer_id: '003545345',
      name: 'ABC International Plc',
      bill_id: '7252874',
      bill_desc: "'June Bill':'3434.30','Penality':'35.00'",
      reason: 'PERIOD_JUNE_2017',
      partial_pay_allowed: true,
      amount_due: 35345.44,
      due_dt: '2017-06-07',
    };
  }
  async mockDerashTransactionCustomerBillPaid() {
    throw new HttpException(
      {
        message: 'Bill already paid!',
        details: {
          agent: 'Same',
          confirmation_code: '241c7a7f-42f2-4318-b591-a7aadf81360d',
          agent_tx_code: 'FTA353253',
        },
      },
      402,
    );
  }

  async mockDerashTransactionCustomerBillExpired() {
    throw new HttpException(
      {
        message: 'The bill id 1263582990003 is expired on Date 2017-06-08',
      },
      403,
    );
  }
}
