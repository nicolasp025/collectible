import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Item } from '../../item/entities/item.entity';

@Entity()
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  // Resized/compressed cover photo, generated server-side from the raw
  // image submitted on create/update. Collections never show a full-res
  // image anywhere, so only the thumbnail is kept.
  @Column({ type: 'text', nullable: true })
  thumbnail!: string | null;

  @OneToMany(() => Item, (item) => item.collection)
  items!: Item[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
