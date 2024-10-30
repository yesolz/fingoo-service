import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './common/base.entity';

@Entity('posts')
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  viewCount: number;
}
