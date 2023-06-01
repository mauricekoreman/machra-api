import {
  IsBooleanString,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetStoriesFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  punishment?: string;

  @IsOptional()
  @IsNumberString()
  tile?: number;

  @IsOptional()
  @IsBooleanString()
  active?: boolean;
}
