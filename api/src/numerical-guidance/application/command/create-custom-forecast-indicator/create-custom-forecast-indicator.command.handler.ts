import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCustomForecastIndicatorPort } from '../../port/persistence/custom-forecast-indicator/create-custom-forecast-indicator.port';
import { CreateCustomForecastIndicatorCommand } from './create-custom-forecast-indicator.command';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { Transactional } from 'typeorm-transactional';

@Injectable()
@CommandHandler(CreateCustomForecastIndicatorCommand)
export class CreateCustomForecastIndicatorCommandHandler implements ICommandHandler {
  constructor(
    @Inject('CreateCustomForecastIndicatorPort')
    private readonly createCustomForecastIndicatorPort: CreateCustomForecastIndicatorPort,
  ) {}

  @Transactional()
  async execute(command: CreateCustomForecastIndicatorCommand): Promise<CustomForecastIndicator> {
    const { customForecastIndicatorName, targetIndicatorId } = command;
    const customForecastIndicator: CustomForecastIndicator = CustomForecastIndicator.createNew(
      customForecastIndicatorName,
      targetIndicatorId,
    );

    await this.createCustomForecastIndicatorPort.createCustomForecastIndicator(customForecastIndicator);

    return customForecastIndicator;
  }
}