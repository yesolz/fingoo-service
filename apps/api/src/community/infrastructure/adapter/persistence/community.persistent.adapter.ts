import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PostEntity } from './entity/post.entity';
import { CreatePostPort } from '../../../application/port/persistence/post/create-post.port';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostDomain } from '../../../domain/post.domain';
import { PostMapper } from './mapper/post.mapper';
import { BusinessRuleValidationException } from '../../../../commons/domain/business-rule-validation.exception';
import { UserMetadataEntity } from '../../../../user/infrastructure/adapter/persistence/entity/user-metadata.entity';
import { UpdatePostPort } from '../../../application/port/persistence/post/update-post.port';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class CommunityPersistentAdapter implements CreatePostPort, UpdatePostPort {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postEntityRepository: Repository<PostEntity>,
    @InjectRepository(UserMetadataEntity)
    private readonly userMetadataEntityRepository: Repository<UserMetadataEntity>,
  ) {}

  @Transactional()
  async createPost(content: string, userId: string): Promise<PostDomain> {
    let postEntity = new PostEntity();
    postEntity.content = content;
    postEntity.userId = userId;
    try {
      postEntity = await this.postEntityRepository.save(postEntity);
      const userMetadataEntity: UserMetadataEntity = await this.userMetadataEntityRepository.findOne({
        where: { userId: userId },
      });
      return PostMapper.mapEntityToDomain(postEntity, userMetadataEntity);
    } catch (error) {
      if (error instanceof BusinessRuleValidationException) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 비즈니스 룰에 어긋난 행위 감지',
          message: error.message,
          cause: error.message,
        });
      }

      throw new InternalServerErrorException({
        HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        error: '[ERROR] 서버 내부 에러 발생',
        message: error.message,
        cause: error.message,
      });
    }
  }

  @Transactional()
  async updatePost(postId, content, userId): Promise<PostDomain> {
    let postEntity: PostEntity = await this.postEntityRepository.findOne({ where: { id: postId } });
    if (postEntity === null) {
      throw new NotFoundException({
        HttpStatus: HttpStatus.NOT_FOUND,
        error: '[ERROR] 해당 게시글이 존재하지 않습니다.',
        message: '해당 게시글이 존재하지 않습니다.',
      });
    }
    if (postEntity.userId !== userId) {
      throw new ForbiddenException({
        HttpStatus: HttpStatus.FORBIDDEN,
        error: '[ERROR] 해당 게시글을 수정할 권한이 없습니다.',
        message: '해당 게시글을 수정할 권한이 없습니다.',
      });
    }
    try {
      postEntity.content = content;
      postEntity = await this.postEntityRepository.save(postEntity);
      const userMetadataEntity: UserMetadataEntity = await this.userMetadataEntityRepository.findOne({
        where: { userId: userId },
      });
      return PostMapper.mapEntityToDomain(postEntity, userMetadataEntity);
    } catch (error) {
      if (error instanceof BusinessRuleValidationException) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 비즈니스 룰에 어긋난 행위 감지',
          message: error.message,
          cause: error.message,
        });
      }
      throw new InternalServerErrorException({
        HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        error: '[ERROR] 서버 내부 에러 발생',
        message: error.message,
        cause: error.message,
      });
    }
  }

  //
  // async deletePost(postId, userId): Promise<boolean> {
  //   throw new HttpException('Not Implemented', HttpStatus.NOT_IMPLEMENTED);
  // }
}
