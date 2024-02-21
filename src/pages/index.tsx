import { Button, Center, Flex, Progress, Select, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { DividerWithContent, DividerWithText } from "@/components/Dividers";
import { ProductCard } from "@/components/ProductCard";
import { ProductGrid } from "@/components/ProductGrid";
import { type RouterInputs, api } from "@/utils/api";

const orderByOptions = [
  { value: "name:desc", label: "Name Desc" },
  { value: "name:asc", label: "Name Asc" },
  { value: "reviewCount:desc", label: "Reviews Desc" },
  { value: "reviewCount:asc", label: "Reviews Asc" },
  { value: "rating:desc", label: "Rating Desc" },
  { value: "rating:asc", label: "Rating Asc" },
] as const;

const filterByOptions = [
  { value: "rating:>=:4", label: "Rated 4 or more" },
  { value: "rating:>=:3", label: "Rated 3 or more" },
  { value: "rating:<=:3", label: "Rated 3 or less" },
  { value: "rating:<=:2", label: "Rated 2 or less" },
] as const;

type FilterByInput = RouterInputs["products"]["getProducts"]["filterBy"];
type OrderByInput = RouterInputs["products"]["getProducts"]["orderBy"];

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

export default function Index() {
  const [filterBy, setFilterBy] = useState<FilterByOption>("");
  const [orderBy, setOrderBy] = useState<OrderByOption>("name:asc");

  const { data, error, isLoading, isRefetching, fetchNextPage, hasNextPage } =
    api.products.getProductsInfinite.useInfiniteQuery(
      {
        orderBy: parseOrderBy(orderBy),
        filterBy: parseFilterBy(filterBy),
      },
      {
        getNextPageParam: ({ nextCursor }) => nextCursor,
        // placeholderData: true,
      },
    );

  const products = useMemo(() => {
    return data?.pages.flatMap((page) => page.data);
  }, [data]);

  const [sentryRef] = useInfiniteScroll({
    loading: isLoading || isRefetching,
    hasNextPage: !!hasNextPage,
    onLoadMore: () => void fetchNextPage(),
    disabled: !!error,
    rootMargin: "0px 0px 400px 0px",
  });

  return (
    <Flex flexDirection="column" gap={4}>
      <Flex flexDirection="row" justifyContent="flex-end" gap={4} alignItems="center">
        {products && isRefetching && (
          <Progress size="xs" isIndeterminate position="absolute" left={0} right={0} top={0} />
        )}

        <Select
          placeholder={filterBy ? "Do not filter" : "Filter by"}
          maxW={200}
          onChange={(event) => setFilterBy(event.target.value as FilterByOption)}
          value={filterBy}
        >
          {filterByOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        <Select maxW={250} onChange={(event) => setOrderBy(event.target.value as OrderByOption)} value={orderBy}>
          {orderByOptions.map((option) => (
            <option key={option.value} value={option.value}>
              Order By {option.label}
            </option>
          ))}
        </Select>
      </Flex>

      {isLoading && !products && <Progress size="xs" isIndeterminate position="absolute" left={0} right={0} top={0} />}

      {!products && !isLoading && <Center>No products found</Center>}

      {products && (
        <ProductGrid>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
      )}

      {hasNextPage === true && (
        <DividerWithContent>
          <Button type="button" variant="outline" onClick={() => fetchNextPage()} ref={sentryRef}>
            more products
          </Button>
        </DividerWithContent>
      )}

      {hasNextPage === false && <DividerWithText text="no more products" />}
    </Flex>
  );
}
