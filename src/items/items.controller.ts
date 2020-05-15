import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes,
         ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { GetItemsFilterDto } from './dto/get-items-filter.dto';
import { Item } from './item.entity';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('items')
@UseGuards(AuthGuard())
export class ItemsController {
  private logger = new Logger('ItemsController');
  constructor(private itemsService: ItemsService) {}

  @Get()
  getItems(
    @Query(ValidationPipe) filterDto: GetItemsFilterDto,
    @GetUser() user: User,
  ): Promise<object> {
    return this.itemsService.getItems(filterDto, user);
  }

  @Get('/:id')
  getItemById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Item> {
    return this.itemsService.getItemById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createItem(
    @Body() createItemDto: CreateItemDto,
    @GetUser() user: User,
  ): Promise<Item> {
    this.logger.verbose(`User "${user.username}" creating a new Item. Data: ${JSON.stringify(createItemDto)}`);
    return this.itemsService.createItem(createItemDto, user);
  }

  @Delete('/:id')
  deleteItem(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.itemsService.deleteItem(id, user);
  }

  @Patch('/:id')
  updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body('updateItem') updateItem: object,
    @GetUser() user: User,
  ): Promise<Item> {
    return this.itemsService.updateItem(id, updateItem, user);
  }
}
