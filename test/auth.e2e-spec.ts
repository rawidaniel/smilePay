import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userData, loginData;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [AuthController],
      providers: [AuthService, UsersService, PrismaService],
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

  it('/POST signup', async () => {
    const user = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userData)
      .expect(201);

    const responseBody = JSON.parse(user.text);

    expect(responseBody.email).toEqual(userData.email);
    expect(responseBody.fullName).toEqual(userData.fullName);
  });

  it('/POST signin', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send(userData)
      .expect(201);

    const user = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(loginData)
      .expect(200);

    const responseBody = JSON.parse(user.text);

    expect(responseBody.email).toEqual(loginData.email);
  });

  afterEach(async () => {
    await app.close();
  });
});
