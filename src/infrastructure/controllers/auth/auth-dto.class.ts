import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsPhoneNumber('NG')
  readonly phone: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class RefreshDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}

export class RegisterDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsPhoneNumber('NG')
  readonly phone: string;
}

export class VerityOtpDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @Length(6, 6)
  readonly otp: string;
}
