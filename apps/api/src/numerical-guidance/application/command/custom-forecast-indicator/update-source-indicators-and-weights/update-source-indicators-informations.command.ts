import { ICommand } from '@nestjs/cqrs';
import { SourceIndicatorInformation } from 'src/commons/type/type-definition';

export class UpdateSourceIndicatorsInformationCommand implements ICommand {
  constructor(
    readonly customForecastIndicatorId: string,
    readonly sourceIndicatorsInformation: SourceIndicatorInformation[],
  ) {}
}
