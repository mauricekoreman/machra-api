import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { CreateUserCredsDto } from './dto/create-user-credentials.dto';
import * as bcrypt from 'bcrypt';
import { AdminCredentialsDto } from './dto/admin-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  // TODO: Guard with admin rights
  async createUser(
    createUserCredentialsDto: CreateUserCredsDto,
  ): Promise<void> {
    return this.authRepository.createUser(createUserCredentialsDto);
  }

  async signIn(
    adminCredentialsDto: AdminCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = adminCredentialsDto;
    const user = await this.authRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid login credentials.');
    }
  }
}
