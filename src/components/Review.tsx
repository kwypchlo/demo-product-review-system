import { Avatar, Button, Flex, Heading, Text, VisuallyHidden, useColorModeValue, useToast } from "@chakra-ui/react";
import { Rating } from "@smastrom/react-rating";
import { useSession } from "next-auth/react";
import { FiTrash } from "react-icons/fi";
import { type RouterOutputs, api } from "@/utils/api";

type ReviewProps = {
  review: RouterOutputs["reviews"]["getProductReviews"][number];
};

export function Review({ review }: ReviewProps) {
  const session = useSession();
  const toast = useToast();
  const utils = api.useUtils();
  const { mutate: deleteReview } = api.reviews.deleteReview.useMutation({
    onSuccess: () => {
      void utils.products.getProductById.invalidate({ id: review.productId });
      void utils.reviews.getProductReviews.invalidate({ productId: review.productId });
      void utils.reviews.getProductReviewsInfinite.invalidate({ productId: review.productId });
      void utils.reviews.getMyProductReviews.invalidate({ productId: review.productId });

      toast({ title: "Your review has been deleted.", status: "success" });
    },
  });

  const handleDelete = () => {
    deleteReview({ id: review.id });
  };

  const isAuthor = session.data?.user.id === review.author.id;

  return (
    <Flex gap={4} py={4} data-testid="review">
      <Avatar src={review.author.image!} name={review.author.name!} bg={useColorModeValue("gray.100", "gray.900")} />

      <Flex direction="column" gap={2} flex={1}>
        <Flex justifyContent="space-between" alignItems="top" gap={4}>
          <Heading as="h3" size="md">
            {review.author.name}
          </Heading>

          {isAuthor && (
            <Button onClick={handleDelete} size="xs" leftIcon={<FiTrash />} flexShrink={0}>
              Delete My Review
            </Button>
          )}
        </Flex>

        <Text fontSize="sm" as="time" dateTime={review.date.toLocaleDateString()}>
          {review.date.toLocaleDateString()}
        </Text>

        <Rating value={Math.round(review.rating)} style={{ maxWidth: 100 }} readOnly />

        <VisuallyHidden>
          <p>{Math.round(review.rating)} out of 5 stars</p>
        </VisuallyHidden>

        <Text>{review.content}</Text>
      </Flex>
    </Flex>
  );
}
