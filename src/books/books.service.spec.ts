import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { v4 as uuid } from 'uuid';
import { Book } from './entities/book.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

jest.mock('uuid');
(uuid as jest.Mock).mockReturnValue('mocked-uuid');

describe('BooksService', () => {
  let service: BooksService;
  const mockBook = {
    name: 'Rich dad poor dad',
    author: `Robert Kiyosaki`,
    publishYear: 2016,
    price: 80.8,
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
      book: { id: 'mocked-uuid', ...mockBook },
    });
    expect(service['books']).toHaveLength(1);
  });

  it('should throw an error when creating a book that already exists', () => {
    service.create(mockBook);
    expect(() => service.create(mockBook)).toThrow(ConflictException);
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
