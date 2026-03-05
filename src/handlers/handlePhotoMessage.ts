import { OpenAI } from "openai";
import { checkUser } from "../checkUser";
import { availableModels, ModelReturnType } from "../models";
import { ModelName, Username } from "../types";

export function handlePhotoMessage(
  openai: OpenAI,
  currentModels: Record<Username, ModelName | undefined>,
) {
  return async (ctx: any) => {
    const { notRegisteredReply, registered, username } = checkUser(ctx);
    if (!registered && notRegisteredReply) {
      return notRegisteredReply;
    }

    if (!username) {
      console.error("Cannot find username", ctx.message.from);
      return ctx.reply("🙀 Sorry, who are you?!");
    }
    const modelId =
      currentModels[username] ??
      availableModels.find(
        (model) => model.returnType === ModelReturnType.MULTIMODAL,
      )?.id;
    if (!modelId) {
      console.error("No model defined to process photo", ctx.message.from);
      return ctx.reply("🙀 No model defined to process photo");
    }
    console.log("Got a photo from:", username);

    const tgMessage = await ctx.reply("🐈🤔‍Mrrrrrrr...", {
      reply_to_message_id: ctx.message.message_id,
    });
    const tgMessageId = tgMessage.message_id;

    let photoId;
    if (ctx.message.photo) {
      const photo = ctx.message.photo.pop();
      photoId = photo?.file_id; // get the photo file_id
    }

    if (photoId) {
      try {
        const link = await ctx.telegram.getFileLink(photoId); // get the photo URL
        const text = ctx.message.caption ?? "Describe this image";

        if (link.href) {
          const completion = await openai.chat.completions.create({
            model: modelId,
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text },
                  {
                    type: "image_url",
                    image_url: {
                      url: link.href,
                      detail: "high",
                    },
                  },
                ],
              },
            ],
          });

          console.log("Usage:", completion.usage);

          const responseMessage = completion.choices[0].message;
          if (responseMessage) {
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
        } else {
          // todo reply could not get url
          console.log("Could not get photo url");
          await ctx.editMessageText("Meow! 😿 could not get photo url:");
        }
      } catch (e: any) {
        console.log("Error in getting photo or generating response:", e);
        await ctx.editMessageText("Meow! 😿 An error happened:\n" + e.message);
      }
    }
  };
}
