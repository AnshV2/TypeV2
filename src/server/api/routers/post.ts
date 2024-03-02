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
    postTest: publicProcedure
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
    .query(async ({ctx}) => {
      const tests = (await ctx.db.test.findMany({orderBy: [{
        time: 'desc'
      }], 
      take: 100,
      where: {user: {equals: ctx.session}}}))
      return tests;
    })
});
