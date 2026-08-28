import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection } from './entities/collection.entity';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionsRepository: Repository<Collection>,
  ) {}

  create(createCollectionDto: CreateCollectionDto) {
    const collection = this.collectionsRepository.create(createCollectionDto);
    return this.collectionsRepository.save(collection);
  }

  findAll() {
    return this.collectionsRepository.find();
  }

  async findOne(id: string) {
    const collection = await this.collectionsRepository.findOne({
      where: { id },
      relations: ['items'],
      // The full-resolution `images` are only needed on the item detail
      // page, not for the collection grid — leaving them out keeps this
      // response (and every collection listing) light even with many/large
      // items or items with several photos.
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        items: {
          id: true,
          name: true,
          releaseYear: true,
          status: true,
          thumbnail: true,
          attributes: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    });
    if (!collection) {
      throw new NotFoundException(`Collection ${id} not found`);
    }
    return collection;
  }

  async update(id: string, updateCollectionDto: UpdateCollectionDto) {
    const collection = await this.findOne(id);
    Object.assign(collection, updateCollectionDto);
    return this.collectionsRepository.save(collection);
  }

  async remove(id: string) {
    const collection = await this.findOne(id);
    await this.collectionsRepository.remove(collection);
  }
}
