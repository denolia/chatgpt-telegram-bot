import { registeredUsers } from "./registeredUsers";
import { ContextType } from "./types";

export function checkUser(ctx: ContextType) {
  const username = ctx.update.message.from.username;

  if (!username || !registeredUsers.includes(username)) {
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
