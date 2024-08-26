import {defineSchema, defineTable} from "convex/server";
import {authTables} from "@convex-dev/auth/server";
import {v} from "convex/values";
import {HABIT_SCHEDULE_TYPES, HABIT_GOAL_UNITS, HABIT_GOAL_TIME_UNITS} from "../src/constants/habits";

const schema = defineSchema({
    ...authTables,
    habitGroups: defineTable({
        name: v.string(),
        icon: v.optional(v.string()),
        userId: v.id("users"),
    }),
    habitItems: defineTable({
        name: v.string(),
        icon: v.optional(v.string()),
        userId: v.id("users"),
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
        streak: v.number(),
        lastCompleted: v.optional(v.number()),
        startDate: v.number(),
    }),
});

export default schema;