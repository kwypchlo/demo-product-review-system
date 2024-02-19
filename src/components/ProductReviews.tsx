import { Box, Button, Center, Divider, Spinner, Text } from "@chakra-ui/react";
import { Fragment } from "react";
import DividerWithContent from "./DividerWithContent";
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
        <DividerWithContent>
          <Button type="button" variant="outline">
            Load more reviews
          </Button>
        </DividerWithContent>
      )}

      {product.reviewCount === product.reviews.length && (
        <DividerWithContent>
          <Text fontSize="sm" fontWeight="thin">
            no more reviews
          </Text>
        </DividerWithContent>
      )}
    </Box>
  );
}
