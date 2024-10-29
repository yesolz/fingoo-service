import { Interval } from '../../../../../commons/type/type-definition';
import { CursorPageDto } from '../../../../../commons/pagination/cursor-page.dto';
import { HistoryIndicatorDto } from '../../../query/history-indicator/get-history-indicator/dto/history-indicator.dto';

export interface LoadHistoryIndicatorPort {
  loadHistoryIndicator(
    indicatorId: string,
    interval: Interval,
    dataCount: number,
    endDate: string,
  ): Promise<CursorPageDto<HistoryIndicatorDto>>;
}
