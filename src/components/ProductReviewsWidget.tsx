import { Alert, AlertIcon, Button, Divider, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { Fragment, useState } from "react";
import DividerWithContent from "./DividerWithContent";
import ProductReviews from "./ProductReviews";
import Review from "./Review";
import ReviewForm from "./ReviewForm";
import { type RouterOutputs, api } from "@/utils/api";

const tabIndexes = {
  latestReviews: 0,
  allReviews: 1,
  userReview: 2,
};

type ProductReviewsWidgetProps = {
  product: NonNullable<RouterOutputs["products"]["getProductById"]>;
};

export default function ProductReviewsWidget({ product }: ProductReviewsWidgetProps) {
  const [tabIndex, setTabIndex] = useState(tabIndexes.latestReviews);
  const session = useSession();
  const { data: myReviews } = api.reviews.getMyProductReviews.useQuery(
    { productId: product.id },
    { enabled: session.status === "authenticated" },
  );

  const myReview = myReviews?.[0]; // only one review per product per user

  return (
    <Tabs index={tabIndex} onChange={(index: number) => setTabIndex(index)} isLazy>
      <TabList>
        <Tab>Latest Reviews</Tab>
        <Tab>All Reviews ({product.reviewCount})</Tab>
        <Tab>{!myReview && "Submit"} Your Review</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <h3 className="sr-only">Latest Reviews</h3>
          {product.reviews.map((review, reviewIdx) => (
            <Fragment key={review.id}>
              <Review review={review} />
              {reviewIdx < product.reviews.length - 1 && <Divider />}
            </Fragment>
          ))}

          {product.reviewCount > product.reviews.length && (
            <DividerWithContent>
              <Button type="button" variant="outline" onClick={() => setTabIndex(tabIndexes.allReviews)}>
                See all {product.reviewCount} reviews
              </Button>
            </DividerWithContent>
          )}

          {product.reviewCount === product.reviews.length && (
            <DividerWithContent>
              <Text fontSize="sm">no more reviews</Text>
            </DividerWithContent>
          )}
        </TabPanel>
        <TabPanel>
          <h3 className="sr-only">All Reviews</h3>
          <ProductReviews product={product} />
        </TabPanel>
        <TabPanel>
          <h3 className="sr-only">Submit Your Review</h3>

          {session.status === "unauthenticated" && (
            <Alert status="info">
              <AlertIcon />
              <Text>You have to be signed in to submit a review</Text>
              <Button type="button" onClick={() => signIn()} ml="auto">
                Sign in
              </Button>
            </Alert>
          )}

          {session.status === "authenticated" && myReview && <Review review={myReview} />}

          {session.status === "authenticated" && !myReview && <ReviewForm productId={product.id} />}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
