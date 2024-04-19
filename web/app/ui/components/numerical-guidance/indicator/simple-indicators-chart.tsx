import { useLiveIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-live-indicators-value-view-model.hook';
import MultiLineChart from '../../view/molecule/multi-line-chart/multi-line-chart';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useCustomForecastIndicatorsValueViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-custom-forecast-indicators-value-view-model.hook';
import { createIndicatorFormatter } from '@/app/business/services/chart/indicator-formatter.service';

export default function SimpleIndicatorsChart() {
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const { indicatorsValue } = useLiveIndicatorsValueViewModel(selectedMetadata?.id);
  const { customForecastIndicatorsValue } = useCustomForecastIndicatorsValueViewModel();

  const indicatorFormatter = createIndicatorFormatter(
    indicatorsValue?.indicatorsValue ?? [],
    customForecastIndicatorsValue ?? [],
  );

  const formattedIndicatorsRows = indicatorFormatter.formattedIndicatorsInRow;

  return (
    <>
      {selectedMetadata?.indicatorIdsWithSectionIds ? (
        Object.keys(selectedMetadata?.indicatorIdsWithSectionIds).map((sectionId, index) => {
          const indicatorIds = selectedMetadata?.indicatorIdsWithSectionIds[`section${index + 1}`];

          const categories = indicatorFormatter
            .getIdentifiersByIds(indicatorIds)
            .map((indicator) => indicator.identifier);

          return (
            <MultiLineChart
              data-testid={`simple-indicators-chart-section${index + 1}`}
              key={sectionId}
              data={formattedIndicatorsRows || []}
              categories={categories}
              noDataText={
                selectedMetadata ? '선택한 지표가 없습니다. 지표를 선택해주세요' : '메타데이터를 선택해주세요'
              }
              syncId={'simple-indicators-chart'}
              className="h-80"
            />
          );
        })
      ) : (
        <MultiLineChart
          data={formattedIndicatorsRows || []}
          categories={[]}
          noDataText={selectedMetadata ? '선택한 지표가 없습니다. 지표를 선택해주세요' : '메타데이터를 선택해주세요'}
          className="h-80"
        />
      )}
    </>
  );
}
