"use client";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useSuspenseQuery,
} from "@connectrpc/connect-query";

export const useMtmQuery = useQuery;
export const useMtmSuspenseQuery = useSuspenseQuery;
export const useMtmMutation = useMutation;
export const useMtmInfiniteQuery = useInfiniteQuery;
// export const useMtmQueryClient = useQueryClient;
