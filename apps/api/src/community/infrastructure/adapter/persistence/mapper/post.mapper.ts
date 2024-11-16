import { PostEntity } from '../entity/post.entity';
import { PostDomain } from '../../../../domain/post.domain';
import { CreatePostResponseDto } from '../../../../api/dto/response/create-post.response.dto';
import { UpdatePostResponseDto } from '../../../../api/dto/response/update-post.response.dto';
import { UserMetadataEntity } from '../../../../../user/infrastructure/adapter/persistence/entity/user-metadata.entity';
import { UserMetadataMapper } from '../../../../../user/infrastructure/adapter/persistence/mapper/user-metadata.mapper';
import { UserMetadataDomain } from '../../../../../user/domain/user-metadata.domain';
import { GetPostsResponseDto } from '../../../../api/dto/response/get-posts.response.dto';
import { GetPostReponseDto } from '../../../../api/dto/response/get-post.reponse.dto';
import { CursorPageMetadataDto } from '../../../../api/dto/response/cursor-page-metadata.dto';

export class PostMapper {
  static mapDomainToCreateDto(post: PostDomain) {
    return new CreatePostResponseDto(
      post.id.toString(),
      post.content,
      post.userMetadataDomain.username,
      post.createdAt.toString(),
      post.updatedAt.toString(),
    );
  }

  static mapDomainToUpdateDto(post: PostDomain) {
    return new UpdatePostResponseDto(
      post.id.toString(),
      post.content,
      post.userMetadataDomain.username,
      post.createdAt.toString(),
      post.updatedAt.toString(),
    );
  }

  static mapDomainToGetDto(post: PostDomain) {
    return new GetPostReponseDto(
      post.id.toString(),
      post.content,
      post.userMetadataDomain.username,
      post.createdAt.toString(),
      post.updatedAt.toString(),
    );
  }

  static mapDomainsToGetPageDto(
    postDomains: PostDomain[],
    total: number,
    hasNextData: boolean,
    nextCursor: number,
  ): GetPostsResponseDto<GetPostReponseDto> {
    const getPostResponseDtoList: GetPostReponseDto[] = postDomains.map((postDomain) => ({
      postId: postDomain.id.toString(),
      content: postDomain.content,
      author: postDomain.userMetadataDomain.username,
      viewCount: postDomain.viewCount.toString(),
      createdAt: postDomain.createdAt.toString(),
      updatedAt: postDomain.updatedAt.toString(),
    }));
    return new GetPostsResponseDto<GetPostReponseDto>(
      getPostResponseDtoList,
      new CursorPageMetadataDto(total, hasNextData, nextCursor),
    );
  }

  static mapEntityToDomain(postEntity: PostEntity, userMetadataEntity: UserMetadataEntity): PostDomain {
    const userMetadataDomain: UserMetadataDomain = UserMetadataMapper.mapEntityToDomain(userMetadataEntity);
    return PostDomain.create(
      postEntity.id,
      userMetadataDomain,
      postEntity.content,
      postEntity.viewCount,
      postEntity.createdAt,
      postEntity.updatedAt,
    );
  }
}
