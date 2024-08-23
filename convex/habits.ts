import {mutation, query} from "./_generated/server";
import {filter} from "convex-helpers/server/filter";
import {ConvexError, v} from "convex/values";
import {getUserId} from "./utils";
import dayjs from "dayjs";
import {HABIT_GOAL_TIME_UNITS, HABIT_GOAL_UNITS, HABIT_SCHEDULE_TYPES} from "../src/constants/habits";

// TODO Optimize update record;

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
        const id = await ctx.db.insert("habitGroups", {
            userId: userId,
            name: args.name,
            icon: args.icon,
        })
        return {id};
    },
});

export const updateHabitGroup = mutation({
    args: {
        id: v.id("habitGroups"),
        name: v.string(),
        icon: v.string(),
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

export const deleteHabitGroup = mutation({
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

export const getHabitItems = query({
    args: {
        search: v.optional(v.string()),
        date: v.optional(v.number()),
        order: v.optional(v.string()),
        groupId: v.optional(v.id("habitGroups")),
    },
    handler: async (ctx, {search, date, order, groupId}) => {
        // TODO fix order and compare time
        return filter(
            ctx.db.query("habitItems"),
            (c) => {
                const matchesGroup = groupId ? c.groupId === groupId : true;
                const matchesSearch = search ? c.name.toLowerCase().includes(search.toLowerCase()) : true;
                const matchesDate = date ? dayjs(c.lastCompleted!).isSame(date, 'date') : true;
                return matchesGroup && matchesSearch && matchesDate;
            }
        )
            .order(order === "a-z" ? "desc" : "asc")
            .collect();
    },
});

export const addHabitItem = mutation({
    args: {
        name: v.string(),
        icon: v.optional(v.string()),
        groupId: v.optional(v.id("habitGroups")),
        schedule: v.object({
            type: v.union(...HABIT_SCHEDULE_TYPES.map(v.literal)),
            daysOfWeek: v.optional(v.array(v.number())),
            daysOfMonth: v.optional(v.array(v.number())),
            interval: v.optional(v.number()),
        }),
        goal: v.object({
            target: v.number(),
            unit: v.union(...HABIT_GOAL_UNITS.map(v.literal)),
            timeUnit: v.union(...HABIT_GOAL_TIME_UNITS.map(v.literal)),
        }),
        startDate: v.number(),
    },
    handler: async (ctx, args) => {
        const userId = await getUserId(ctx);

        if (args.groupId) {
            const habitGroup = await ctx.db.get(args.groupId);
            if (!habitGroup) {
                throw new ConvexError("Habit group not found");
            }
        }

        const id = await ctx.db.insert("habitItems", {
            name: args.name,
            icon: args.icon,
            userId: userId,
            groupId: args.groupId,
            schedule: args.schedule,
            goal: args.goal,
            startDate: args.startDate,
            streak: 0,
        });

        return {id};
    },
});

export const updateHabitItem = mutation({
    args: {
        id: v.id("habitItems"),
        name: v.optional(v.string()),
        icon: v.optional(v.string()),
        schedule: v.optional(v.object({
            type: v.union(...HABIT_SCHEDULE_TYPES.map(v.literal)),
            daysOfWeek: v.optional(v.array(v.number())),
            daysOfMonth: v.optional(v.array(v.number())),
            interval: v.optional(v.number()),
        })),
        goal: v.optional(v.object({
            target: v.number(),
            unit: v.union(...HABIT_GOAL_UNITS.map(v.literal)),
            timeUnit: v.union(...HABIT_GOAL_TIME_UNITS.map(v.literal)),
        })),
        streak: v.optional(v.number()),
        lastCompleted: v.optional(v.number()),
        startDate: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await getUserId(ctx);

        const habitItem = await ctx.db.get(args.id);
        if (!habitItem) {
            throw new ConvexError("Habit item not found");
        }
        if (habitItem.userId !== userId) {
            throw new ConvexError("Unauthorized to update this habit item");
        }

        const filteredArgs = Object.fromEntries(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Object.entries(args).filter(([_, value]) => value !== undefined)
        );

        const id = await ctx.db.patch(habitItem._id, {
            ...filteredArgs,
        });

        return {id};
    },
});

export const deleteHabitItem = mutation({
    args: {
        id: v.id("habitItems"),
    },
    handler: async (ctx, args) => {
        const userId = await getUserId(ctx);

        const habitItem = await ctx.db.get(args.id);
        if (!habitItem) {
            throw new ConvexError("Habit item not found");
        }

        if (habitItem.userId !== userId) {
            throw new ConvexError("Unauthorized to delete this habit item");
        }

        await ctx.db.delete(args.id)
    },
});