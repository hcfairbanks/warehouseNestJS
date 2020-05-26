import { Test } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { ItemRepository } from './item.repository';
import { GetItemsFilterDto } from './dto/get-items-filter.dto';
import { NotFoundException } from '@nestjs/common';

const mockUser = { id: 12, username: 'Test User', email: 'test@test.com' };

const mockItemRepository = () => ({
  getItems: jest.fn(),
  findOne: jest.fn(),
  createItem: jest.fn(),
  delete: jest.fn(),
});

describe('ItemsService', () => {
  let itemsService;
  let itemRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ItemsService,
        { provide: ItemRepository, useFactory: mockItemRepository },
      ],
    }).compile();

    itemsService = await module.get<ItemsService>(ItemsService);
    itemRepository = await module.get<ItemRepository>(ItemRepository);
  });

  describe('getItems', () => {
    it('gets all Items from the repository', async () => {
      itemRepository.getItems.mockResolvedValue([]);

      expect(itemRepository.getItems).not.toHaveBeenCalled();
      const filters: GetItemsFilterDto = {
        page: 1,
        name: 'someItemName',
        id: null,
        categoryId: null,
        description: null,
        lessThanPrice: null,
        greaterThanPrice: null,
        purchaseDate: null,
        lessThanPurchaseDate: null,
        greaterThanPurchaseDate: null,
        purchaseDetails: null,
        purchaseLocation: null,
        userId: null,
        lessThanWeight: null,
        greaterThanWeight: null,
      };
      const result = await itemsService.getItems(filters, mockUser);
      expect(itemRepository.getItems).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getItemsById', () => {
    it('calls itemsRepository.findOne() and succesffuly retrieve and return the item', async () => {
      const mockItem = { name: 'Test item', description: 'Test desc' };
      itemRepository.findOne.mockResolvedValue(mockItem);

      const result = await itemsService.getItemById(1, mockUser);
      expect(result).toEqual(mockItem);

      expect(itemRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });
    });

    it('throws an error as item is not found', () => {
      itemRepository.findOne.mockResolvedValue(null);
      expect(itemsService.getItemById(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createItem', () => {
    it('calls itemRepository.create() and returns the result', async () => {
      itemRepository.createItem.mockResolvedValue('someTask');

      expect(itemRepository.createItem).not.toHaveBeenCalled();
      const createItemDto = { name: 'Test item', description: 'Test desc' };
      const result = await itemsService.createItem(createItemDto, mockUser);
      expect(itemRepository.createItem).toHaveBeenCalledWith(createItemDto, mockUser);
      expect(result).toEqual('someTask');
    });
  });

  describe('deleteItem', () => {
    it('calls itemRepository.deleteItem() to delete an item', async () => {
      itemRepository.delete.mockResolvedValue({ affected: 1 });
      expect(itemRepository.delete).not.toHaveBeenCalled();
      await itemsService.deleteItem(1, mockUser);
      expect(itemRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('throws an error as item could not be found', () => {
      itemRepository.delete.mockResolvedValue({ affected: 0 });
      expect(itemsService.deleteItem(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateItem', () => {
    it('updates an Item', async () => {
      const save = jest.fn().mockResolvedValue(true);

      itemsService.getItemById = jest.fn().mockResolvedValue({
        name: 'name update',
        save,
      });

      expect(itemsService.getItemById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const result = await itemsService.updateItem(1, 'name update');
      expect(itemsService.getItemById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.name).toEqual('name update');
    });
  });
});
