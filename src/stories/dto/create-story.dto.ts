import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateStoryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  @IsNotEmpty()
  @IsNumber()
  year_of_story: number;
}
