import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateStoryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  year_of_story?: number;

  @IsOptional()
  @IsBoolean()
  isReviewed?: boolean;
}
