import { desc, eq, gte, lte } from "drizzle-orm";
import { withCursorPagination } from "drizzle-pagination";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { products, reviews } from "@/server/db/schema";

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

  getProductsInfinite: publicProcedure
    .input(
      z.object({
        cursor: z
          .object({
            orderBy: z.any(),
            id: z.number().int().nonnegative(),
          })
          .optional(),
        limit: z.number().int().nonnegative().default(50),
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
      const data = await ctx.db.query.products.findMany(
        withCursorPagination({
          limit: input.limit,
          where: input.filterBy
            ? { ">=": gte, "<=": lte, "==": eq }[input.filterBy.comparison](
                products[input.filterBy.field],
                input.filterBy.value,
              )
            : undefined,
          cursors: [
            [products[input.orderBy.field], input.orderBy.direction, input.cursor?.orderBy],
            [products.id, "desc", input.cursor?.id],
          ],
        }),
      );

      const next = data[input.limit - 1];

      if (next) {
        return { data, nextCursor: { orderBy: next[input.orderBy.field], id: next.id } };
      }

      return { data, nextCursor: null };
    }),

  getProductById: publicProcedure
    .input(z.object({ id: z.number().int().nonnegative() }))
    .query(({ ctx, input: { id } }) => {
      return ctx.db.query.products.findFirst({
        where: (users, { eq }) => eq(users.id, id),
      });
    }),
});
