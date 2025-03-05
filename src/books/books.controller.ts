import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body(`name`) bookName: string) {
    try {
      if (!bookName) throw Error(`No book name accepted`);
      const addBookRes: Book = this.booksService.create(bookName);
      console.log(`res`, addBookRes);
      if (addBookRes) {
        return {
          Message: `Book added successfully.`,
          book: addBookRes,
        };
      }
      throw Error(`Adding the book failed.`);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  findAll() {
    try {
      const allBooks: Book[] = this.booksService.findAll();
      if (allBooks) return allBooks;
      throw Error(`Failed to receive all books`);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      if (id.length !== 36) throw Error(`Invalid id`);
      const book = this.booksService.findOne(id);
      if (book) return book;
      throw Error(`Could not find a book by ID: ${id}.`);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      if (id.length !== 36) throw Error(`Invalid id`);
      const removeBookRes = this.booksService.remove(id);
      return removeBookRes;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
