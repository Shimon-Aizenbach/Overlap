import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsInt,
  IsPositive,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsInt()
  publishYear: number;

  @IsNumber()
  @IsPositive()
  price: number;
}
