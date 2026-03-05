import { isAdminUser } from "./adminUsers";
import { ContextType } from "./types";
import { normalizeUsername } from "./users";

export function checkAdmin(ctx: ContextType) {
  const rawUsername = ctx.update.message.from.username;
  const username = rawUsername ? normalizeUsername(rawUsername) : undefined;

  if (!username || !isAdminUser(username)) {
    console.log(`User ${username} is not an admin`);
    return {
      notAdminReply: ctx.reply(
        `👿 ${ctx.update.message.from.first_name}, admin access only`,
      ),
      admin: false,
    };
  }

  return { admin: true, username };
}
