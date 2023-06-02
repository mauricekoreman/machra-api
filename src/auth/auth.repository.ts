import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserCredsDto } from './dto/create-user-credentials.dto';

@Injectable()
export class AuthRepository extends Repository<User> {
  private logger = new Logger();
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(
    createUserCredentialsDto: CreateUserCredsDto,
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
}
