import { faker } from "@faker-js/faker";

export const generateProduct = (overrides = {}) => {
  const productName = faker.commerce.productName();

  return {
    name: productName,
    description: faker.commerce.productDescription(),
    slug: faker.helpers.slugify(productName),
    material: faker.commerce.productMaterial(),
    color: faker.color.human(),
    tags: [faker.commerce.productAdjective()],
    image: faker.image.urlPicsumPhotos({ width: 480, height: 360 }),
    ...overrides,
  };
};

export const generateReview = (productId: number, authorId: string, overrides = {}) => {
  return {
    productId,
    authorId,
    rating: faker.number.int({ min: 1, max: 5 }),
    content: faker.lorem.paragraph({ min: 1, max: 10 }),
    date: faker.date.recent({ days: 365, refDate: new Date() }),
    ...overrides,
  };
};

export const generateProductReviews = (productId: number, authorIds: string[]) => {
  authorIds = authorIds.slice(); // copy the array
  return new Array(faker.number.int({ min: 1, max: Math.min(50, authorIds.length) })).fill(null).map(() => {
    faker.helpers.shuffle(authorIds, { inplace: true }); // shuffle the array in place

    return generateReview(productId, authorIds.pop()!);
  });
};

export const generateUser = (overrides = {}) => {
  return {
    id: faker.string.nanoid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    image: faker.image.avatarGitHub(),
    ...overrides,
  };
};
