import {
  Alert,
  AlertIcon,
  Button,
  Hide,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VisuallyHidden,
} from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { SiGithub } from "react-icons/si";
import { ProductReviews } from "./ProductReviews";
import { Review } from "./Review";
import { ReviewForm } from "./ReviewForm";
import { type RouterOutputs, api } from "@/utils/api";

const tabIndexes = {
  latestReviews: 0,
  allReviews: 1,
  userReview: 2,
};

type ProductReviewsWidgetProps = {
  product: NonNullable<RouterOutputs["products"]["getProductById"]>;
};

export function ProductReviewsWidget({ product }: ProductReviewsWidgetProps) {
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
        <Tab>Product Reviews ({product.reviewCount})</Tab>
        <Tab>{!myReview && "Submit"} Your Review</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <VisuallyHidden>
            <h3>Product Reviews</h3>
          </VisuallyHidden>
          <ProductReviews product={product} />
        </TabPanel>
        <TabPanel>
          <VisuallyHidden>
            <h3>Submit Your Review</h3>
          </VisuallyHidden>

          {session.status === "unauthenticated" && (
            <Alert status="info">
              <AlertIcon />
              <Text mr={3} fontSize={[14, 16]}>
                You have to be signed in to submit a review
              </Text>
              <Button
                type="button"
                onClick={() => signIn("github")}
                ml="auto"
                size="sm"
                leftIcon={<SiGithub />}
                flexShrink={0}
              >
                Sign in <Hide below="md">with GitHub</Hide>
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
