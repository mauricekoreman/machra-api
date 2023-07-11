import { IsString } from 'class-validator';

export class UserCredentialsDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
