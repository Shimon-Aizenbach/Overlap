import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsInt,
  IsPositive,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: 'Book name cannot be empty' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Author cannot be empty' })
  author: string;

  @IsInt({ message: 'Year must be an integer' })
  publishYear: number;

  @IsNumber()
  @IsPositive({ message: 'Price must be positive' })
  price: number;
}
