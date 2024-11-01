import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import {
  IndicatorDtoType,
  IndicatorType,
  SourceIndicatorInformation,
  Verification,
} from 'src/commons/type/type-definition';
import { UserMetadataEntity } from 'src/user/infrastructure/adapter/persistence/entity/user-metadata.entity';

@Entity({ name: 'CustomForecastIndicator' })
export class CustomForecastIndicatorEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customForecastIndicatorName: string;

  @Column()
  type: IndicatorType;

  @Column('jsonb', { nullable: true })
  targetIndicator: IndicatorDtoType;

  @Column('jsonb', { nullable: true })
  grangerVerification: Verification[];

  @Column('jsonb', { nullable: true })
  cointJohansenVerification: Verification[];

  @Column('jsonb', { nullable: true })
  sourceIndicatorsInformation: SourceIndicatorInformation[];

  @Column('jsonb', { nullable: true })
  sourceIndicators: IndicatorDtoType[];

  @ManyToOne(() => UserMetadataEntity, { eager: false })
  member: UserMetadataEntity;

  constructor(
    customForecastIndicatorName: string,
    type: IndicatorType,
    targetIndicator: IndicatorDtoType,
    grangerVerification: Verification[],
    cointJohansenVerification: Verification[],
    sourceIndicatorsInformation: SourceIndicatorInformation[],
    sourceIndicators: IndicatorDtoType[],
    member: UserMetadataEntity,
    createdAt: Date,
    updatedAt: Date,
  ) {
    super();
    this.customForecastIndicatorName = customForecastIndicatorName;
    this.type = type;
    this.targetIndicator = targetIndicator;
    this.grangerVerification = grangerVerification;
    this.cointJohansenVerification = cointJohansenVerification;
    this.sourceIndicatorsInformation = sourceIndicatorsInformation;
    this.sourceIndicators = sourceIndicators;
    this.member = member;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static createNew(
    customForecastIndicatorName: string,
    type: IndicatorType,
    targetIndicator: IndicatorDtoType,
    grangerVerification: Verification[],
    cointJohansenVerification: Verification[],
    sourceIndicatorsInformation: SourceIndicatorInformation[],
    sourceIndicators: IndicatorDtoType[],
    member: UserMetadataEntity,
    createdAt: Date,
    updatedAt: Date,
  ) {
    return new CustomForecastIndicatorEntity(
      customForecastIndicatorName,
      type,
      targetIndicator,
      grangerVerification,
      cointJohansenVerification,
      sourceIndicatorsInformation,
      sourceIndicators,
      member,
      createdAt,
      updatedAt,
    );
  }
}
