import { SimpleGrid } from "@chakra-ui/react";
import ProductCard from "@/components/ProductCard";
import { api } from "@/utils/api";

export default function Example() {
  const { data: products, isLoading } = api.products.getProducts.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (!products) return <div>No products found</div>;

  return (
    <SimpleGrid columns={[1, null, 2, 3, 4]} spacing={4}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </SimpleGrid>
  );
}
