import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from './common/base.entity';

@Entity('user_metadatas')
export class UserMetadataEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;
}
