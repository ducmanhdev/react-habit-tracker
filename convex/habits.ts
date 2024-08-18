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
        })
    },
});

export const updateHabitGroup = mutation({
    args: {
        id: v.id("habitGroups"),
        name: v.string(),
        icon: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (userId === null) {
            throw new ConvexError("You must be logged in to perform this action.");
        }
        return await ctx.db.patch(args.id, {
            name: args.name,
            icon: args.icon,
        })
    },
});

export const deleteHabitGroup = mutation({
    args: {
        id: v.id("habitGroups"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (userId === null) {
            throw new ConvexError("You must be logged in to perform this action.");
        }
        return await ctx.db.delete(args.id)
    },
});