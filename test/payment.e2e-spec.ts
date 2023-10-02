import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { PaymentModuleController } from '../src/payment-module/controllers/payment-module.controller';
import { PaymentModuleService } from '../src/payment-module/services/payment-module.service';
import { ConfigService } from '@nestjs/config';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userData, loginData;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [PaymentModuleController],
      providers: [
        PaymentModuleService,
        UsersService,
        ConfigService,
        PrismaService,
      ],
    }).compile();

    prisma = moduleRef.get<PrismaService>(PrismaService);

    userData = {
      email: 'test2@gmail.com',
      fullName: 'Jhon Ramsea',
      password: '12345',
      smile_id: '1678905432',
      account_type: 'Account type',
    };

    loginData = {
      email: 'test2@gmail.com',
      password: '12345',
    };

    await prisma.billPayment.deleteMany();
    await prisma.user.deleteMany();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('/POST payments', () => {
    it('should create a payment', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(userData)
        .expect(201);

      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(loginData)
        .expect(200);

      const cookie = res.get('Set-Cookie');

      return request(app.getHttpServer())
        .post('/payments?statusOne=200&statusTwo=200')
        .set('Cookie', cookie)
        .send({
          amount: 100,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('confirmation_code');
        });
    });
  });
  describe('/GET payments', () => {
    it('should retrieve all payments', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(userData)
        .expect(201);

      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(loginData)
        .expect(200);

      const cookie = res.get('Set-Cookie');

      await request(app.getHttpServer())
        .post('/payments?statusOne=200&statusTwo=200')
        .set('Cookie', cookie)
        .send({
          amount: 2500,
        });
      return request(app.getHttpServer())
        .get('/payments')
        .expect(200)
        .set('Cookie', cookie)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
          expect(res.body[0]).toHaveProperty('payee_mobile');
        });
    });
  });

  describe('/GET payments/:userId', () => {
    it('should retrieve payments for a specific user', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(userData)
        .expect(201);

      const res = await request(app.getHttpServer())
        .post('/auth/signin')
        .send(loginData)
        .expect(200);

      const cookie = res.get('Set-Cookie');

      await request(app.getHttpServer())
        .post('/payments?statusOne=200&statusTwo=200')
        .set('Cookie', cookie)
        .send({
          amount: 2500,
        });
      const response = JSON.parse(res.text);
      const testUserId = response.id;
      return request(app.getHttpServer())
        .get(`/payments/${testUserId}`)
        .expect(200)
        .set('Cookie', cookie)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
        });
    });
  });

  it('should throw error of access denied while try to access the payments endpoint without payments', async () => {
    return request(app.getHttpServer())
      .get(`/payments`)
      .expect(403)
      .expect((res) => {
        expect(res.body.message).toEqual('Forbidden resource');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
