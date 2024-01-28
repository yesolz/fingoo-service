import { act, renderHook, waitFor } from '@testing-library/react';
import { SWRProviderWithoutCache } from '@/app/api/swr-provider';
import { resetMockDB } from '@/app/mocks/mock-db';
import { resetAllStore, useNumericalGuidanceStore } from '@/app/stores/numerical-guidance.store';
import { useSelectedMetadata } from '@/app/hooks/use-selected-metadata.hook';
import { useIndicatoBoardrMetadataList } from '@/app/hooks/use-indicator-board-metadata-list.hook';

const wrapper = SWRProviderWithoutCache;

describe('useSelectedMetadata', () => {
  beforeEach(() => {
    resetAllStore();
    resetMockDB();
  });
  it('선택된 메타데이터 가져오기', async () => {
    // given
    const { result } = renderHook(() => useSelectedMetadata(), { wrapper });
    const { result: query } = renderHook(() => useIndicatoBoardrMetadataList(), { wrapper });
    const { result: store } = renderHook(() => useNumericalGuidanceStore());

    // when
    await waitFor(() => expect(query.current.metadataList).not.toBeUndefined());

    act(() => {
      if (query.current.metadataList?.[0]) {
        store.current.actions.selectMetadata(query.current.metadataList?.[0].id);
      }
    });

    // then
    expect(result.current.selectedMetadata).toEqual(query.current.metadataList?.[0]);
  });

  it('선택된 메타데이터가 없을 때', async () => {
    // given
    const { result } = renderHook(() => useSelectedMetadata(), { wrapper });
    const { result: store } = renderHook(() => useNumericalGuidanceStore());

    // when
    store.current.actions.selectMetadata(null);

    // then
    expect(result.current.selectedMetadata).toBeUndefined();
  });
});
