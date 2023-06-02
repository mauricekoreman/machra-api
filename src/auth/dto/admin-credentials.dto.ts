import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AdminCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least: 1 uppercase letter, 1 lowercase letter and 1 number or special character',
  })
  password: string;
}
