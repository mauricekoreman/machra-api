import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles.guard';
import { CreateUserCredentialsDto } from '../dto/create-user-credentials.dto';
import { AuthService } from '../auth.service';
import { Roles } from '../roles.decorator';
import { Role } from '../role.enum';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { AdminService } from './admin.service';

@Controller('auth/admin')
@UseGuards(AuthGuard(), RolesGuard)
@Roles(Role.Admin)
export class AdminController {
  constructor(
    private adminService: AdminService,
    private authService: AuthService,
  ) {}

  @Post('/create-user')
  createUser(
    @Body() createUserCredsDto: CreateUserCredentialsDto,
  ): Promise<void> {
    return this.adminService.createUser(createUserCredsDto);
  }

  @Patch('/:id/password')
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.adminService.changePassword(id, changePasswordDto);
  }
}
