import { Injectable } from '@nestjs/common';
import { UserM, UserWithPassword } from '../../domain/model/user';
import { UserRepository } from '../../domain/repositories/userRepository.interface';
import { PrismaService } from '@infrastructure/config/prisma/prisma.service';

@Injectable()
export class UserRepositoryImp implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserByPhone(phone: string): Promise<UserWithPassword> {
    const user = await this.prismaService.user.findUnique({
      where: {
        phoneNumber: phone,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async updateLastLogin(username: string): Promise<void> {
    await this.prismaService.user.update({
      where: {
        username,
      },
      data: {
        lastLogin: new Date(),
      },
    });
  }
}
