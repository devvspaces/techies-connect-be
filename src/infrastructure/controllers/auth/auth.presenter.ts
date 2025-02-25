import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class AuthTokenPresenter {
  @ApiResponseProperty()
  access: string;

  @ApiProperty({
    description: 'The time until the access token expires',
    example: '1h',
    format: 'duration',
  })
  accessExpiresIn: string;

  @ApiResponseProperty()
  refresh: string;

  @ApiProperty({
    description: 'The time until the access token expires',
    example: '1h',
    format: 'duration',
  })
  refreshExpiresIn: string;

  constructor(data: Partial<AuthTokenPresenter>) {
    Object.assign(this, data);
  }
}

export class IsAuthPresenter {
  @ApiResponseProperty()
  phone: string;

  @ApiResponseProperty({
    type: AuthTokenPresenter,
  })
  token: AuthTokenPresenter;

  constructor(data: Partial<IsAuthPresenter>) {
    Object.assign(this, data);
  }
}

export class RefreshedAccessTokenPresenter {
  @ApiResponseProperty()
  access: string;

  @ApiProperty({
    description: 'The time until the access token expires',
    example: '1h',
    format: 'duration',
  })
  accessExpiresIn: string;

  constructor(data: Partial<RefreshedAccessTokenPresenter>) {
    Object.assign(this, data);
  }
}
