import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionService } from '../collection/collection.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { generateThumbnailSafe } from './thumbnail';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    private readonly collectionService: CollectionService,
  ) {}

  async create(collectionId: string, createItemDto: CreateItemDto) {
    const collection = await this.collectionService.findOne(collectionId);
    const images = createItemDto.images ?? [];
    const thumbnail = images[0] ? await generateThumbnailSafe(images[0]) : null;
    const item = this.itemsRepository.create({
      ...createItemDto,
      images,
      thumbnail,
      collection,
    });
    return this.itemsRepository.save(item);
  }

  async findAll(collectionId: string) {
    await this.collectionService.findOne(collectionId);
    return this.itemsRepository.find({
      where: { collection: { id: collectionId } },
    });
  }

  async findOne(collectionId: string, id: string) {
    const item = await this.itemsRepository.findOne({
      where: { id, collection: { id: collectionId } },
    });
    if (!item) {
      throw new NotFoundException(
        `Item ${id} not found in collection ${collectionId}`,
      );
    }
    return item;
  }

  async update(collectionId: string, id: string, updateItemDto: UpdateItemDto) {
    const item = await this.findOne(collectionId, id);
    Object.assign(item, updateItemDto);
    if ('images' in updateItemDto) {
      const images = updateItemDto.images ?? [];
      item.images = images;
      item.thumbnail = images[0] ? await generateThumbnailSafe(images[0]) : null;
    }
    return this.itemsRepository.save(item);
  }

  async remove(collectionId: string, id: string) {
    const item = await this.findOne(collectionId, id);
    await this.itemsRepository.remove(item);
  }
}
