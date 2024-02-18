import { StarIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import Link from "next/link";
import { api } from "@/utils/api";

export default function Example() {
  const { data: products, isLoading } = api.products.getProducts.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (!products) return <div>No products found</div>;

  return (
    <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="group relative border-b border-r border-gray-200 p-4 sm:p-6"
        >
          <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="pb-4 pt-10 text-center">
            <h3 className="text-sm font-medium text-gray-900">
              <Link href={`/product/${product.id}`}>
                <span aria-hidden="true" className="absolute inset-0" />
                {product.name}
              </Link>
            </h3>
            <div className="mt-3 flex flex-col items-center">
              <p className="sr-only">{product.rating} out of 5 stars</p>
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={classNames(
                      product.rating > rating
                        ? "text-yellow-400"
                        : "text-gray-200",
                      "h-5 w-5 flex-shrink-0",
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {product.reviewCount} reviews
              </p>
            </div>
            {/* <p className="mt-4 text-base font-medium text-gray-900">
              {product.price}
            </p> */}
          </div>
        </div>
      ))}
    </div>
  );
}
