import { IndicatorDtoType } from 'src/commons/type/type-definition';

export interface SearchIndicatorBySymbolPort {
  searchIndicatorBySymbol(symbol: string): Promise<IndicatorDtoType>;
}
