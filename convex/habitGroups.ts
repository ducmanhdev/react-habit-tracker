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
            throw new ConvexError("Unauthorized access: You do not have permission to perform this action");
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
            throw new ConvexError("Unauthorized access: You do not have permission to perform this action");
        }

        const children = await ctx.db.query("habitItems")
            .filter((q) => q.eq(q.field("groupId"), habitGroup._id))
            .collect();
        await Promise.all(children.map(child => ctx.db.delete(child._id)));
        await ctx.db.delete(habitGroup._id);
    },
});