import { ICommand } from '@nestjs/cqrs';
import { IndicatorType } from '../../../../../commons/type/type-definition';

export class InsertIndicatorIdCommand implements ICommand {
  constructor(
    readonly indicatorBoardMetadataId: string,
    readonly indicatorId: string,
    readonly indicatorType: IndicatorType,
  ) {}
}
