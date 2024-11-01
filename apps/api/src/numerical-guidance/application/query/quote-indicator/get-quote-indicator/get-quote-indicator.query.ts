import { IQuery } from '@nestjs/cqrs';
import { IndicatorType } from '../../../../../commons/type/type-definition';
import { QuoteIndicatorIntervalEnum } from '../../../../../commons/enum/enum-definition';

export class GetQuoteIndicatorQuery implements IQuery {
  constructor(
    public readonly indicatorId: string,
    public readonly symbol: string,
    public readonly indicatorType: IndicatorType,
    public readonly volume_time_period?: string,
    public readonly mic_code?: string,
    public readonly eod?: boolean,
    public readonly interval?: QuoteIndicatorIntervalEnum,
    public readonly timezone?: string,
  ) {}
}
