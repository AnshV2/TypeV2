import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
    postTest: privateProcedure
    .input(z.object({user: z.string(), wpm: z.number(), wc: z.number(), cc: z.number()}))
    .mutation(async ({ctx, input}) => {
      const test = await ctx.db.test.create({
        data: {
          user: input.user,
          wpm: input.wpm,
          wc: input.wc,
          cc: input.cc,
        }
      })
      return test;
    }),

    getTest: privateProcedure
    .input(z.object({user: z.string()}))
    .query(async ({ctx, input}) => {
      const tests = (await ctx.db.test.findMany({orderBy: [{
        time: 'asc'
      }], 
      take: 100,
      where: {user: {equals: input.user}}}))
      return tests;
    })
});
