import { UserMetadataEntity } from '../entity/user-metadata.entity';
import { UserMetadataDomain } from '../../../../domain/user-metadata.domain';
import { GetUserResponseDto } from '../../../../api/dto/response/get-user.response.dto';
import { UpdateUserResponseDto } from '../../../../api/dto/response/update-user.response.dto';

export class UserMetadataMapper {
  static mapDomainToGetDto(userMetadataDomain: UserMetadataDomain): GetUserResponseDto {
    return new GetUserResponseDto(userMetadataDomain.email, userMetadataDomain.username);
  }

  static mapDomainToUpdateDto(userMetadataDomain: UserMetadataDomain): UpdateUserResponseDto {
    return new UpdateUserResponseDto(userMetadataDomain.email, userMetadataDomain.username);
  }

  static mapEntityToDomain(userMetadataEntity: UserMetadataEntity): UserMetadataDomain {
    return UserMetadataDomain.create(
      userMetadataEntity.id,
      userMetadataEntity.userId,
      userMetadataEntity.email,
      userMetadataEntity.username,
    );
  }
}
