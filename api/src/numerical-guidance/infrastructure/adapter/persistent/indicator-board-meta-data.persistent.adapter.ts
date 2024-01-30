import { Injectable } from '@nestjs/common';
import { CreateIndicatorBoardMetaDataPort } from '../../../application/port/persistent/create-indicator-board-meta-data.port';
import { IndicatorBoardMetaData } from '../../../domain/indicator-board-meta-data';

import { IndicatorBoardMetaDataEntity } from './entity/indicator-board-meta-data.entity';
import { IndicatorBoardMetaDataMapper } from './mapper/indicator-board-meta-data.mapper';

@Injectable()
export class IndicatorBoardMetaDataPersistentAdapter implements CreateIndicatorBoardMetaDataPort {
  async createIndicatorBoardMetaData(indicatorBoardMetaData: IndicatorBoardMetaData): Promise<void> {
    const indicatorBoardMetaDataEntity: IndicatorBoardMetaDataEntity = IndicatorBoardMetaDataMapper.mapToEntity(
      indicatorBoardMetaData.indicatorBoardMetaDataName,
      indicatorBoardMetaData.indicatorIds,
      indicatorBoardMetaData.memberId,
    );
    await indicatorBoardMetaDataEntity.save();
  }
}
