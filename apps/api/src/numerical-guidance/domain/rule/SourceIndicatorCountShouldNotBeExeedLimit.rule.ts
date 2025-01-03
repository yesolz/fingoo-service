import { SourceIndicatorInformation } from 'src/commons/type/type-definition';
import { BusinessRule } from '../../../commons/domain/business.rule';

const INDICATOR_MAXIMUM = 10;

export class SourceIndicatorCountShouldNotExceedLimitRule implements BusinessRule {
  constructor(private readonly sourceIndicatorIds: SourceIndicatorInformation[]) {}

  isBroken = () => this.sourceIndicatorIds.length > INDICATOR_MAXIMUM;

  get Message() {
    return `재료지표 개수는 최대 ${INDICATOR_MAXIMUM}개입니다.`;
  }
}
