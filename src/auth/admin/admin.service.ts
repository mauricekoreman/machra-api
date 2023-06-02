import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../auth.repository';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { CreateUserCredentialsDto } from '../dto/create-user-credentials.dto';

@Injectable()
export class AdminService {
  constructor(private authRepository: AuthRepository) {}

  async createUser(
    createUserCredentialsDto: CreateUserCredentialsDto,
  ): Promise<void> {
    return this.authRepository.createUser(createUserCredentialsDto);
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.authRepository.changePassword(id, changePasswordDto);
  }
}
