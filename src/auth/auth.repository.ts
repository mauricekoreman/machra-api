import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserCredentialsDto } from './dto/create-user-credentials.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { generatePassword } from 'src/utils/generate-password';

@Injectable()
export class AuthRepository extends Repository<User> {
  private logger = new Logger();
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(
    createUserCredentialsDto: CreateUserCredentialsDto,
  ): Promise<void> {
    const { username, password, roles } = createUserCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword, roles });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exists');
      } else if (error.code === '22P02') {
        throw new BadRequestException('Invalid text');
      } else {
        this.logger.error('Failed to create a new user', error.stack);
        throw new InternalServerErrorException();
      }
    }
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { oldPassword, newPassword } = changePasswordDto;
    const user = await this.findOneBy({ id });

    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      const hashedPassword = await generatePassword(newPassword);

      const result = await this.update(id, {
        password: hashedPassword,
      });

      if (result.affected === 0) {
        throw new NotFoundException(`User with ID "${id}" not found.`);
      }
    } else {
      throw new UnauthorizedException('Invalid password');
    }
  }
}
