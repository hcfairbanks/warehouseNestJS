import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { CategoryRepository } from './category.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
  ) {}

  async getCategories(
    filterDto: GetCategoriesFilterDto,
  ): Promise<object> {
    return this.categoryRepository.getCategories(filterDto);
  }

  async getCategoryById(
    id: number,
  ): Promise<Category> {
    const found = await this.categoryRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return found;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryRepository.createCategory(createCategoryDto);
  }

  async deleteCategory(
    id: number,
  ): Promise<void> {
    const result = await this.categoryRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
  }

  async updateCategory(
    id: number,
    categoryUpdate: any,
  ): Promise<Category> {
    const validParams = ['name'];
    const category = await this.getCategoryById(id);
    const keys = Object.keys(categoryUpdate);
    keys.forEach( key => {
      if (categoryUpdate[key] && validParams.includes(key)) {
        category[key] = categoryUpdate[key];
      }
    });
    await category.save();
    return category;
  }
}
