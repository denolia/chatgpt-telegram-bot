import { checkAdmin } from "../checkAdmin";
import {
  addRegisteredUser,
  loadRegisteredUsers,
  removeRegisteredUser,
} from "../users";
import { TextContextType } from "../types";

function getCommandArg(ctx: TextContextType) {
  const [, arg] = ctx.message.text.trim().split(/\s+/, 2);
  return arg;
}

function parseUsernameArg(ctx: TextContextType) {
  const username = getCommandArg(ctx);
  if (!username) {
    return {
      errorReply: ctx.reply(
        "😾 Please provide a username. Example: /adduser @john",
      ),
    };
  }

  return { username };
}

export function addUserCommand() {
  return (ctx: TextContextType) => {
    const { admin, notAdminReply } = checkAdmin(ctx);
    if (!admin && notAdminReply) {
      return notAdminReply;
    }

    const { username, errorReply } = parseUsernameArg(ctx);
    if (!username && errorReply) {
      return errorReply;
    }

    const wasAdded = addRegisteredUser(username!);
    if (!wasAdded) {
      return ctx.reply(`😾 User ${username} is already registered or invalid`);
    }

    loadRegisteredUsers();
    return ctx.reply(`😸 Added ${username} to registered-users.json`);
  };
}

export function removeUserCommand() {
  return (ctx: TextContextType) => {
    const { admin, notAdminReply } = checkAdmin(ctx);
    if (!admin && notAdminReply) {
      return notAdminReply;
    }

    const { username, errorReply } = parseUsernameArg(ctx);
    if (!username && errorReply) {
      return errorReply;
    }

    const wasRemoved = removeRegisteredUser(username!);
    if (!wasRemoved) {
      return ctx.reply(`😾 User ${username} is not registered or invalid`);
    }

    loadRegisteredUsers();
    return ctx.reply(`😸 Removed ${username} from registered-users.json`);
  };
}
