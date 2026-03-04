import { ChatCompletionMessageParam } from "openai/resources";
import { checkUser } from "../checkUser";
import { ModelName, TextContextType, Username } from "../types";
import { availableModels } from "../models";

export function commandSetModel(
  userContext: Record<Username, ChatCompletionMessageParam[]>,
  currentModels: Record<Username, ModelName | undefined>,
) {
  return (ctx: TextContextType) => {
    const { notRegisteredReply, registered, username } = checkUser(ctx);
    if (!registered && notRegisteredReply) {
      return notRegisteredReply;
    }

    if (!username) {
      return ctx.reply("😾 Who are you?!");
    }

    const selectedModelName = ctx.message.text;
    const modelExists = availableModels.some((m) => m.name === selectedModelName);

    if (!modelExists) {
      return ctx.reply("😾 Invalid model selected!");
    }

    if (username && userContext[username]) {
      userContext[username].length = 0;
    }

    currentModels[username] = selectedModelName;
    return ctx.reply(`Meow! 😸 Selected model: ${currentModels[username]}`);
  };
}
