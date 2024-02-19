import { AspectRatio, Divider, Grid, GridItem, HStack, Heading, Image, Skeleton, Text, VStack } from "@chakra-ui/react";
import { Rating } from "@smastrom/react-rating";
import { useRouter } from "next/router";
import ProductReviewsWidget from "@/components/ProductReviewsWidget";
import { api } from "@/utils/api";

export default function Product() {
  const router = useRouter();
  const { data: product, isLoading } = api.products.getProductById.useQuery(
    { id: router.query.id as string },
    { enabled: router.isReady },
  );

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>No product found</div>;

  return (
    <Grid templateColumns="repeat(5, 1fr)" gap={8}>
      <GridItem rowSpan={2} colSpan={2}>
        <AspectRatio ratio={4 / 3}>
          <Image
            src={product.image}
            alt={product.name}
            draggable="false"
            fallback={<Skeleton />}
            borderRadius={{ base: "md", md: "xl" }}
          />
        </AspectRatio>

        <Divider my={8} />

        <Heading mt={4} as="h3" size="sm">
          License
        </Heading>

        <Text mt={4}>
          For personal and professional use. You cannot resell or redistribute these images in their original or
          modified state.
        </Text>
      </GridItem>

      <GridItem colSpan={3}>
        <VStack spacing={6} mb={10} alignItems="flex-start">
          <Heading>{product.name}</Heading>

          <HStack spacing={4}>
            <Rating value={product.rating} readOnly style={{ maxWidth: 100 }} />
            <Text>
              {Math.round(product.rating * 100) / 100} out of {product.reviewCount} reviews
            </Text>
          </HStack>

          <Text fontWeight="semibold">{product.description}</Text>
        </VStack>

        <ProductReviewsWidget product={product} />
      </GridItem>
    </Grid>
  );
}
