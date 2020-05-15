import { IsOptional, IsNotEmpty } from 'class-validator';

export class GetUsersFilterDto {

  @IsOptional()
  @IsNotEmpty()
  page: number;

  @IsOptional()
  username: string;

  @IsOptional()
  @IsNotEmpty()
  id: number;

}
