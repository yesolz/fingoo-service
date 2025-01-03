import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';

export interface LoadIndicatorBoardMetadataListPort {
  loadIndicatorBoardMetadataList(memberId: string): Promise<IndicatorBoardMetadata[]>;
}
