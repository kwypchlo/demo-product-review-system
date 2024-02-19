import { AspectRatio, Box, HStack, Image, Link, Skeleton, Stack, Text } from "@chakra-ui/react";
import { Rating } from "@smastrom/react-rating";
import { type RouterOutputs } from "@/utils/api";

type ProductCardProps = {
  product: RouterOutputs["products"]["getProducts"][number];
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Stack spacing={{ base: "4", md: "5" }} _hover={{ boxShadow: "inner" }}>
      <Box as={Link} href={`/product/${product.id}`} position="relative">
        <AspectRatio ratio={4 / 3}>
          <Image
            src={product.image}
            alt={product.name}
            draggable="false"
            fallback={<Skeleton />}
            borderRadius={{ base: "md", md: "xl" }}
          />
        </AspectRatio>
      </Box>
      <Stack>
        <Stack spacing="1" as={Link} href={`/product/${product.id}`}>
          <Text fontWeight="bold">{product.name}</Text>
        </Stack>
        <HStack>
          <Rating value={product.rating} readOnly style={{ maxWidth: 100 }} />
          <Text fontSize="sm">{product.reviewCount} Reviews</Text>
        </HStack>
      </Stack>
    </Stack>
  );
}
