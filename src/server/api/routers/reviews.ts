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

  getProductReviews: publicProcedure.input(z.object({ productId: z.string().uuid() })).query(async ({ ctx, input }) => {
    return ctx.db.query.reviews.findMany({
      where: (reviews, { eq }) => {
        return eq(reviews.productId, input.productId);
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
        content: z.string().min(1),
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
