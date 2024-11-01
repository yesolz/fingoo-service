import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { CustomForecastIndicatorEntity } from '../entity/custom-forecast-indicator.entity';
import { UserMetadataEntity } from 'src/user/infrastructure/adapter/persistence/entity/user-metadata.entity';

export class CustomForecastIndicatorMapper {
  static mapDomainToNewEntity(
    customForecastIndicator: CustomForecastIndicator,
    member: UserMetadataEntity,
  ): CustomForecastIndicatorEntity {
    const customForecastIndicatorEntity: CustomForecastIndicatorEntity = CustomForecastIndicatorEntity.createNew(
      customForecastIndicator.customForecastIndicatorName,
      customForecastIndicator.type,
      customForecastIndicator.targetIndicator,
      customForecastIndicator.grangerVerification,
      customForecastIndicator.cointJohansenVerification,
      customForecastIndicator.sourceIndicatorsInformation,
      customForecastIndicator.sourceIndicators,
      member,
      customForecastIndicator.createdAt,
      customForecastIndicator.updatedAt,
    );
    return customForecastIndicatorEntity;
  }

  static mapEntityToDomain(entity: CustomForecastIndicatorEntity): CustomForecastIndicator {
    const customForecastIndicator: CustomForecastIndicator = new CustomForecastIndicator(
      entity.id,
      entity.customForecastIndicatorName,
      entity.type,
      entity.targetIndicator,
      entity.grangerVerification,
      entity.cointJohansenVerification,
      entity.sourceIndicatorsInformation,
      entity.sourceIndicators,
    );
    return customForecastIndicator;
  }
}
