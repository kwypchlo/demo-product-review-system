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
        filterBy: z
          .object({
            field: z.enum(["rating"]),
            comparison: z.enum([">=", "<=", "=="]),
            value: z.number().int().min(1).max(5),
          })
          .optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.query.products.findMany({
        orderBy: (products, { asc, desc }) => {
          const dir = input.orderBy.direction === "asc" ? asc : desc;

          return [dir(products[input.orderBy.field])];
        },
        where: (products, { gte, lte, eq }) => {
          if (input.filterBy) {
            const { field, comparison, value } = input.filterBy;
            const cmp = { ">=": gte, "<=": lte, "==": eq }[comparison];

            return cmp(products[field], value);
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
