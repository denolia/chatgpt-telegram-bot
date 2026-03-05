import { isRegisteredUser, normalizeUsername } from "./users";
import { ContextType } from "./types";

export function checkUser(ctx: ContextType) {
  const rawUsername = ctx.update.message.from.username;
  const username = rawUsername ? normalizeUsername(rawUsername) : undefined;

  if (!username || !isRegisteredUser(username)) {
    console.log(`User ${username} is not registered`);
    return {
      notRegisteredReply: ctx.reply(
        `👿 ${ctx.update.message.from.first_name}, you are not registered`,
      ),
      registered: false,
    };
  }
  return { registered: true, username };
}
