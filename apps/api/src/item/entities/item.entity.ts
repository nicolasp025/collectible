import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Collection } from '../../collection/entities/collection.entity';

export class Attribute {
  key!: string;
  value!: string;
}

export enum ItemStatus {
  NOT_OWNED = 'not_owned',
  PENDING = 'pending',
  OWNED = 'owned',
}

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'int', nullable: true })
  releaseYear!: number | null;

  @Column({
    type: 'simple-enum',
    enum: ItemStatus,
    default: ItemStatus.NOT_OWNED,
  })
  status!: ItemStatus;

  @Column({ type: 'text', nullable: true })
  image!: string | null;

  // Resized/compressed copy of `image`, generated server-side. Used for the
  // collection grid so that view doesn't have to ship full-resolution
  // photos over the wire.
  @Column({ type: 'text', nullable: true })
  thumbnail!: string | null;

  @Column({ type: 'simple-json', default: '[]' })
  attributes!: Attribute[];

  @ManyToOne(() => Collection, (collection) => collection.items, {
    onDelete: 'CASCADE',
  })
  collection!: Collection;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
