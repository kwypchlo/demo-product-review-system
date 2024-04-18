import { Box, Button, Center, Divider, Flex, Select, Spinner } from "@chakra-ui/react";
import { Fragment, useMemo } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { DividerWithContent, DividerWithText } from "./Dividers";
import { Review } from "./Review";
import { useRouterState } from "@/hooks/useRouterState";
import { type RouterInputs, type RouterOutputs, api } from "@/utils/api";

const orderByOptions = [
  { value: "date-desc", label: "Date Desc" },
  { value: "date-asc", label: "Date Asc" },
  { value: "rating-desc", label: "Rating Desc" },
  { value: "rating-asc", label: "Rating Asc" },
] as const;

const filterByOptions = [
  { value: "rating-gte-4", label: "Rated 4 or more" },
  { value: "rating-gte-3", label: "Rated 3 or more" },
  { value: "rating-lte-3", label: "Rated 3 or less" },
  { value: "rating-lte-2", label: "Rated 2 or less" },
  { value: "rating-eq-1", label: "Rated ⭐" },
  { value: "rating-eq-2", label: "Rated ⭐⭐" },
  { value: "rating-eq-3", label: "Rated ⭐⭐⭐" },
  { value: "rating-eq-4", label: "Rated ⭐⭐⭐⭐" },
  { value: "rating-eq-5", label: "Rated ⭐⭐⭐⭐⭐" },
] as const;

type ProductReviewsProps = {
  product: NonNullable<RouterOutputs["products"]["getProductById"]>;
};

type FilterByInput = RouterInputs["reviews"]["getProductReviews"]["filterBy"];
type OrderByInput = RouterInputs["reviews"]["getProductReviews"]["orderBy"];

type FilterByOption = (typeof filterByOptions)[number]["value"] | "";
type OrderByOption = (typeof orderByOptions)[number]["value"];

function parseFilterBy(filterBy: FilterByOption): FilterByInput {
  if (!filterBy) return;

  const [field, comparison, value] = filterBy.split("-");

  return { field, comparison, value: parseInt(value!, 10) } as FilterByInput;
}

function parseOrderBy(orderBy: OrderByOption): OrderByInput {
  const [field, direction] = orderBy.split("-");

  return { field, direction } as OrderByInput;
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const [filterBy, setFilterBy] = useRouterState<FilterByOption>("filter", "");
  const [orderBy, setOrderBy] = useRouterState<OrderByOption>("order", "date-desc");

  const { data, error, isLoading, isRefetching, fetchNextPage, hasNextPage } =
    api.reviews.getProductReviewsInfinite.useInfiniteQuery(
      { productId: product.id, orderBy: parseOrderBy(orderBy), filterBy: parseFilterBy(filterBy) },
      {
        getNextPageParam: ({ nextCursor }) => nextCursor,
        keepPreviousData: true,
      },
    );

  const reviews = useMemo(() => {
    return data?.pages.flatMap((page) => page.data);
  }, [data]);

  const [sentryRef] = useInfiniteScroll({
    loading: isLoading || isRefetching,
    hasNextPage: !!hasNextPage,
    onLoadMore: () => void fetchNextPage(),
    disabled: !!error,
    rootMargin: "0px 0px 400px 0px",
  });

  const onChangeOrderBy = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderBy(event.target.value as OrderByOption);
  };

  const onChangeFilterBy = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterBy(event.target.value as FilterByOption);
  };

  if (!reviews) {
    if (isLoading) {
      return (
        <Center>
          <Spinner />
        </Center>
      );
    }

    return <DividerWithText text="no reviews yet" />;
  }

  return (
    <Flex direction="column">
      <Flex flexDirection="row" justifyContent="flex-end" gap={4} alignItems="center">
        <Select
          placeholder={filterBy ? "Do not filter" : "Filter by"}
          maxW={200}
          onChange={onChangeFilterBy}
          value={filterBy}
        >
          {filterByOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select maxW={250} onChange={onChangeOrderBy}>
          {orderByOptions.map((option) => (
            <option key={option.value} value={option.value}>
              Order By {option.label}
            </option>
          ))}
        </Select>
      </Flex>

      <Box>
        {reviews.map((review, reviewIdx) => (
          <Fragment key={review.id}>
            <Review review={review} />
            {reviewIdx < reviews.length - 1 && <Divider />}
          </Fragment>
        ))}

        {hasNextPage === true && (
          <DividerWithContent>
            <Button type="button" variant="outline" onClick={() => fetchNextPage()} ref={sentryRef}>
              more reviews
            </Button>
          </DividerWithContent>
        )}

        {hasNextPage === false && <DividerWithText text="no more reviews" />}
      </Box>
    </Flex>
  );
}
