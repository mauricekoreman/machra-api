import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserCredsDto } from './dto/create-user-credentials.dto';
import { AdminCredentialsDto } from './dto/admin-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/create-user')
  createUser(@Body() createUserCredsDto: CreateUserCredsDto): Promise<void> {
    return this.authService.createUser(createUserCredsDto);
  }

  @Post('/signin')
  signIn(
    @Body() adminCredentialsDto: AdminCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(adminCredentialsDto);
  }
}
