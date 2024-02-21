import { AspectRatio, Box, HStack, Skeleton, Stack, Text } from "@chakra-ui/react";
import { Rating } from "@smastrom/react-rating";
import Image from "next/image";
import Link from "next/link";
import type { RouterOutputs } from "@/utils/api";

type ProductCardProps = {
  product: RouterOutputs["products"]["getProducts"][number];
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Stack spacing={{ base: "4", md: "5" }} data-testid="product-card">
      <Box as={Link} href={`/product/${product.id}`}>
        <AspectRatio ratio={4 / 3} borderRadius={{ base: "md", md: "xl" }} overflow="hidden">
          <>
            <Skeleton width={240} height={180} />
            <Image src={product.image} alt={product.name} width={240} height={180} draggable="false" />
          </>
        </AspectRatio>
      </Box>
      <Stack>
        <Stack spacing="1" as={Link} href={`/product/${product.id}`}>
          <Text fontWeight="bold" data-testid="product-card-name">
            {product.name}
          </Text>
        </Stack>
        <Stack direction={["column", "row"]}>
          <Box data-testid="product-card-rating" flexShrink={0}>
            <Rating value={product.rating} readOnly style={{ maxWidth: 100, marginTop: -1 }} />
          </Box>
          <Text fontSize="sm" data-testid="product-card-review-count">
            {product.reviewCount} Reviews
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
}
