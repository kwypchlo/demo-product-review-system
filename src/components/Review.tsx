import { Avatar, Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { Rating } from "@smastrom/react-rating";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import { FiTrash } from "react-icons/fi";
import { type RouterOutputs, api } from "@/utils/api";

type ReviewProps = {
  review: RouterOutputs["products"]["getProductReviews"][number];
};

export default function Review({ review }: ReviewProps) {
  const session = useSession();
  const toast = useToast();
  const utils = api.useUtils();
  const { mutate: deleteReview } = api.products.deleteReview.useMutation({
    onSuccess: () => {
      void utils.products.getProductById.invalidate({ id: review.productId });
      void utils.products.getProductReviews.invalidate({
        productId: review.productId,
      });

      toast({ title: "Your review has been deleted.", status: "success" });
    },
  });

  const handleDelete = () => {
    deleteReview({ id: review.id });
  };

  const isAuthor = session.data?.user.id === review.author.id;

  return (
    <Flex gap={4} py={4}>
      <Avatar src={review.author.image!} name={review.author.name!} />

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
        <p className="sr-only">{Math.round(review.rating)} out of 5 stars</p>

        <Text>{review.content}</Text>
      </Flex>
    </Flex>
  );

  return (
    <div
      className={classNames("flex space-x-4 text-sm text-gray-500", {
        "bg-yellow-50": isAuthor,
      })}
    >
      <div className="flex-none px-2 py-10">
        <Avatar src={review.author.image!} name={review.author.name!} />
      </div>
      <div className={classNames("border-t border-gray-200", "space-y-1 px-2 py-10")}>
        <div className="flex items-center gap-4">
          <h3 className="font-medium text-gray-900">{review.author.name}</h3>
          {isAuthor && (
            <Button onClick={handleDelete} size="xs">
              delete my review
            </Button>
          )}
        </div>
        <p>
          <time dateTime={review.date.toUTCString()}>{review.date.toLocaleString()}</time>
        </p>

        <Rating value={Math.round(review.rating)} style={{ maxWidth: 100 }} readOnly />
        <p className="sr-only">{Math.round(review.rating)} out of 5 stars</p>

        <div className="prose prose-sm mt-4 max-w-none text-gray-500">{review.content}</div>
      </div>
    </div>
  );
}
