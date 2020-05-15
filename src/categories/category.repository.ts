import { Category } from './category.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  private logger = new Logger('CategoryRepository');

  async getCategories(
    filterDto: GetCategoriesFilterDto,
  ): Promise<object> {
    const { page,
            name,
            id } = filterDto;

    const likeFields = [{name}];
    const equalsFields = [{ id }];

    const pageNumber = Number(page);
    const categoriesPerPage = 10;
    const offset = categoriesPerPage * ( pageNumber - 1 );
    const query = this.createQueryBuilder('category');

    equalsFields.forEach( thisField => {
      const keys = Object.keys(thisField);
      keys.forEach( key => {
        const value = {};
        value[key] = `${thisField[key]}`;
        if (thisField[key] !== undefined ) {
          query.andWhere(`category.${key} = :${key}`, value);
        }
      });
    });

    likeFields.forEach( thisField => {
      const keys = Object.keys(thisField);
      keys.forEach( key =>{
        const value = {};
        value[key] = `%${thisField[key]}%`;
        if (thisField[key] !== undefined ) {
          query.andWhere(`category.${key} ILIKE :${key}`, value);
        }
      });
    });

    // TODO put in a try catch
    const categoriesCount = await query.getCount();
    const pageCount = Math.ceil(categoriesCount / categoriesPerPage);

    query.offset(offset);
    query.limit(categoriesPerPage);

    try {
      const categories = await query.getMany();
      return {categories, pagination_details: { current_page: pageNumber,
                                           page_count: pageCount }};
    } catch (error) {
      this.logger.error(`Failed to get categories .` +
                        `Filters: ${JSON.stringify(filterDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { name } = createCategoryDto;
    const category = new Category();
    category.name = name;
    try {
      await category.save();
    } catch (error) {
      this.logger.error(`Failed to create a category. ` +
                        `Data: ${createCategoryDto}`,
                        error.stack);
      throw new InternalServerErrorException();
    }
    return category;
  }
}
