import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStoryDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  punishment: string;

  @IsOptional()
  tile?: number;

  @IsNotEmpty()
  active: boolean;
}
