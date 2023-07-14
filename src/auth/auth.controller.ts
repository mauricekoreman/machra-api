import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { Role } from './role.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  signIn(
    @Body() userCredentialsDto: UserCredentialsDto,
  ): Promise<{ roles: Role[]; accessToken: string }> {
    return this.authService.signIn(userCredentialsDto);
  }
}
