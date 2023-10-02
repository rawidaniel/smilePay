import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { SerializeBigInt } from '../interceptors/serializeBigInt.interceptor';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { CreateUserDto } from './dtos/createUser.dto';
import { SiginDto } from './dtos/signin.dto';
import { Seralize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthResponse } from './dtos/authResponse.dto';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
@SerializeBigInt()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiCreatedResponse({ description: 'create a new user', type: AuthResponse })
  @ApiBadRequestResponse({
    description: 'The provided email is already in use.',
  })
  @Post('signup')
  @Seralize(UserDto)
  async signup(@Body() body: CreateUserDto): Promise<AuthResponse> {
    const response = await this.authService.register(body);
    return response;
  }

  @ApiOkResponse({
    description: 'Successfully authenticated.',
    type: AuthResponse,
  })
  @ApiBadRequestResponse({
    description: 'The provided credentials are invalid.',
  })
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @Seralize(UserDto)
  async signin(@Body() body: SiginDto): Promise<AuthResponse> {
    return this.authService.login(body);
  }

  @ApiResponse({ description: 'Successfully logged out.', status: 204 })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('/logout')
  logout(@Request() req): any {
    req.session.destroy();
  }
  // Get / protected
  // @UseGuards(AuthenticatedGuard)
  // @ApiCookieAuth()
  // @Get('/protected')
  // getHello(@Request() req): string {
  //   return req.user;
  // }
}
