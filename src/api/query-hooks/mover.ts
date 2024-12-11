import { useInfiniteQuery } from "@tanstack/react-query";
import { getMoverList } from "../mover";

//내가 찜한 기사님 목록 조회
export const useGetFavoriteMoverList = () => {
  return useInfiniteQuery({
    queryKey: ["favoriteMover"],
    queryFn: () =>
      getMoverList({
        isFavorite: true,
        limit: 10,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursorId,
    initialPageParam: null,
  });
};