import { faker } from "@faker-js/faker";

export const generateProduct = () => {
  const productName = faker.commerce.productName();

  return {
    name: productName,
    description: faker.commerce.productDescription(),
    slug: faker.helpers.slugify(productName),
    material: faker.commerce.productMaterial(),
    color: faker.color.human(),
    tags: [faker.commerce.productAdjective()],
    rating: faker.number.float({ min: 1, max: 5, fractionDigits: 2 }),
    reviewCount: faker.number.int({ min: 0, max: 100 }),
    image: faker.image.urlPicsumPhotos({ width: 480, height: 360 }),
  };
};

export const generateReview = (productId: string, authorId: string) => {
  return {
    productId,
    authorId,
    rating: faker.number.float({ min: 1, max: 5, fractionDigits: 2 }),
    content: faker.lorem.paragraph({ min: 1, max: 10 }),
  };
};

export const generateProductReviews = (productId: string, authorIds: string[]) => {
  authorIds = authorIds.slice(); // copy the array
  return new Array(faker.number.int({ min: 0, max: 50 })).fill(null).map(() => {
    faker.helpers.shuffle(authorIds, { inplace: true }); // shuffle the array in place

    return generateReview(productId, authorIds.pop()!);
  });
};

export const generateUser = () => {
  return {
    id: faker.string.nanoid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    image: faker.image.avatarGitHub(),
  };
};
