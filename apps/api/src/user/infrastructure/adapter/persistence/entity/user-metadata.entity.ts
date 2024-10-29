import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../../commons/entity/base.entity';
import { PostEntity } from '../../../../../community/infrastructure/adapter/persistence/entity/post.entity';

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

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];
}
