import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { v4 as uuid } from 'uuid';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { FilterBooksDto } from './dto/filter-books.dto';
import { mockBooksArr } from './utils/mockBooksArr';

jest.mock('uuid');
(uuid as jest.Mock).mockReturnValue('mocked-uuid');

describe('BooksService', () => {
  let service: BooksService;
  const mockBook = {
    name: `Harry Potter`,
    author: `J.K. Rowling`,
    publishYear: 1997,
    price: 29.99,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a book successfully', () => {
    const result = service.create(mockBook);
    expect(result).toEqual({
      Message: `Book added successfully.`,
      book: { ...mockBook, id: 'mocked-uuid' },
    });
    expect(service['books']).toHaveLength(1);
  });

  it('should throw an error when creating a book that already exists', () => {
    service.create(mockBook);
    expect(() => service.create(mockBook)).toThrow(ConflictException);
  });

  it('should filter books by year range (minYear and maxYear)', () => {
    service['books'] = mockBooksArr;
    const filterDto: FilterBooksDto = { minYear: 1940, maxYear: 1970 };
    const result = service.filterBooks(filterDto);
    expect(result).toEqual([mockBooksArr[2], mockBooksArr[3]]);
  });

  it('should filter books by partial name and author', () => {
    service['books'] = mockBooksArr;
    const filterDto: FilterBooksDto = { name: 'Potter', author: 'Row' };
    const result = service.filterBooks(filterDto);
    expect(result).toEqual([mockBooksArr[0]]);
  });

  it('should remove a book successfully', () => {
    const res = service.create(mockBook);
    expect(service['books']).toHaveLength(1);

    const result = service.remove(res.book.id);
    expect(result).toBe(`Book deleted successfully by ID: mocked-uuid.`);
    expect(service['books']).toHaveLength(0);
  });

  it('should throw an error when removing a book that does not exist', () => {
    expect(() => service.remove('non-existent-id')).toThrow(NotFoundException);
  });
});
