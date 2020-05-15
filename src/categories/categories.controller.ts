import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes,
         ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { UpdateCategoryFilterDto } from './dto/update-category.dto';

import { Category } from './category.entity';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('categories')
@UseGuards(AuthGuard())
export class CategoriesController {
  private logger = new Logger('CategoriesController');
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  getCategories(
    @Query(ValidationPipe) filterDto: GetCategoriesFilterDto,
  ): Promise<object> {
    return this.categoriesService.getCategories(filterDto);
  }

  @Get('/:id')
  getCategoryById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Category> {
    return this.categoriesService.getCategoryById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() user: User,
  ): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Delete('/:id')
  deleteCategory(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.categoriesService.deleteCategory(id);
  }

  @Patch('/:id')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body('updateCategory') updateCategory: object,
    @GetUser() user: User,
  ): Promise<Category> {
    return this.categoriesService.updateCategory(id, updateCategory);
  }
}
