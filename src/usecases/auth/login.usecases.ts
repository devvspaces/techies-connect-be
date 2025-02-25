import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';
import {
  IJwtService,
  IJwtServicePayload,
  TokenType,
} from '../../domain/adapters/jwt.interface';
import { JWTConfig } from '../../domain/config/jwt.interface';
import { ILogger } from '../../domain/logger/logger.interface';
import { UserRepository } from '../../domain/repositories/userRepository.interface';
import { BcryptService } from '@infrastructure/services/bcrypt/bcrypt.service';

export class LoginUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly jwtTokenService: IJwtService,
    private readonly jwtConfig: JWTConfig,
    private readonly userRepository: UserRepository,
    private readonly exception: ExceptionsService,
    private readonly brcypt: BcryptService,
  ) {
    this.logger.setContext(LoginUseCases.name);
  }

  async authenticate(phone: string, password: string) {
    const exists = await this.userRepository.getUserByPhone(phone);

    if (!exists) {
      this.exception.badRequestException({
        message: 'User not found',
      });
    }

    const isMatch = await this.brcypt.compare(password, exists.password);
    if (!isMatch) {
      this.exception.badRequestException({
        message: 'Password is incorrect',
      });
    }

    this.logger.log(`The user ${phone} have been logged.`);
    const accessToken = await this.getAccessToken(phone, exists.id);
    const refresh = await this.jwtTokenService.signPayload(
      {
        phone,
        id: exists.id,
        type: TokenType.REFRESH,
      },
      this.jwtConfig.getJwtRefreshSecret(),
      this.jwtConfig.getJwtRefreshExpirationTime(),
    );
    return {
      ...accessToken,
      refresh,
      refreshExpiresIn: this.jwtConfig.getJwtRefreshExpirationTime(),
    };
  }

  async getAccessToken(phone: string, id: string) {
    const accessTokenPayload: IJwtServicePayload = {
      phone,
      id,
      type: TokenType.ACCESS,
    };
    const access = await this.jwtTokenService.signPayload(accessTokenPayload);
    return {
      access,
      accessExpiresIn: this.jwtConfig.getJwtExpirationTime(),
    };
  }

  async validateAccessToken(access: string) {
    const payload = await this.jwtTokenService.validateToken(access);
    if (payload.type !== TokenType.ACCESS) {
      throw new Error('Invalid token');
    }
    return payload;
  }

  async validateRefreshToken(refresh: string) {
    const payload = await this.jwtTokenService.validateToken(
      refresh,
      this.jwtConfig.getJwtRefreshSecret(),
    );
    if (payload.type !== TokenType.REFRESH) {
      throw new Error('Invalid token');
    }
    return payload;
  }

  async updateLoginTime(username: string) {
    await this.userRepository.updateLastLogin(username);
  }
}
