import { desc } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { reviews } from "@/server/db/schema";

export const productsRouter = createTRPCRouter({
  getProducts: publicProcedure
    .input(
      z.object({
        orderBy: z.object({
          field: z.enum(["name", "rating", "reviewCount"]),
          direction: z.enum(["asc", "desc"]),
        }),
        filterBy: z.enum(["4stars", "3stars"]).optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.products.findMany({
        orderBy: (products, { asc, desc }) => {
          const dir = input.orderBy.direction === "asc" ? asc : desc;

          return [dir(products[input.orderBy.field])];
        },
        where: (products, { gte }) => {
          if (input.filterBy === "4stars") {
            return gte(products.rating, 4);
          }

          if (input.filterBy === "3stars") {
            return gte(products.rating, 3);
          }
        },
      });
    }),

  getProductById: publicProcedure.input(z.object({ id: z.string().uuid() })).query(({ ctx, input: { id } }) => {
    return ctx.db.query.products.findFirst({
      where: (users, { eq }) => eq(users.id, id),
      with: {
        reviews: {
          limit: 3,
          orderBy: [desc(reviews.date)],
          with: {
            author: true,
          },
        },
      },
    });
  }),

  getProductReviews: publicProcedure.input(z.object({ productId: z.string().uuid() })).query(async ({ ctx, input }) => {
    return ctx.db.query.reviews.findMany({
      where: (reviews, { eq }) => eq(reviews.productId, input.productId),
      orderBy: [desc(reviews.date)],
      with: {
        author: true,
      },
    });
  }),
});
