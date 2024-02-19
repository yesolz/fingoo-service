import useSWR from 'swr';
import { API_PATH } from '../api-path';
import { defaultFetcher, deleteFetcher, patchFetcher, updateFetcher } from '../fetcher';
import useSWRMutation from 'swr/mutation';

// Risk: 중복된 응답 타입을 가져가는게 옳은 선택일까? (2/2) 분리 했음
export type IndicatorResponse = {
  ticker: string;
  name: string;
};

export type IndicatorBoardMetadataResponse = {
  id: string;
  name: string;
  indicators: IndicatorResponse[];
};

export type IndicatorBoardMetadataListResponse = {
  metadataList: IndicatorBoardMetadataResponse[];
};

export type IndicatorRequestBody = {
  ticker: string;
  name: string;
};

export type CreateIndicatorMetadataRequestBody = {
  id: string;
  name: string;
  indicators: IndicatorRequestBody[];
};

export type AddIndicatorToMetadataRequestBody = {
  ticker: string;
  name: string;
};

export const useFetchIndicatorBoardMetadataList = () =>
  useSWR<IndicatorBoardMetadataListResponse>(API_PATH.indicatorBoardMetadata, defaultFetcher);

export const useCreateIndicatorMetadata = () =>
  useSWRMutation(API_PATH.indicatorBoardMetadata, updateFetcher<CreateIndicatorMetadataRequestBody>);

export const useAddIndicatorToMetadata = (metadataId: string | undefined) =>
  useSWRMutation(
    API_PATH.indicatorBoardMetadata,
    async (url: string, { arg }: { arg: AddIndicatorToMetadataRequestBody }) => {
      if (!metadataId) return;
      await updateFetcher<AddIndicatorToMetadataRequestBody>([url, metadataId], {
        arg,
      });
    },
  );

export const useDeleteIndicatorFromMetadata = (metadataId: string | undefined) =>
  useSWRMutation(API_PATH.indicatorBoardMetadata, async (url, { arg }: { arg: string }) => {
    if (!metadataId) return;
    await deleteFetcher([url, metadataId, arg]);
  });

export type UpdateIndicatorBoardMetadataRequestBody = {
  name: string;
};

export const useUpdateIndicatorBoardMetadata = (metadataId: string | undefined) => {
  return useSWRMutation(
    API_PATH.indicatorBoardMetadata,
    async (url: string, { arg }: { arg: UpdateIndicatorBoardMetadataRequestBody }) => {
      if (!metadataId) return;
      await patchFetcher<UpdateIndicatorBoardMetadataRequestBody>([url, metadataId], { arg });
    },
  );
};

export const useDeleteIndicatorBoardMetadata = () => {
  return useSWRMutation(API_PATH.indicatorBoardMetadata, async (url, { arg: metadataId }: { arg: string }) => {
    await deleteFetcher([url, metadataId]);
  });
};