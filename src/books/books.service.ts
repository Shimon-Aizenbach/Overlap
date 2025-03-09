import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Book } from './entities/book.entity';
import { v4 as uuid } from 'uuid';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FilterBooksDto } from './dto/filter-books.dto';

@Injectable()
export class BooksService {
  private books: Book[] = [];

  create(book: CreateBookDto) {
    const existingBook = this.books.find(
      (existedBook) => existedBook.name === book.name,
    );

    if (existingBook) throw new ConflictException(`Book already exist.`);

    const id: string = uuid();
    const bookData: Book = { id, ...book };
    this.books.push(bookData);

    return {
      Message: `Book added successfully.`,
      book: bookData,
    };
  }

  findAll() {
    return this.books;
  }

  findOne(id: string) {
    const book = this.books.find((book) => book.id === id);

    if (book) return book;

    throw new NotFoundException(`Book by ID: ${id} not found.`);
  }

  filterBooks(filterDto: FilterBooksDto) {
    const { minPrice, maxPrice, minYear, maxYear, name, author } = filterDto;

    if (!minPrice && !maxPrice && !minYear && !maxYear && !name && !author)
      return this.books;

    return this.books.filter((book) => {
      return (
        (!minPrice || book.price >= minPrice) &&
        (!maxPrice || book.price <= maxPrice) &&
        (!minYear || book.publishYear >= minYear) &&
        (!maxYear || book.publishYear <= maxYear) &&
        (!name || book.name.toLowerCase().includes(name.toLowerCase())) &&
        (!author || book.author.toLowerCase().includes(author.toLowerCase()))
      );
    });
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    const bookIndex = this.books.findIndex((book) => book.id === id);

    if (bookIndex === -1)
      throw new NotFoundException(
        `Updating failed, Book by ID: ${id} not found.`,
      );

    this.books[bookIndex] = { ...this.books[bookIndex], ...updateBookDto };

    return {
      Message: `Book updated successfully.`,
      book: this.books[bookIndex],
    };
  }

  remove(id: string) {
    const book = this.books.find((book) => book.id === id);

    if (!book)
      throw new NotFoundException(
        `Deletion failed, book by ID: ${id} not found.`,
      );

    this.books = this.books.filter((book) => book.id !== id);

    return `Book deleted successfully by ID: ${id}.`;
  }
}
