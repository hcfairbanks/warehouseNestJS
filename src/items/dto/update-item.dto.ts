import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class UpdateItemFilterDto {
  @IsOptional()
  name: string;
}
