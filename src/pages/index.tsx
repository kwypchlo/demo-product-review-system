import { Box, Center, Flex, IconButton, Select, SimpleGrid, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { type RouterInputs, api } from "@/utils/api";

const orderByOptions = [
  { value: "name:desc", label: "Name Desc" },
  { value: "name:asc", label: "Name Asc" },
  { value: "reviewCount:desc", label: "Reviews Desc" },
  { value: "reviewCount:asc", label: "Reviews Asc" },
  { value: "rating:desc", label: "Rating Desc" },
  { value: "rating:asc", label: "Rating Asc" },
];

const filterByOptions = [
  { value: "4stars", label: "At least 4 stars" },
  { value: "3stars", label: "At least 3 stars" },
];

type FilterByInput = RouterInputs["products"]["getProducts"]["filterBy"];
type OrderByInput = RouterInputs["products"]["getProducts"]["orderBy"];

export default function Index() {
  const [filterBy, setFilterBy] = useState<FilterByInput>();
  const [orderBy, setOrderBy] = useState<OrderByInput>({
    field: "name",
    direction: "asc",
  });

  const onChangeFilterBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterBy((e.target.value || undefined) as FilterByInput);
  };

  const onChangeOrderBy = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, direction] = e.target.value.split(":");

    setOrderBy({ field, direction } as OrderByInput);
  };

  const {
    data: products,
    isLoading,
    isRefetching,
  } = api.products.getProducts.useQuery({ orderBy, filterBy }, { keepPreviousData: true });

  return (
    <Box>
      <Flex flexDirection="row" justifyContent="flex-end" gap={4} alignItems="center">
        {products && isRefetching && <Spinner />}

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

        <Select maxW={250} onChange={onChangeOrderBy} value={`${orderBy.field}:${orderBy.direction}`}>
          {orderByOptions.map((option) => (
            <option key={option.value} value={option.value}>
              Order By {option.label}
            </option>
          ))}
        </Select>
      </Flex>

      {isLoading && !products && (
        <Center>
          <Spinner />
        </Center>
      )}

      {!products && !isLoading && <Center>No products found</Center>}

      {products && (
        <SimpleGrid columns={[1, null, 2, 3, 4]} spacing={4}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
