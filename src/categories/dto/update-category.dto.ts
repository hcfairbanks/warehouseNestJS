import { IsNotEmpty } from 'class-validator';

export class UpdateCategoryFilterDto {
  @IsNotEmpty()
  name: string;
}
