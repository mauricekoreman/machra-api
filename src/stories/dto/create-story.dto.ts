import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStoryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  punishment: string;

  @IsOptional()
  @IsNumber()
  tile?: number;

  @IsNotEmpty()
  @IsBoolean()
  active: boolean;
}
