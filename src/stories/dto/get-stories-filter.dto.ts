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
  @IsBooleanString()
  active?: boolean;

  @IsOptional()
  @IsNumberString()
  date1?: string;

  @IsOptional()
  @IsNumberString()
  date2?: string;
}
