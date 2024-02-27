import { SWRConfig } from 'swr';
import ClientDataSuspense from '../../components/view/atom/client-data-suspense';
import CustomForecastIndicatorList from '../../components/numerical-guidance/molecule/custom-forecast-indicator-list';

export default function CustomForecastIndicatorListContainer() {
  return (
    <ClientDataSuspense fallback={<div>loading...</div>}>
      <SWRConfig
        value={{
          suspense: true,
        }}
      >
        <CustomForecastIndicatorList />;
      </SWRConfig>
    </ClientDataSuspense>
  );
}
