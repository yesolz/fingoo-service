import { ForecastApiResponse } from 'src/commons/type/type-definition';

export interface LoadCustomForecastIndicatorValuesPort {
  loadCustomForecastIndicatorValues(customForecastIndicatorId: string): Promise<ForecastApiResponse>;
}
