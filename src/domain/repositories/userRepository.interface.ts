import { UserM, UserWithPassword } from '@domain/model/user';

export interface UserRepository {
  getUserByPhone(username: string): Promise<UserWithPassword>;
  updateLastLogin(username: string): Promise<void>;
}
