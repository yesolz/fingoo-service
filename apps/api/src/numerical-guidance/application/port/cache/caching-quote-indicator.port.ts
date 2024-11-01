import { IndicatorQuoteData } from '../../query/quote-indicator/get-quote-indicator/interface/quote-indicator-data.interface';
import { IndicatorDtoType } from '../../../../commons/type/type-definition';
import { QuoteIndicatorIntervalEnum } from '../../../../commons/enum/enum-definition';

export interface CachingQuoteIndicatorPort {
  cachingQuoteIndicator(
    quoteIndicatorDto: IndicatorQuoteData,
    indicatorDto: IndicatorDtoType,
    interval: QuoteIndicatorIntervalEnum,
    timezone: string,
  ): Promise<IndicatorQuoteData>;
}
