import {mutation, query} from "./_generated/server";
import {ConvexError, v} from "convex/values";
import {getUserId} from "./utils";

export const getGroups = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getUserId(ctx);
        return await ctx.db.query("habitGroups")
            .filter((q) => q.eq(q.field("userId"), userId))
            .collect()
    },
});

export const addGroup = mutation({
    args: {
        name: v.string(),
        icon: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getUserId(ctx);
        const id = await ctx.db.insert("habitGroups", {
            userId: userId,
            name: args.name,
            icon: args.icon,
        })
        return {id};
    },
});

export const updateGroup = mutation({
    args: {
        id: v.id("habitGroups"),
        name: v.string(),
        icon: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getUserId(ctx);

        const habitGroup = await ctx.db.get(args.id);
        if (!habitGroup) {
            throw new ConvexError("Habit group not found");
        }

        if (habitGroup.userId !== userId) {
            throw new ConvexError("Unauthorized to update this habit group");
        }

        await ctx.db.patch(args.id, {
            ...habitGroup,
            ...args
        })
    },
});

export const deleteGroup = mutation({
    args: {
        id: v.id("habitGroups"),
    },
    handler: async (ctx, args) => {
        const userId = await getUserId(ctx);

        const habitGroup = await ctx.db.get(args.id);
        if (!habitGroup) {
            throw new ConvexError("Habit group not found");
        }

        if (habitGroup.userId !== userId) {
            throw new ConvexError("Unauthorized to delete this habit group");
        }

        await ctx.db.delete(args.id)
    },
});