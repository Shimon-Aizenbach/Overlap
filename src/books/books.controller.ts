import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  Patch,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBooksDto } from './dto/filter-books.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() book: CreateBookDto) {
    return this.booksService.create(book);
  }

  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get('filter')
  filterBooks(@Query() filterDto: FilterBooksDto) {
    return this.booksService.filterBooks(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (id.length !== 36) throw new BadRequestException(`Invalid id`);
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    if (id.length !== 36) throw new BadRequestException(`Invalid id`);
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (id.length !== 36) throw new BadRequestException(`Invalid id`);
    return this.booksService.remove(id);
  }
}
