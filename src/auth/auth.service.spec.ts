import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const saltOrRounds = 10;

  // Mocking UsersService methods
  const mockUsersService = {
    findByEmail: jest.fn(),
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const data = {
      email: 'test@gmail.com',
      fullName: 'Jhon Ramsea',
      password: '12345',
      smile_id: 1678905432n,
      account_type: 'Account type',
    };

    const response = {
      ...data,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      balance: 34000.34,
      id: uuidv4(),
      password: await bcrypt.hash(data.password, saltOrRounds),
    };
    mockUsersService.findByEmail.mockResolvedValueOnce(null);
    // mockPrismaService.user.create.mockResolvedValueOnce(data);
    mockUsersService.createUser.mockResolvedValueOnce(response);

    const user = await service.register(data);
    expect(user).toEqual(response);
    expect(user.password).not.toBe(data.password);
  });

  it('should throw error if email already exists', async () => {
    const data = {
      email: 'test@gmail.com',
      fullName: 'Jhon Ramsea',
      password: '12345',
      smile_id: 1678905432n,
      account_type: 'Account type',
    };
    mockUsersService.findByEmail.mockResolvedValueOnce(data);

    await expect(service.register(data)).rejects.toThrow(
      'Email already exists',
    );
  });

  it('should login with correct credentials', async () => {
    const data = { email: 'test@gmail.com', password: '12345' };
    const response = {
      ...data,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      balance: 34000.34,
      id: uuidv4(),
      password: await bcrypt.hash(data.password, saltOrRounds),
    };
    mockUsersService.findByEmail.mockResolvedValueOnce(response);

    const result = await service.login(data);
    expect(result).toEqual(response);
  });

  it('should throw error with incorrect credentials', async () => {
    const data = { email: 'test@gmail.com', password: '12345' };

    mockUsersService.findByEmail.mockResolvedValueOnce(data);

    await expect(service.login(data)).rejects.toThrow('Invalid credentials');
  });
});
