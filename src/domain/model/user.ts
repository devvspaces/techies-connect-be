export class UserM {
  id: string;
  phoneNumber: string;
  email?: string;
  username?: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  lastLogin: Date;
}

export class UserWithPassword extends UserM {
  password: string;
}
