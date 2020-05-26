import { Item } from './item.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { GetItemsFilterDto } from './dto/get-items-filter.dto';
import { User } from '../auth/user.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {
  private logger = new Logger('ItemRepository');

  async getItems(
    filterDto: GetItemsFilterDto,
    user: User,
  ): Promise<object> {
    // TODO alphabetize
    const { page,
            name,
            id,
            categoryId,
            description,
            lessThanPrice,
            greaterThanPrice,
            lessThanPurchaseDate,
            greaterThanPurchaseDate,
            purchaseDetails,
            purchaseLocation,
            userId,
            lessThanWeight,
            greaterThanWeight } = filterDto;

    const likeFields = [{name, description, purchaseDetails, purchaseLocation}];
    const equalsFields = [{ id, categoryId, userId }];

    const lessThanFields = [{price: {lessThanPrice}}, {weight: {lessThanWeight}}, { purchaseDate: {lessThanPurchaseDate} } ];
    const greaterThanFields = [{price: {greaterThanPrice}}, {weight: {greaterThanWeight}}, { purchaseDate: {greaterThanPurchaseDate} }];

    const pageNumber = Number(page);
    const itemsPerPage = 10;
    const offset = itemsPerPage * ( pageNumber - 1 );
    const query = this.createQueryBuilder('item');

    query.innerJoin('item.user', 'user').addSelect(['user.username']);
    query.innerJoinAndSelect('item.category', 'category');

    equalsFields.forEach( thisField => {
      const keys = Object.keys(thisField);
      keys.forEach( key => {
        const value = {};
        value[key] = `${thisField[key]}`;
        if (thisField[key] !== undefined ) {
          query.andWhere(`item.${key} = :${key}`, value);
        }
      });
    });

    likeFields.forEach( thisField => {
      const keys = Object.keys(thisField);
      keys.forEach( key => {
        const value = {};
        value[key] = `%${thisField[key]}%`;
        if (thisField[key] !== undefined ) {
          query.andWhere(`item.${key} ILIKE :${key}`, value);
        }
      });
    });

    lessThanFields.forEach( thisField1 => {
      const entries1 = Object.entries(thisField1);
      const entries2 = Object.entries(entries1[0][1]);
      const value1 = {};
      value1[entries2[0][0]] = entries2[0][1];
      if (entries2[0][1]) {
       query.andWhere(`item.${entries1[0][0]} < :${entries2[0][0]}`, value1);
      }
    });

    greaterThanFields.forEach( thisField1 => {
      const entries1 = Object.entries(thisField1);
      const entries2 = Object.entries(entries1[0][1]);
      const value1 = {};
      value1[entries2[0][0]] = entries2[0][1];
      if (entries2[0][1]) {
        query.andWhere(`item.${entries1[0][0]} > :${entries2[0][0]}`, value1);
      }
    });

    // TODO Try Catch here
    const itemsCount = await query.getCount();
    const pageCount = Math.ceil(itemsCount / itemsPerPage);

    query.offset(offset);
    query.limit(itemsPerPage);

    try {
      const items = await query.getMany();
      return {items, pagination_details: {current_page: pageNumber, page_count: pageCount}};
    } catch (error) {
      this.logger.error(`Failed to get items for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async createItem(
    createItemDto: CreateItemDto,
    user: User,
  ): Promise<Item> {
    const { name,
            description,
            price,
            weight,
            categoryId,
            userId,
            purchaseDate,
            purchaseDetails,
            purchaseLocation } = createItemDto;
    const item = new Item();

    item.name = name;
    item.description = description;
    item.price = price;
    item.weight = weight;
    item.categoryId = categoryId;
    // TODO combine with next line
    // item.purchaseDate = new Date(purchaseDate);
    const date: Date = new Date(purchaseDate);
    item.purchaseDate = date;
    item.purchaseDetails = purchaseDetails;
    item.purchaseLocation = purchaseLocation;
    item.userId = userId;

    try {
      await item.save();
    } catch (error) {
      this.logger.error(`Failed to create a item for user "${user.username}". Data: ${createItemDto}`, error.stack);
      throw new InternalServerErrorException();
    }

    delete item.user;
    return item;
  }
}
