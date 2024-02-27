import { useFetchCustomForecastIndicatorList } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import {
  CustomForecastIndicators,
  convertCustomForecastIndicatorsViewModel,
} from '../../services/view-model/custom-forecast-indicator-view-model.service';
import { useMemo } from 'react';

export const useCustomForecastIndicatorListViewModel = () => {
  const { data: customForecastIndicatorList } = useFetchCustomForecastIndicatorList();

  const convertedCustomForecastIndicatorList = useMemo(() => {
    if (!customForecastIndicatorList) return undefined;

    return convertCustomForecastIndicatorsViewModel(customForecastIndicatorList);
  }, [customForecastIndicatorList]);

  return {
    customForecastIndicatorList: convertedCustomForecastIndicatorList,
  };
};
