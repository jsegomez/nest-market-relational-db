import { IsString, IsNotEmpty, IsUrl } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  readonly image: string;

  readonly active: boolean;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
