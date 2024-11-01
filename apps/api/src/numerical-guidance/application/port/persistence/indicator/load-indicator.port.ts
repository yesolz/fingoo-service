import { IndicatorDtoType, IndicatorType } from '../../../../../commons/type/type-definition';

export interface LoadIndicatorPort {
  loadIndicator(id: string, indicatorType: IndicatorType): Promise<IndicatorDtoType>;
}
