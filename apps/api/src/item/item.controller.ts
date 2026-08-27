import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('collections/:collectionId/items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  create(
    @Param('collectionId', ParseUUIDPipe) collectionId: string,
    @Body() createItemDto: CreateItemDto,
  ) {
    return this.itemService.create(collectionId, createItemDto);
  }

  @Get()
  findAll(@Param('collectionId', ParseUUIDPipe) collectionId: string) {
    return this.itemService.findAll(collectionId);
  }

  @Get(':id')
  findOne(
    @Param('collectionId', ParseUUIDPipe) collectionId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.itemService.findOne(collectionId, id);
  }

  @Patch(':id')
  update(
    @Param('collectionId', ParseUUIDPipe) collectionId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemService.update(collectionId, id, updateItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('collectionId', ParseUUIDPipe) collectionId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.itemService.remove(collectionId, id);
  }
}
