import { protectedProcedure, publicProcedure, router } from "../lib/trpc";

console.log('trpc router');

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
    console.log('health check');
		return "OK";
	}),
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: "This is private",
			user: ctx.session.user,
		};
	}),
});
export type AppRouter = typeof appRouter;
