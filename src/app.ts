import "dotenv/config";
import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { checkUser } from "./checkUser";
import { createNewChat } from "./commands/createNewChat";
import { handlePhotoMessage } from "./commands/handlePhotoMessage";
import { handleTextMessage } from "./commands/handleTextMessage";
import { commandSetModel } from "./commands/setModel";
import { showModelButtons } from "./commands/showModelButtons";

import { loadRegisteredUsers } from "./registeredUsers";
import { ContextType, ModelIds, ModelName, Username } from "./types";

loadRegisteredUsers();

const bot_token = process.env.BOT_TOKEN;
if (!bot_token) {
  throw new Error("BOT_TOKEN must be provided!");
}

const openAiApiKey = process.env.OPENAI_API_KEY;
if (!openAiApiKey) {
  throw new Error("OPENAI_API_KEY must be provided!");
}

const openai = new OpenAI({
  apiKey: openAiApiKey,
});

// chat history for users, cleared with /newchat command
const userContext: Record<Username, ChatCompletionMessageParam[]> = {};

const bot = new Telegraf(bot_token);
console.log("Starting the bot...", Boolean(bot));

// map username -> selected model
const currentModels: Record<Username, ModelName | undefined> = {};

// bot commands
bot.start((ctx: ContextType) => {
  const { notRegisteredReply, registered } = checkUser(ctx);
  if (!registered && notRegisteredReply) {
    return notRegisteredReply;
  }
  return ctx.reply(`Meowello 😺 ${ctx.update.message.from.first_name}!`);
});

bot.command("newchat", createNewChat(userContext));

bot.command("setmodel", showModelButtons());

bot.hears(Object.keys(ModelIds), commandSetModel(userContext, currentModels));

bot.on(message("text"), handleTextMessage(openai, userContext, currentModels));

bot.on(message("photo"), handlePhotoMessage(openai));

bot.launch().then();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
