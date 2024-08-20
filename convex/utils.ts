import {ConvexError} from "convex/values";
import {auth} from "./auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUserId = async (ctx: any) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
        throw new ConvexError("Unauthenticated");
    }
    return userId;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUserIdentity = async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
        throw new Error("Unauthenticated");
    }
    return identity;
}