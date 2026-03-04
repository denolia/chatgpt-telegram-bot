import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { checkUser } from "../checkUser";
import { ModelName, Username } from "../types";
import { availableModels } from "../models";

export function handleTextMessage(
  openai: OpenAI,
  userContext: Record<Username, ChatCompletionMessageParam[]>,
  currentModels: Record<Username, ModelName | undefined>,
) {
  return async (ctx: any) => {
    const { notRegisteredReply, registered, username } = checkUser(ctx);
    if (!registered && notRegisteredReply) {
      return notRegisteredReply;
    }

    if (!username) {
      console.error("Cannot find username", ctx.message.from);
      return ctx.reply("😾 Who are you?!");
    }

    const selectedUserModelName =
      currentModels[username] ?? availableModels[0]?.name;
    const selectedModel =
      availableModels.find((m) => m.name === selectedUserModelName) ??
      availableModels[0];

    console.log("Got a message from:", username, "model:", selectedModel.name);

    const requestMessage: ChatCompletionMessageParam = {
      role: "user",
      content: ctx.message.text,
    };

    if (!userContext[username]) {
      userContext[username] = [];
    }

    userContext[username].push(requestMessage);

    const tgMessage = await ctx.reply("🐈🤔‍Mrrrrrrr...", {
      reply_to_message_id: ctx.message.message_id,
    });
    const tgMessageId = tgMessage.message_id;

    if (selectedModel.returnType === "image") {
      try {
        // Generate image from prompt
        const response = await openai.images.generate({
          model: selectedModel.id,
          prompt: ctx.message.text,
          n: 1, // number of images, it supports rn only 1 anyway
          size: "1024x1024",
        });
        // no usage info in dalle-3 response

        const image_url = response?.data?.[0]?.url;
        const b64_json = response?.data?.[0]?.b64_json;

        if (image_url || b64_json) {
          const photo = image_url ?? {
            source: Buffer.from(b64_json!, "base64"),
          };
          await ctx.replyWithPhoto(photo, {
            reply_to_message_id: ctx.message.message_id,
          });
          await ctx.telegram.deleteMessage(ctx.chat.id, tgMessageId);
          console.log("Responded with an image to", username);
        } else {
          await ctx.telegram.editMessageText(
            ctx.chat.id,
            tgMessageId,
            undefined,
            "Meow! 😿 I cannot generate an image",
          );
          console.log("Could not generate an image response to", username);
        }
      } catch (e: any) {
        console.error("Error generating image:", e);
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          tgMessageId,
          undefined,
          "Meow! 😿 An error happened:\n" + e.message,
        );
      }
    } else {
      // text reply
      try {
        const completion = await openai.chat.completions.create({
          model: selectedModel.id,
          messages: userContext[username],
        });
        console.log("Usage:", completion.usage);

        const responseMessage = completion.choices[0].message;
        if (responseMessage) {
          if (!userContext[username]) {
            userContext[username] = [];
          }

          userContext[username].push({
            role: responseMessage.role,
            content: responseMessage.content,
          });
          await ctx.telegram.editMessageText(
            ctx.chat.id,
            tgMessageId,
            undefined,
            responseMessage.content ?? "-",
          );
          console.log("Responded to", username);
        } else {
          await ctx.telegram.editMessageText(
            ctx.chat.id,
            tgMessageId,
            undefined,
            "Meow! 😿 I cannot generate a response",
          );
          console.log("Could not generate a response to", username);
        }
      } catch (e: any) {
        console.error("Error generating response:", e);
        await ctx.telegram.editMessageText(
          ctx.chat.id,
          tgMessageId,
          undefined,
          "Meow! 😿 An error happened:\n" + e.message,
        );
      }
    }
  };
}
