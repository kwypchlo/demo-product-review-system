import { AspectRatio, Box, HStack, Link, Skeleton, Stack, Text } from "@chakra-ui/react";
import { Rating } from "@smastrom/react-rating";
import Image from "next/image";
import { type RouterOutputs } from "@/utils/api";

type ProductCardProps = {
  product: RouterOutputs["products"]["getProducts"][number];
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Stack spacing={{ base: "4", md: "5" }}>
      <Box as={Link} href={`/product/${product.id}`} position="relative">
        <AspectRatio ratio={4 / 3} borderRadius={{ base: "md", md: "xl" }} overflow="hidden">
          <>
            <Skeleton width={240} height={180} />
            <Image src={product.image} alt={product.name} width={240} height={180} draggable="false" />
          </>
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
