import { IndicatorDtoType, LiveIndicatorDtoType } from '../../../../../commons/type/type-definition';

export interface LoadLiveEconomyIndicatorPort {
  loadLiveIndicator(
    indicatorDto: IndicatorDtoType,
    interval: string,
    startDate: string,
    endDate: string,
  ): Promise<LiveIndicatorDtoType>;
}
