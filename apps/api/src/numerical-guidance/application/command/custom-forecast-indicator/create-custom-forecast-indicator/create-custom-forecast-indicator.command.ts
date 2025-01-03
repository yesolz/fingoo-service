import { ICommand } from '@nestjs/cqrs';
import { IndicatorType } from 'src/commons/type/type-definition';

export class CreateCustomForecastIndicatorCommand implements ICommand {
  constructor(
    readonly customForecastIndicatorName: string,
    readonly targetIndicatorId: string,
    readonly targetIndicatorType: IndicatorType,
    readonly memberId: string,
  ) {}
}
