import { IQuery } from '@nestjs/cqrs';
import { IndicatorType } from '../../../../../commons/type/type-definition';

export class GetIndicatorListQuery implements IQuery {
  constructor(
    readonly type: IndicatorType,
    readonly cursorToken: number,
  ) {}
}
