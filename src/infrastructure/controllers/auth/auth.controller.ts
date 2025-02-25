import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthLoginDto, RefreshDto } from './auth-dto.class';
import {
  IsAuthPresenter,
  RefreshedAccessTokenPresenter,
} from './auth.presenter';

import JwtRefreshGuard from '../../common/guards/jwtRefresh.guard';

import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module';
import { LoginUseCases } from '../../../usecases/auth/login.usecases';
import { ApiHeaders } from '@infrastructure/common/decorators/api.decorator';

@Controller('auth')
@ApiTags('Authentication')
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeaders()
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
  ) {}

  @Post('login')
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({
    summary: 'Logging in a user',
    description: 'Use this route to log in a user',
  })
  @ApiOkResponse({
    description: 'The user was logged in successfully',
    type: IsAuthPresenter,
  })
  async login(@Body() auth: AuthLoginDto) {
    const token = await this.loginUsecaseProxy
      .getInstance()
      .authenticate(auth.phone, auth.password);
    return new IsAuthPresenter({
      token,
      phone: auth.phone,
    });
  }

  @Post('register')
  @ApiBody({ type: RefreshDto })
  async register(@Body() auth: RefreshDto) {}

  @Post('resend-otp')
  @ApiBody({ type: RefreshDto })
  async resendOtp(@Body() auth: RefreshDto) {}

  @Post('verify-otp')
  @ApiBody({ type: RefreshDto })
  async verifyOtp(@Body() auth: RefreshDto) {}

  @Post('complete-registration')
  @UseGuards(JwtRefreshGuard)
  @ApiBody({ type: RefreshDto })
  @ApiBearerAuth()
  async completeSetup(@Body() auth: RefreshDto) {}

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBody({ type: RefreshDto })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refreshes the access token',
    description: 'Use this route to refresh the access token',
  })
  @ApiOkResponse({
    description: 'The access token was refreshed successfully',
    type: RefreshedAccessTokenPresenter,
  })
  async refresh(@Body() auth: RefreshDto) {
    const payload = await this.loginUsecaseProxy
      .getInstance()
      .validateRefreshToken(auth.refreshToken);
    const access = await this.loginUsecaseProxy
      .getInstance()
      .getAccessToken(payload.phone, payload.id);
    return new RefreshedAccessTokenPresenter(access);
  }
}
