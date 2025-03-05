import { Injectable } from '@nestjs/common';
import { Book } from './entities/book.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BooksService {
  private books: Book[] = [];

  create(bookName: string) {
    const ifBookExist = this.books.find((book) => book.name === bookName);
    if (ifBookExist) throw Error(`Book already exist.`);
    const id: string = uuid();
    const bookData: Book = { id, name: bookName };
    this.books.push(bookData);
    return bookData;
  }

  findAll() {
    return this.books;
  }

  findOne(id: string) {
    return this.books.find((book) => book.id === id);
  }

  remove(id: string) {
    const book = this.books.find((book) => book.id === id);
    if (!book)
      throw Error(`Deletion failed, could not find book by ID: ${id}.`);
    this.books = this.books.filter((book) => book.id !== id);
    return `Book deleted successfully by ID: ${id}.`;
  }
}
