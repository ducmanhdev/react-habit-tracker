import {query} from "./_generated/server";
import {auth} from "./auth";

export const currentUser = query({
    args: {},
    handler: async (ctx) => {
        console.log("Server identity:", await ctx.auth.getUserIdentity());
        const userId = await auth.getUserId(ctx);
        if (userId === null) {
            return null;
        }
        return await ctx.db.get(userId);
    },
});