import {ConvexError} from "convex/values";
import { QueryCtx } from "./_generated/server";
import {auth} from "./auth";

export const getUserId = async (ctx: QueryCtx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
        throw new ConvexError("Unauthenticated");
    }
    return userId;
};

export const getUserIdentity = async (ctx: QueryCtx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
        throw new Error("Unauthenticated");
    }
    return identity;
}