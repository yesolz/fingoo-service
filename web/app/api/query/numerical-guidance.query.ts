import useSWR from 'swr';
import { API_PATH } from '../api-path';
import { paramFetcher } from '../fetcher';

// Risk: 중복된 응답 타입을 가져가는게 옳은 선택일까?
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

export type IndicatorListResponse = {
  indicatorList: IndicatorResponse[];
};

export const useFetchIndicatorBoardMetadataList = () =>
  useSWR<IndicatorBoardMetadataListResponse>(API_PATH.metadataList);

export const useFetchIndicatorList = () => useSWR<IndicatorListResponse>(API_PATH.indicatorList);

export const useFetchMetadata = (metadataId: string | null) =>
  useSWR<IndicatorBoardMetadataResponse, any, [string, string] | null>(
    metadataId ? [API_PATH.metadata, metadataId] : null,
    ([url, metadataId]) => paramFetcher(url, metadataId),
  );