import { Markup } from "telegraf";
import { checkUser } from "../checkUser";
import { ContextType } from "../types";
import { availableModels } from "../models";

export function showModelButtons() {
  return (ctx: ContextType) => {
    const { notRegisteredReply, registered } = checkUser(ctx);
    if (!registered && notRegisteredReply) {
      return notRegisteredReply;
    }
    return ctx.reply(
      "Meow! 😸 Select the model",
      Markup.keyboard(
        availableModels.map((model) => Markup.button.text(model.name)),
      )
        .oneTime(true)
        .resize(),
    );
  };
}
