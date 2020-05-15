import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';

export class GetItemsFilterDto {
  @IsOptional()
  @IsNotEmpty()
  page: number;

  @IsOptional()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsNotEmpty()
  categoryId: number;

  @IsOptional()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  lessThanPrice: number;

  @IsOptional()
  @IsNotEmpty()
  greaterThanPrice: number;

  @IsOptional()
  @IsNotEmpty()
  purchaseDate: string;

  @IsOptional()
  @IsNotEmpty()
  lessThanPurchaseDate: Date;

  @IsOptional()
  @IsNotEmpty()
  greaterThanPurchaseDate: Date;

  @IsOptional()
  @IsNotEmpty()
  purchaseDetails: string;

  @IsOptional()
  @IsNotEmpty()
  purchaseLocation: string;

  @IsOptional()
  @IsNotEmpty()
  userId: number;

  @IsOptional()
  @IsNotEmpty()
  lessThanWeight: number;

  @IsOptional()
  @IsNotEmpty()
  greaterThanWeight: number;
}
