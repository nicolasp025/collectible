import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CollectionModule } from '../collection/collection.module';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { Item } from './entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), CollectionModule, AuthModule],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
