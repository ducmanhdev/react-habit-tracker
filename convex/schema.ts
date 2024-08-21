import {defineSchema, defineTable} from "convex/server";
import {authTables} from "@convex-dev/auth/server";
import {v} from "convex/values";

const schema = defineSchema({
    ...authTables,
    habitGroups: defineTable({
        name: v.string(),
        icon: v.string(),
        userId: v.id("users"),
    }),
    habitItems: defineTable({
        name: v.string(),
        icon: v.optional(v.string()),
        userId: v.id("users"),
        groupId: v.optional(v.id("habitGroups")),
        schedule: v.optional(v.object({
            type: v.union(
                v.literal("daily"),
                v.literal("weekly"),
                v.literal("monthly"),
                v.literal("custom"),
            ),
            daysOfWeek: v.optional(v.array(v.number())),
            daysOfMonth: v.optional(v.array(v.number())),
            interval: v.optional(v.number()),
        })),
        goal: v.object({
            target: v.number(),
            unit: v.union(
                v.literal("times"),
                v.literal("minutes"),
                v.literal("glasses"),
            ),
            timeUnit: v.union(
                v.literal("day"),
                v.literal("week"),
                v.literal("month"),
            ),
        }),
        streak: v.number(),
        lastCompleted: v.optional(v.number()),
        startDate: v.number(),
    }),
});

export default schema;