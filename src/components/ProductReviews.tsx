import { Box, Button, Center, Divider, Spinner, Text } from "@chakra-ui/react";
import { Fragment } from "react";
import Review from "./Review";
import { type RouterOutputs, api } from "@/utils/api";

type ProductReviewsProps = {
  product: NonNullable<RouterOutputs["products"]["getProductById"]>;
};

export default function ProductReviews({ product }: ProductReviewsProps) {
  const { data: reviews, isLoading } = api.reviews.getProductReviews.useQuery({ productId: product.id });

  if (isLoading && !reviews) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (!reviews) return null;

  return (
    <Box>
      {reviews.map((review, reviewIdx) => (
        <Fragment key={review.id}>
          <Review review={review} />
          {reviewIdx < reviews.length - 1 && <Divider />}
        </Fragment>
      ))}

      {product.reviewCount > product.reviews.length && (
        <Center gap={2}>
          <Divider />
          <Button type="button" flexShrink={0}>
            Load more reviews
          </Button>
          <Divider />
        </Center>
      )}

      {product.reviewCount === product.reviews.length && (
        <Center gap={2}>
          <Divider />
          <Text flexShrink={0} fontSize="sm">
            no more reviews
          </Text>
          <Divider />
        </Center>
      )}
    </Box>
  );
}
