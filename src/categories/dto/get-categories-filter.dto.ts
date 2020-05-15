import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetCategoriesFilterDto {

  @IsOptional()
  @IsNotEmpty()
  page: number;

  @IsOptional()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  id: number;

}
