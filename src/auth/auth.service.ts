import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { Role } from './role.enum';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async signIn(
    userCredentialsDto: UserCredentialsDto,
  ): Promise<{ accessToken: string; roles: Role[] }> {
    const { username, password } = userCredentialsDto;
    const user = await this.authRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);

      return { accessToken, roles: user.roles };
    } else {
      throw new UnauthorizedException('Invalid login credentials.');
    }
  }
}
