import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";


import useIsClient from "@lib/hooks/useIsClient";
import { http } from "@lib/services/http";
import { ItemSimple } from "@types";

import { Filter } from "../states/filter";

export const useProductQuery = (filter: Filter) => {
  const queryClient = useQueryClient();
  const isClient = useIsClient();
  const query = useInfiniteQuery<{
    content: ItemSimple[];
    last: boolean;
    pageable: {
      pageNumber: number;
    };
  }>({
    queryKey: ["market", filter],
    queryFn: async ({ pageParam = 0 }) => {
      return (
        await http.post.default("/products", { ...filter, page: pageParam })
      ).data;
    },
    enabled: isClient,
    keepPreviousData: true,
    getNextPageParam: (data) =>
      data.last ? undefined : data.pageable.pageNumber + 1,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/users/history"],
      });
    },
  });

  return query;
};

export type ProductQueryResult = ReturnType<typeof useProductQuery>;
