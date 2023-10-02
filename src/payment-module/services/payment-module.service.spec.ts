import {
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentModuleService } from './payment-module.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockData = [
  {
    id: 'a47b24c5-a77f-481f-a1ef-83ad01d44c09',
    manifest_id: '1263582990003',
    bill_id: '1263582990003',
    biller_id: '1263582990003',
    amount: 200,
    paid_data: 'this is dummy data',
    paid_at: 'aratkillo branch',
    payee_mobile: '0912345678',
    txn_id: 'TXN-4g2wefjrq',
    confirmation_code: 'IUzI1NiIsInR5cCI6',
    user_id: '859e219b-6756-4d83-ac5a-5a6d0c8d6d30',
    derash_status_id: null,
    smile_status_id: null,
    created_at: '2023-10-02T16:34:22.737Z',
    last_updated: '2023-10-02T16:34:22.737Z',
  },
  {
    id: 'a47b24c5-a77f-481f-a1ef-83ad01d44c09',
    manifest_id: '567890000098765',
    bill_id: '45678432',
    biller_id: '09872345',
    amount: 3200,
    paid_data: 'this is dummy data',
    paid_at: 'bole branch',
    payee_mobile: '0945673456',
    txn_id: 'TXN-6h6lefjxz',
    confirmation_code: 'IUzI1NiIsInR5cCI6',
    user_id: 'd48e1e00-4971-4712-bd78-6bd0e599b4c6',
    derash_status_id: null,
    smile_status_id: null,
    created_at: '2023-10-02T16:34:22.737Z',
    last_updated: '2023-10-02T16:34:22.737Z',
  },
];

describe('PaymentModuleService', () => {
  let service: PaymentModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentModuleService,
        {
          provide: PrismaService,
          useValue: {}, // Mock this value
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost:3000/'),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            billPayment: {
              findMany: jest.fn((params) => {
                if (params && params.where && params.where.user_id) {
                  return Promise.resolve(
                    mockData.filter(
                      (item) => item.user_id === params.where.user_id,
                    ),
                  );
                }
                return Promise.resolve(mockData);
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PaymentModuleService>(PaymentModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reteriveAllPayments', () => {
    it('should retrieve all payments', async () => {
      expect(service.reteriveAllPayments()).resolves.toEqual(mockData);
    });
  });

  describe('reterive all paymennts for specific user', () => {
    const user_id = 'd48e1e00-4971-4712-bd78-6bd0e599b4c6';
    it('should reterive all paymennts for specific user', async () => {
      expect(service.reterivePayment(user_id)).resolves.toEqual(
        mockData.filter((item) => item.user_id === user_id),
      );
    });
  });

  describe('paySmileBill', () => {
    const data = {
      manifest_id: '1263582990003',
      bill_id: '1263582990003',
      amount: '100.00',
      paid_dt: '2023-10-02',
      payee_mobile: '0912345678',
      paid_at: 'Arat Kilo branch',
      txn_code: 'TXN-wyj710hxq',
    };
    it('should handle payment through Smile Bill', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data,
      });

      const result = await service.paySmileBill(
        { status: '200' },
        +'859e219b-6756-4d83-ac5a-5a6d0c8d6d30',
      );

      expect(result).toBeDefined();
      expect(result).toEqual(data);
    });

    it('should throw error of Invalid transaction amount', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: {
            message: 'Invalid transaction amount',
          },
          status: 400,
        },
      });

      await expect(
        service.paySmileBill(
          { status: '400' },
          +'859e219b-6756-4d83-ac5a-5a6d0c8d6d30',
        ),
      ).rejects.toThrow(new BadRequestException('Invalid transaction amount'));
    });

    it('should throw error of Insufficient funds.', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: {
            message: 'Insufficient funds.',
          },
          status: 402,
        },
      });

      await expect(
        service.paySmileBill(
          { status: '402' },
          +'859e219b-6756-4d83-ac5a-5a6d0c8d6d30',
        ),
      ).rejects.toThrow(new HttpException('Insufficient funds.', 402));
    });

    it('should throw error of internal server error ', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: {
            message: 'System error. Please try again later.',
          },
          status: 500,
        },
      });

      await expect(
        service.paySmileBill(
          { status: '500' },
          +'859e219b-6756-4d83-ac5a-5a6d0c8d6d30',
        ),
      ).rejects.toThrow(
        new HttpException('System error. Please try again later.', 500),
      );
    });
  });

  describe('derash endpoint', () => {
    it('should return confirmation code from Derash API', async () => {
      const data = {
        manifest_id: '1263582990003',
        bill_id: '1263582990003',
        amount: '100.00',
        paid_dt: '2023-10-02',
        payee_mobile: '0912345678',
        paid_at: 'Arat Kilo branch',
        txn_code: 'TXN-m2a6dqpgr',
      };
      const mockResponse = {
        confirmation_code: 'IUzI1NiIsInR5cCI6',
      };
      mockedAxios.post.mockResolvedValue({ data: mockResponse });

      const result = await service.DerashPaymnet(
        'apiSecret',
        'apiKey',
        { status: '200', bill_id: '1263582990003', biller_id: '987654327654' },
        data,
      );
      expect(result).toBeDefined();
      expect(result).toEqual(mockResponse);
    });
  });

  it('should throw error of Partial payment is not allowed', async () => {
    console.log('hereeeeeeeeeee');
    const data = {
      manifest_id: '1263582990003',
      bill_id: '1263582990003',
      amount: '100.00',
      paid_dt: '2023-10-02',
      payee_mobile: '0912345678',
      paid_at: 'Arat Kilo branch',
      txn_code: 'TXN-m2a6dqpgr',
    };
    const mockError = {
      response: {
        data: {
          message:
            'Partial payment is not allowed. Customer should pay the full amount due 234.50',
        },
        status: 400,
      },
    };

    mockedAxios.post.mockRejectedValue(mockError);

    await expect(
      service.DerashPaymnet(
        'apiSecret',
        'apiKey',
        { status: '400', bill_id: '1263582990003', biller_id: '987654327654' },
        data,
      ),
    ).rejects.toThrow(
      new BadRequestException(
        'Partial payment is not allowed. Customer should pay the full amount due 234.50',
      ),
    );
  });

  it('should throw error of Bill already paid', async () => {
    const data = {
      manifest_id: '1263582990003',
      bill_id: '1263582990003',
      amount: '100.00',
      paid_dt: '2023-10-02',
      payee_mobile: '0912345678',
      paid_at: 'Arat Kilo branch',
      txn_code: 'TXN-m2a6dqpgr',
    };
    const mockError = {
      response: {
        data: {
          message: 'Bill already paid!',
          details: {
            agent: 'Same',
            confirmation_code: '241c7a7f-42f2-4318-b591-a7aadf81360d',
            agent_tx_code: 'FTA353253',
          },
          status: 400,
        },
      },
    };

    mockedAxios.post.mockRejectedValue(mockError);

    await expect(
      service.DerashPaymnet(
        'apiSecret',
        'apiKey',
        { status: '400', bill_id: '1263582990003', biller_id: '987654327654' },
        data,
      ),
    ).rejects.toThrow(new NotFoundException('Bill already paid!'));
  });
});
