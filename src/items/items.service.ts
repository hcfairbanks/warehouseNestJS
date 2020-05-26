import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { GetItemsFilterDto } from './dto/get-items-filter.dto';
import { ItemRepository } from './item.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './item.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemRepository)
    private itemRepository: ItemRepository,
  ) {}

  async getItems(
    filterDto: GetItemsFilterDto,
    user: User,
  ): Promise<object> {
    return this.itemRepository.getItems(filterDto, user);
  }

  async getItemById(
    id: number,
  ): Promise<Item> {
    const found = await this.itemRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Item with ID "${id}" not found`);
    }
    return found;
  }

  async createItem(
    createItemDto: CreateItemDto,
    user: User,
  ): Promise<Item> {
    return this.itemRepository.createItem(createItemDto, user);
  }

  async deleteItem(
    id: number,
    user: User,
  ): Promise<void> {
    // TODO Add role to db and check actions against role
    // Logger.verbose(`--User-- ${JSON.stringify(user)}---`);
    const result = await this.itemRepository.delete({ id});

    if (result.affected === 0) {
      throw new NotFoundException(`Item with ID "${id}" not found`);
    }
  }

  async updateItem(
    id: number,
    itemUpdate: any,
    user: User,
  ): Promise<Item> {

    const validParams = [
      'name',
      'description',
      'price',
      'weight',
      'purchaseDate',
      'purchaseDetails',
      'purchaseLocation',
      'categoryId',
      'userId',
    ];
    // TODO Add role to db and check actions against role
    // Logger.verbose(`--User-- ${JSON.stringify(user)}---`);

    const item = await this.getItemById(id);

    const keys = Object.keys(itemUpdate);
    keys.forEach( key => {
      if (itemUpdate[key] && validParams.includes(key)) {
        item[key] = itemUpdate[key];
      }
    });

    await item.save();
    return item;
  }
}
