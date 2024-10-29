import { IndicatorDtoType, Interval, LiveIndicatorDtoType } from '../../../../../commons/type/type-definition';

export interface LoadLiveIndicatorPort {
  loadLiveIndicator(
    indicatorDto: IndicatorDtoType,
    interval: Interval,
    startDate: string,
    endDate: string,
  ): Promise<LiveIndicatorDtoType>;
}
