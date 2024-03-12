import { useMemo } from 'react';
import {
  AddIndicatorToMetadataRequestBody,
  IndicatorBoardMetadataResponse,
  useAddIndicatorToMetadata,
  useDeleteIndicatorFromMetadata,
  useFetchIndicatorBoardMetadataList,
  useUpdateIndicatorBoardMetadata,
} from '../../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useNumericalGuidanceStore } from '../../../store/stores/numerical-guidance.store';
import { convertIndcatorBoardMetadataList } from '../../services/view-model/indicator-board-metadata-view-model.service';

export const useSelectedIndicatorBoardMetadata = () => {
  const selectedMetadataId = useNumericalGuidanceStore((state) => state.selectedMetadataId);
  const selectMetadata = useNumericalGuidanceStore((state) => state.actions.selectMetadata);
  const { data: indicatorBoardMetadataList } = useFetchIndicatorBoardMetadataList();

  const { trigger: addIndicatorTrigger } = useAddIndicatorToMetadata(selectedMetadataId);
  const { trigger: deleteIndicatorTrigger } = useDeleteIndicatorFromMetadata(selectedMetadataId);
  const { trigger: updateTrigger } = useUpdateIndicatorBoardMetadata(selectedMetadataId);

  const convertedIndicatorBoardMetadataList = useMemo(() => {
    if (!indicatorBoardMetadataList) return undefined;

    return convertIndcatorBoardMetadataList(indicatorBoardMetadataList);
  }, [indicatorBoardMetadataList]);

  const selectedMetadata = useMemo(() => {
    if (!selectedMetadataId) return undefined;
    return convertedIndicatorBoardMetadataList?.findIndicatorBoardMetadataById(selectedMetadataId);
  }, [selectedMetadataId, convertedIndicatorBoardMetadataList]);

  // Refactor: 컴포넌트는 AddIndicatorToMetadataRequestBody를 몰라도 된다.
  const addIndicatorToMetadata = (data: AddIndicatorToMetadataRequestBody) => {
    if (!selectedMetadata) {
      return;
    }

    try {
      addIndicatorTrigger(data, {
        optimisticData: (): IndicatorBoardMetadataResponse[] | undefined => {
          convertedIndicatorBoardMetadataList?.addIndicatorToMetadataById(selectedMetadataId, data.indicatorId);
          return convertedIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList;
        },
        revalidate: false,
      });
    } catch (e) {
      // error 처리 필요 or 전역 에러 처리
    }
  };

  const deleteIndicatorFromMetadata = (indicatorId: string) => {
    if (!selectedMetadata) {
      return;
    }

    try {
      deleteIndicatorTrigger(
        {
          indicatorId,
        },
        {
          optimisticData: (): IndicatorBoardMetadataResponse[] | undefined => {
            convertedIndicatorBoardMetadataList?.deleteIndicatorFromMetadataById(selectedMetadataId, indicatorId);
            return convertedIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList;
          },
          revalidate: false,
        },
      );
    } catch (e) {
      // error 처리 필요 or 전역 에러 처리
    }
  };

  const updateMetadata = (data: { name: string }) => {
    if (!selectedMetadata) {
      return;
    }
    updateTrigger(data, {
      optimisticData: (): IndicatorBoardMetadataResponse[] | undefined => {
        convertedIndicatorBoardMetadataList?.updateIndicatorBoardMetadataNameById(selectedMetadataId, data.name);
        return convertedIndicatorBoardMetadataList?.formattedIndicatorBoardMetadataList;
      },
      revalidate: false,
    });
  };

  return {
    selectedMetadataId,
    selectedMetadata,
    addIndicatorToMetadata,
    deleteIndicatorFromMetadata,
    updateMetadata,
    selectMetadataById: selectMetadata,
  };
};