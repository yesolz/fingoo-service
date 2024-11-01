import { IndicatorDtoType, IndicatorType } from '../../../../../commons/type/type-definition';
import { CursorPageDto } from '../../../../../commons/pagination/cursor-page.dto';

export interface LoadIndicatorListPort {
  loadIndicatorList(type: IndicatorType, cursorToken: number): Promise<CursorPageDto<IndicatorDtoType>>;
}
