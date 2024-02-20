import { Center, Flex, Progress, Select } from "@chakra-ui/react";
import { useState } from "react";
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

  const {
    data: products,
    isLoading,
    isRefetching,
  } = api.products.getProducts.useQuery(
    { orderBy: parseOrderBy(orderBy), filterBy: parseFilterBy(filterBy) },
    { keepPreviousData: true },
  );

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
    </Flex>
  );
}
