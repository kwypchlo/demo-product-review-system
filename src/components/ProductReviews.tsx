import { Box, Button, Center, Divider, Flex, Select, Spinner, Text } from "@chakra-ui/react";
import { Fragment, useState } from "react";
import { DividerWithContent } from "./DividerWithContent";
import { Review } from "./Review";
import { type RouterInputs, type RouterOutputs, api } from "@/utils/api";

const orderByOptions = [
  { value: "date:desc", label: "Date Desc" },
  { value: "date:asc", label: "Date Asc" },
  { value: "rating:desc", label: "Rating Desc" },
  { value: "rating:asc", label: "Rating Asc" },
] as const;

const filterByOptions = [
  { value: "rating:>=:4", label: "Rated 4 or more" },
  { value: "rating:>=:3", label: "Rated 3 or more" },
  { value: "rating:<=:3", label: "Rated 3 or less" },
  { value: "rating:<=:2", label: "Rated 2 or less" },
  { value: "rating:==:1", label: "Rated ⭐" },
  { value: "rating:==:2", label: "Rated ⭐⭐" },
  { value: "rating:==:3", label: "Rated ⭐⭐⭐" },
  { value: "rating:==:4", label: "Rated ⭐⭐⭐⭐" },
  { value: "rating:==:5", label: "Rated ⭐⭐⭐⭐⭐" },
] as const;

type ProductReviewsProps = {
  product: NonNullable<RouterOutputs["products"]["getProductById"]>;
};

type FilterByInput = RouterInputs["reviews"]["getProductReviews"]["filterBy"];
type OrderByInput = RouterInputs["reviews"]["getProductReviews"]["orderBy"];

type FilterByOption = (typeof filterByOptions)[number]["value"] | "";
type OrderByOption = (typeof orderByOptions)[number]["value"];

function parseFilterBy(orderBy: FilterByOption): FilterByInput {
  if (!orderBy) return;

  const [field, comparison, value] = orderBy.split(":");

  return { field, comparison, value: parseInt(value!, 10) } as FilterByInput;
}

function parseOrderBy(orderBy: OrderByOption): OrderByInput {
  const [field, direction] = orderBy.split(":");

  return { field, direction } as OrderByInput;
}

export function ProductReviews({ product }: ProductReviewsProps) {
  const [enableFetching, setEnableFetching] = useState(false);
  const [filterBy, setFilterBy] = useState<FilterByOption>("");
  const [orderBy, setOrderBy] = useState<OrderByOption>("date:desc");

  const { data: reviews, isLoading } = api.reviews.getProductReviews.useQuery(
    { productId: product.id, orderBy: parseOrderBy(orderBy), filterBy: parseFilterBy(filterBy) },
    { keepPreviousData: true, enabled: enableFetching, initialData: product.reviews },
  );

  const onChangeOrderBy = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEnableFetching(true);
    setOrderBy(event.target.value as OrderByOption);
  };

  const onChangeFilterBy = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEnableFetching(true);
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

    return (
      <DividerWithContent>
        <Text fontSize="sm" fontWeight="thin">
          no reviews yet
        </Text>
      </DividerWithContent>
    );
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

        {product.reviewCount > reviews.length && (
          <DividerWithContent>
            <Button type="button" variant="outline" onClick={() => setEnableFetching(true)}>
              Load more reviews
            </Button>
          </DividerWithContent>
        )}

        {product.reviewCount === reviews.length && (
          <DividerWithContent>
            <Text fontSize="sm" fontWeight="thin">
              no more reviews
            </Text>
          </DividerWithContent>
        )}
      </Box>
    </Flex>
  );
}
