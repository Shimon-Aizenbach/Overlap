import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { BadRequestException } from '@nestjs/common';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;
  const mockBook = {
    name: 'Rich dad poor dad',
    author: `Robert Kiyosaki`,
    publishYear: 2016,
    price: 80.8,
  };
  const id = `123e4567-e89b-12d3-a456-426614174000`;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add a book successfully', () => {
    const book: Book = { id, ...mockBook };

    jest.spyOn(service, 'create').mockReturnValue({
      Message: `Book added successfully.`,
      book,
    });

    const result = controller.create(mockBook);

    expect(result).toEqual({
      Message: `Book added successfully.`,
      book,
    });

    expect(service.create).toHaveBeenCalledWith(mockBook);
  });

  it('should return all books', () => {
    const books: Book[] = [
      { ...mockBook, id: id + `1`, name: mockBook.name + `1` },
      { ...mockBook, id: id + `2`, name: mockBook.name + `2` },
    ];

    jest.spyOn(service, 'findAll').mockReturnValue(books);

    const result = controller.findAll();

    expect(result).toEqual(books);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a book by ID', () => {
    const book: Book = { id, ...mockBook };

    jest.spyOn(service, 'findOne').mockReturnValue(book);

    const result = controller.findOne(id);

    expect(result).toEqual(book);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should remove a book by ID', () => {
    const mockResponse = `Book deleted successfully by ID: ${id}.`;

    jest.spyOn(service, 'remove').mockReturnValue(mockResponse);

    const result = controller.remove(id);

    expect(result).toEqual(mockResponse);
    expect(service.remove).toHaveBeenCalledWith(id);
  });

  it('should throw BadRequestException when removing a book with invalid ID', () => {
    expect(() => controller.remove('invalid-id')).toThrow(BadRequestException);
  });
});
