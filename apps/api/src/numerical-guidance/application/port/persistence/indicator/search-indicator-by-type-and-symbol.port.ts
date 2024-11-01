import { IndicatorDtoType, IndicatorType } from '../../../../../commons/type/type-definition';

export interface SearchIndicatorByTypeAndSymbolPort {
  searchIndicatorByTypeAndSymbol(symbol: string, type: IndicatorType): Promise<IndicatorDtoType[]>;
}
