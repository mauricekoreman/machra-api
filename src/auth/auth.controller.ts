import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserCredsDto } from './dto/create-user-credentials.dto';
import { AdminCredentialsDto } from './dto/admin-credentials.dto';
import { RolesGuard } from './roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './roles.decorator';
import { Role } from './role.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/create-user')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
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
