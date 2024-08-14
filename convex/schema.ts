import {defineSchema, defineTable} from "convex/server";
import {authTables} from "@convex-dev/auth/server";
import {v} from "convex/values";

const schema = defineSchema({
    ...authTables,
    habitGroups: defineTable({
        name: v.string(),
        icon: v.string(),
        description: v.optional(v.string()),
        userId: v.id("users"),
    }),
    habitItems: defineTable({
        name: v.string(),
        icon: v.string(),
        groupId: v.id("habitGroups"),
        frequency: v.string(),
        target: v.optional(v.number()),
        unit: v.optional(v.string()),
        streak: v.number(),
        lastCompleted: v.optional(v.string()),
    }),
});

export default schema;