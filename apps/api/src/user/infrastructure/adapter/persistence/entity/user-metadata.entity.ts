import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../../commons/entity/base.entity';
import { PostEntity } from '../../../../../community/infrastructure/adapter/persistence/entity/post.entity';

@Entity('user_metadatas')
export class UserMetadataEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') private _id: string;

  @Column() private _userId: string;

  @Column() private _email: string;

  @Column() private _username: string;

  @OneToMany(() => PostEntity, (post) => post.user) private _posts: PostEntity[];

  constructor() {
    super();
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get posts(): PostEntity[] {
    return this._posts;
  }

  set posts(value: PostEntity[]) {
    this._posts = value;
  }
}
