import { Module } from '@nestjs/common';
import { LiveIndicatorRedisAdapter } from './infrastructure/adapter/redis/live-indicator.redis.adapter';
import { LiveIndicatorKrxAdapter } from './infrastructure/adapter/krx/live-indicator.krx.adapter';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { GetIndicatorsQueryHandler } from './application/query/indicator/get-indicator/get-indicators.query.handler';
import { IndicatorPersistentAdapter } from './infrastructure/adapter/persistence/indicator/indicator.persistent.adapter';
import { CreateIndicatorBoardMetadataCommandHandler } from './application/command/indicator-board-metadata/create-indicator-board-metadata/create-indicator-board-metadata.command.handler';
import { IndicatorBoardMetadataPersistentAdapter } from './infrastructure/adapter/persistence/indicator-board-metadata/indicator-board-metadata.persistent.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorBoardMetadataEntity } from './infrastructure/adapter/persistence/indicator-board-metadata/entity/indicator-board-metadata.entity';
import { AuthService } from '../auth/auth.service';
import { MemberEntity } from '../auth/member.entity';
import { GetIndicatorBoardMetadataQueryHandler } from './application/query/indicator-board-metadata/get-indicator-board-metadata/get-indicator-board-metadata.query.handler';
import { InsertIndicatorIdCommandHandler } from './application/command/indicator/insert-indicator-id/insert-indicator-id.command.handler';
import { GetIndicatorBoardMetadataListQueryHandler } from './application/query/indicator-board-metadata/get-indicator-board-metadata-list/get-indicator-board-metadata-list.query.handler';
import { DeleteIndicatorIdCommandHandler } from './application/command/indicator/delete-indicator-id/delete-indicator-id.command.handler';
import { DeleteIndicatorBoardMetadataCommandHandler } from './application/command/indicator-board-metadata/delete-indicator-board-metadata/delete-indicator-board-metadata.command.handler';
import { UpdateIndicatorBoardMetadataNameCommandHandler } from './application/command/indicator-board-metadata/update-indicator-board-metadata-name/update-indicator-board-metadata-name.command.handler';
import { GetLiveIndicatorQueryHandler } from './application/query/live-indicator/get-live-indicator/get-live-indicator.query.handler';
import { IndicatorEntity } from './infrastructure/adapter/persistence/indicator/entity/indicator.entity';
import { GetHistoryIndicatorQueryHandler } from './application/query/history-indicator/get-history-indicator/get-history-indicator.query.handler';
import { HistoryIndicatorPersistentAdapter } from './infrastructure/adapter/persistence/history-indicator/history-indicator.persistent.adapter';
import { HistoryIndicatorValueEntity } from './infrastructure/adapter/persistence/history-indicator-value/entity/history-indicator-value.entity';
import { HistoryIndicatorEntity } from './infrastructure/adapter/persistence/history-indicator/entity/history-indicator.entity';
import { AdjustIndicatorValue } from './util/adjust-indicator-value';
import { CreateCustomForecastIndicatorCommandHandler } from './application/command/custom-forecast-indicator/create-custom-forecast-indicator/create-custom-forecast-indicator.command.handler';
import { CustomForecastIndicatorPersistentAdapter } from './infrastructure/adapter/persistence/custom-forecast-indicator/custom-forecast-indicator.persistent.adapter';
import { CustomForecastIndicatorEntity } from './infrastructure/adapter/persistence/custom-forecast-indicator/entity/custom-forecast-indicator.entity';
import { GetCustomForecastIndicatorQueryHandler } from './application/query/custom-forecast-indicator/get-custom-forecast-indicator/get-custom-forecast-indicator.query.handler';
import { GetCustomForecastIndicatorsByMemberIdQueryHandler } from './application/query/custom-forecast-indicator/get-custom-forecast-indicators-by-member-id/get-custom-forecast-indicators-by-member-id.query.handler';
import { UpdateSourceIndicatorsAndWeightsCommandHandler } from './application/command/custom-forecast-indicator/update-source-indicators-and-weights/update-source-indicators-and-weights.command.handler';
import { GetCustomForecastIndicatorValuesQueryHandler } from './application/query/custom-forecast-indicator/get-custom-forecast-indicator-values/get-custom-forecast-indicator-values.query.handler';
import { InsertCustomForecastIndicatorIdCommandHandler } from './application/command/custom-forecast-indicator/insert-custom-forecast-indicator-id/insert-custom-forecast-indicator-id.command.handler';
import { CustomForecastIndicatorController } from './api/custom-forecast-indicator/custom-forecast-indicator.controller';
import { HistoryIndicatorController } from './api/history-indicator/history-indicator.controller';
import { IndicatorController } from './api/indicator/indicator.controller';
import { IndicatorBoardMetadataController } from './api/indicator-board-metadata/indicator-board-metadata.controller';
import { LiveIndicatorController } from './api/live-indicator/live-indicator.controller';
import { DeleteCustomForecastIndicatorIdCommandHandler } from './application/command/custom-forecast-indicator/delete-custom-forecast-indicator-id/delete-custom-forecast-indicator-id.command.handler';
import { DeleteCustomForecastIndicatorCommandHandler } from './application/command/custom-forecast-indicator/delete-custom-forecast-indicator/delete-custom-forecast-indicator.command.handler';
import { UpdateCustomForecastIndicatorNameCommandHandler } from './application/command/custom-forecast-indicator/update-custom-forecast-indicator-name/update-custom-forecast-indicator-name.command.handler';
import { FileSupabaseAdapter } from './infrastructure/adapter/storage/file.supabase.adapter';
import { UploadFileCommandHandler } from './application/command/indicator-board-metadata/upload-file/upload-file.command.handler';
import { UpdateSectionsCommandHandler } from './application/command/indicator-board-metadata/update-sections/update-sections.command.handler';

@Module({
  imports: [
    CqrsModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 10000,
        maxRedirects: 5,
      }),
    }),
    TypeOrmModule.forFeature([
      IndicatorBoardMetadataEntity,
      MemberEntity,
      IndicatorEntity,
      HistoryIndicatorEntity,
      HistoryIndicatorValueEntity,
      CustomForecastIndicatorEntity,
    ]),
  ],
  controllers: [
    CustomForecastIndicatorController,
    HistoryIndicatorController,
    IndicatorController,
    IndicatorBoardMetadataController,
    LiveIndicatorController,
  ],
  providers: [
    AdjustIndicatorValue,
    AuthService,
    GetLiveIndicatorQueryHandler,
    GetHistoryIndicatorQueryHandler,
    GetIndicatorsQueryHandler,
    CreateIndicatorBoardMetadataCommandHandler,
    GetIndicatorBoardMetadataQueryHandler,
    InsertIndicatorIdCommandHandler,
    GetIndicatorBoardMetadataListQueryHandler,
    DeleteIndicatorIdCommandHandler,
    DeleteIndicatorBoardMetadataCommandHandler,
    UpdateIndicatorBoardMetadataNameCommandHandler,
    CreateCustomForecastIndicatorCommandHandler,
    GetCustomForecastIndicatorQueryHandler,
    GetCustomForecastIndicatorsByMemberIdQueryHandler,
    UpdateSourceIndicatorsAndWeightsCommandHandler,
    GetCustomForecastIndicatorValuesQueryHandler,
    InsertCustomForecastIndicatorIdCommandHandler,
    DeleteCustomForecastIndicatorIdCommandHandler,
    DeleteCustomForecastIndicatorCommandHandler,
    UpdateCustomForecastIndicatorNameCommandHandler,
    UploadFileCommandHandler,
    UpdateSectionsCommandHandler,
    {
      provide: 'LoadCachedLiveIndicatorPort',
      useClass: LiveIndicatorRedisAdapter,
    },
    {
      provide: 'LoadLiveIndicatorPort',
      useClass: LiveIndicatorKrxAdapter,
    },
    {
      provide: 'LoadHistoryIndicatorPort',
      useClass: HistoryIndicatorPersistentAdapter,
    },
    {
      provide: 'CachingLiveIndicatorPort',
      useClass: LiveIndicatorRedisAdapter,
    },
    {
      provide: 'LoadIndicatorsPort',
      useClass: IndicatorPersistentAdapter,
    },
    {
      provide: 'LoadIndicatorPort',
      useClass: IndicatorPersistentAdapter,
    },
    {
      provide: 'CreateIndicatorBoardMetadataPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'LoadIndicatorBoardMetadataPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'InsertIndicatorIdPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'LoadIndicatorBoardMetadataListPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'DeleteIndicatorIdPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'UpdateSectionsPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'DeleteIndicatorBoardMetadataPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'UpdateIndicatorBoardMetadataNamePort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'IndicatorValueManager',
      useClass: AdjustIndicatorValue,
    },
    {
      provide: 'CreateCustomForecastIndicatorPort',
      useClass: CustomForecastIndicatorPersistentAdapter,
    },
    {
      provide: 'LoadCustomForecastIndicatorPort',
      useClass: CustomForecastIndicatorPersistentAdapter,
    },
    {
      provide: 'LoadCustomForecastIndicatorsByMemberIdPort',
      useClass: CustomForecastIndicatorPersistentAdapter,
    },
    {
      provide: 'UpdateSourceIndicatorsAndWeightsPort',
      useClass: CustomForecastIndicatorPersistentAdapter,
    },
    {
      provide: 'LoadCustomForecastIndicatorValuesPort',
      useClass: CustomForecastIndicatorPersistentAdapter,
    },
    {
      provide: 'InsertCustomForecastIndicatorIdPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'DeleteCustomForecastIndicatorIdPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'DeleteCustomForecastIndicatorPort',
      useClass: CustomForecastIndicatorPersistentAdapter,
    },
    {
      provide: 'UpdateCustomForecastIndicatorNamePort',
      useClass: CustomForecastIndicatorPersistentAdapter,
    },
    {
      provide: 'UploadFilePort',
      useClass: FileSupabaseAdapter,
    },
  ],
})
export class NumericalGuidanceModule {}
