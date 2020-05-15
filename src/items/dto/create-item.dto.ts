import { IsNotEmpty } from 'class-validator';

export class CreateItemDto {

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  weight: number;

  purchaseDate: string;

  purchaseDetails: string;

  purchaseLocation: string;

  @IsNotEmpty()
  categoryId: number;

  @IsNotEmpty()
  description: string;
}
