import { Divider, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Fragment } from "react";
import Review from "@/components/Review";
import ReviewForm from "@/components/ReviewForm";
import { api } from "@/utils/api";

const license = {
  href: "#",
  summary:
    "For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.",
  content: `
    <h4>Overview</h4>
    
    <p>For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.</p>
    
    <ul role="list">
    <li>You\'re allowed to use the icons in unlimited projects.</li>
    <li>Attribution is not required to use the icons.</li>
    </ul>
    
    <h4>What you can do with it</h4>
    
    <ul role="list">
    <li>Use them freely in your personal and professional work.</li>
    <li>Make them your own. Change the colors to suit your project or brand.</li>
    </ul>
    
    <h4>What you can\'t do with it</h4>
    
    <ul role="list">
    <li>Don\'t be greedy. Selling or distributing these icons in their original or modified state is prohibited.</li>
    <li>Don\'t be evil. These icons cannot be used on websites or applications that promote illegal or immoral beliefs or activities.</li>
    </ul>
  `,
};

export default function Example() {
  const router = useRouter();
  const session = useSession();
  const { data: product, isLoading } = api.products.getProductById.useQuery(
    { id: router.query.id as string },
    { enabled: router.isReady },
  );
  const { data: myReviews } = api.reviews.getMyProductReviews.useQuery(
    { productId: router.query.id as string },
    { enabled: router.isReady && session.status === "authenticated" },
  );

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>No product found</div>;

  return (
    <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
      {/* Product image */}
      <div className="lg:col-span-4 lg:row-end-1">
        <div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-lg bg-gray-100">
          <img src={product.image} alt={product.name} className="object-cover object-center" />
        </div>
      </div>

      {/* Product details */}
      <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none">
        <div className="flex flex-col-reverse">
          <div className="mt-4">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>

            <h2 id="information-heading" className="sr-only">
              Product information
            </h2>
            <p className="mt-2 text-sm text-gray-500">Version</p>
          </div>

          <div>
            <h3 className="sr-only">Reviews</h3>
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((rating) => (
                <StarIcon
                  key={rating}
                  className={classNames(
                    product.rating > rating ? "text-yellow-400" : "text-gray-300",
                    "h-5 w-5 flex-shrink-0",
                  )}
                  aria-hidden="true"
                />
              ))}
              <span>
                {Math.round(product.rating * 100) / 100} out of {product.reviewCount} reviews
              </span>
            </div>
            <p className="sr-only">{product.rating} out of 5 stars</p>
          </div>
        </div>

        <p className="mt-6 text-gray-500">{product.description}</p>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
          >
            Pay {product.reviewCount}
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-50 px-8 py-3 text-base font-medium text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
          >
            Preview
          </button>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-10">
          <h3 className="text-sm font-medium text-gray-900">License</h3>
          <p className="mt-4 text-sm text-gray-500">
            {license.summary}{" "}
            <a href={license.href} className="font-medium text-indigo-600 hover:text-indigo-500">
              Read full license
            </a>
          </p>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-10">
          <h3 className="text-sm font-medium text-gray-900">Share</h3>
          <ul role="list" className="mt-4 flex items-center space-x-6">
            <li>
              <a href="#" className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500">
                <span className="sr-only">Share on Facebook</span>
                <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a href="#" className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500">
                <span className="sr-only">Share on Instagram</span>
                <svg className="h-6 w-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </li>
            <li>
              <a href="#" className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500">
                <span className="sr-only">Share on X</span>
                <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11.4678 8.77491L17.2961 2H15.915L10.8543 7.88256L6.81232 2H2.15039L8.26263 10.8955L2.15039 18H3.53159L8.87581 11.7878L13.1444 18H17.8063L11.4675 8.77491H11.4678ZM9.57608 10.9738L8.95678 10.0881L4.02925 3.03974H6.15068L10.1273 8.72795L10.7466 9.61374L15.9156 17.0075H13.7942L9.57608 10.9742V10.9738Z" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-16 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
        <Tabs>
          <TabList>
            <Tab>Latest Reviews</Tab>
            <Tab>{!myReviews?.length && "Submit"} Your Review</Tab>
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
            </TabPanel>
            <TabPanel>
              <h3 className="sr-only">Submit Your Review</h3>

              {myReviews && myReviews.length > 0 ? (
                <Review review={myReviews[0]!} />
              ) : (
                <ReviewForm productId={product.id} />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  );
}
