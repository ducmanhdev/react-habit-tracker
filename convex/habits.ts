import {mutation, query} from "./_generated/server";
import {ConvexError, v} from "convex/values";
import {auth} from "./auth";

export const getHabitGroups = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("habitGroups").collect()
    },
});
export const addHabitGroup = mutation({
    args: {
        name: v.string(),
        icon: v.string(),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (userId === null) {
            throw new ConvexError("You must be logged in to perform this action.");
        }
        return await ctx.db.insert("habitGroups", {
            userId: userId,
            name: args.name,
            icon: args.icon,
            description: args.description,
        })
    },
});