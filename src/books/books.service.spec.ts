import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { v4 as uuid } from 'uuid';

jest.mock('uuid');
(uuid as jest.Mock).mockReturnValue('mocked-uuid');

describe('BooksService', () => {
  let service: BooksService;
  const bookName = 'Rich dad poor dad';

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
    const result = service.create(bookName);
    expect(result).toEqual({ id: 'mocked-uuid', name: bookName });
    expect(service['books']).toHaveLength(1);
  });

  it('should throw an error when creating a book that already exists', () => {
    service.create(bookName);
    expect(() => service.create(bookName)).toThrow(
      Error('Book already exist.'),
    );
  });

  it('should remove a book successfully', () => {
    const book = service.create(bookName);
    expect(service['books']).toHaveLength(1);

    const result = service.remove(book.id);
    expect(result).toBe(`Book deleted successfully by ID: mocked-uuid.`);
    expect(service['books']).toHaveLength(0);
  });

  it('should throw an error when removing a book that does not exist', () => {
    expect(() => service.remove('non-existent-id')).toThrow(
      Error('Deletion failed, could not find book by ID: non-existent-id.'),
    );
  });
});
