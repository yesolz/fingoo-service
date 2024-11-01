import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostEntity } from './entity/post.entity';
import { CreatePostPort } from '../../../application/port/persistence/post/create-post.port';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostDomain } from '../../../domain/post.domain';
import { PostMapper } from './mapper/post.mapper';
import { BusinessRuleValidationException } from '../../../../commons/domain/business-rule-validation.exception';
import { UserMetadataEntity } from '../../../../user/infrastructure/adapter/persistence/entity/user-metadata.entity';

@Injectable()
export class CommunityPersistentAdapter implements CreatePostPort {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postEntityRepository: Repository<PostEntity>,
    @InjectRepository(UserMetadataEntity)
    private readonly userMetadataEntityRepository: Repository<UserMetadataEntity>,
  ) {}

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

  // async updatePost(postId, content, userId): Promise<PostDomain> {
  //   throw new HttpException('Not Implemented', HttpStatus.NOT_IMPLEMENTED);
  // }
  //
  // async deletePost(postId, userId): Promise<boolean> {
  //   throw new HttpException('Not Implemented', HttpStatus.NOT_IMPLEMENTED);
  // }
}
