import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/createUser.dto';
import { SiginDto } from './dtos/signin.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(data: CreateUserDto) {
    const user = await this.usersService.findByEmail(data.email);

    if (user) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await this.getHasedData(data.password);
    data.password = hashedPassword;
    const newUser = await this.usersService.createUser(data);
    return newUser;
  }

  async login(data: SiginDto) {
    const user = await this.usersService.findByEmail(data.email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordMatch = await bcrypt.compare(data.password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('could not find the user');
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (user && passwordValid) {
      return {
        userId: user.id,
      };
    }
    return null;
  }
  async getHasedData(data: string) {
    const saltOrRounds = 10;
    const hashedData = await bcrypt.hash(data, saltOrRounds);
    return hashedData;
  }
}
