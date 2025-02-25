export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export interface IJwtServicePayload {
  id: string;
  phone: string;
  type: TokenType;
}

export interface IJwtService {
  validateToken<T extends object = IJwtServicePayload>(
    token: string,
    secret?: string,
  ): Promise<T>;
  signPayload(
    payload: IJwtServicePayload,
    secret?: string,
    expiresIn?: string,
  ): Promise<string>;
}
