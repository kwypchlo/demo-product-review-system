import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { products, reviews } from "@/server/db/schema";

export const reviewsRouter = createTRPCRouter({
  getMyProductReviews: protectedProcedure
    .input(z.object({ productId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.reviews.findMany({
        where: (reviews, { and, eq }) => {
          return and(eq(reviews.productId, input.productId), eq(reviews.authorId, ctx.session.user.id));
        },
        with: {
          author: true,
        },
      });
    }),

  getProductReviews: publicProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
        orderBy: z.object({
          field: z.enum(["date", "rating"]),
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
      return ctx.db.query.reviews.findMany({
        orderBy: (products, { asc, desc }) => {
          const dir = input.orderBy.direction === "asc" ? asc : desc;
          const order = [dir(products[input.orderBy.field])];

          // when ordering by rating, we also want to order by date on equal ratings
          if (input.orderBy.field === "rating") {
            order.push(desc(products.date));
          }

          return order;
        },
        where: (reviews, { eq, and, gte, lte }) => {
          const where = eq(reviews.productId, input.productId);

          if (input.filterBy) {
            const { field, comparison, value } = input.filterBy;
            const cmp = { ">=": gte, "<=": lte, "==": eq }[comparison];
            return and(where, cmp(reviews[field], value));
          }

          return where;
        },
        with: {
          author: true,
        },
      });
    }),

  createReview: protectedProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
        content: z.string().min(1).max(360),
        rating: z.number().int().min(1).max(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (db) => {
        await db.insert(reviews).values({
          content: input.content,
          rating: input.rating,
          productId: input.productId,
          authorId: ctx.session.user.id,
        });

        await db
          .update(products)
          .set({
            reviewCount: sql`${products.reviewCount} + 1`,
            rating: sql`${db
              .select({ rating: sql`AVG(${reviews.rating})` })
              .from(reviews)
              .where(eq(reviews.productId, input.productId))}`,
          })
          .where(eq(products.id, input.productId));
      });
    }),

  deleteReview: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
    await ctx.db.transaction(async (db) => {
      const deletedReviews = await db
        .delete(reviews)
        .where(and(eq(reviews.id, input.id), eq(reviews.authorId, ctx.session.user.id)))
        .returning();

      if (!deletedReviews.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }

      await db
        .update(products)
        .set({
          reviewCount: sql`${products.reviewCount} - 1`,
          rating: sql`${db
            .select({ rating: sql`AVG(${reviews.rating})` })
            .from(reviews)
            .where(eq(reviews.productId, deletedReviews[0]!.productId))}`,
        })
        .where(eq(products.id, deletedReviews[0]!.productId));
    });
  }),
});
