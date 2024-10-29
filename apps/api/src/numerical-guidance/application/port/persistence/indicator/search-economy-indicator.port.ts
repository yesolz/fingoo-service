import { IndicatorDtoType } from '../../../../../commons/type/type-definition';

export interface SearchEconomyIndicatorPort {
  searchEconomicIndicator(symbol: string): Promise<IndicatorDtoType[]>;
}
