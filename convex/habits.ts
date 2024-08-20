import {mutation, query} from "./_generated/server";
import {filter} from "convex-helpers/server/filter";
import {v} from "convex/values";
import {getUserId} from "./utils";
import dayjs from "dayjs";

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
        const userId = await getUserId(ctx);
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
        await getUserId(ctx);
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
        await getUserId(ctx);
        return await ctx.db.delete(args.id)
    },
});

export const getHabitItems = query({
    args: {
        search: v.optional(v.string()),
        date: v.optional(v.number()),
        order: v.optional(v.string()),
    },
    handler: async (ctx, {search, date, order}) => {
        // TODO fix order and compare time
        return filter(
            ctx.db.query("habitItems"),
            (c) => {
                const matchesSearch = search ? c.name.toLowerCase().includes(search.toLowerCase()) : true;
                const matchesDate = date ? dayjs(c.lastCompleted!).isSame(date, 'date') : true;
                return matchesSearch && matchesDate;
            }
        )
            .order(order === "a-z" ? "desc" : "asc")
            .collect();
    },
});