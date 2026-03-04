import { Context } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";

export type TextContextType = Context<{
  message: Update.New & Update.NonChannel & Message.TextMessage;
  update_id: number;
}>;

export type PhotoContextType = Context<{
  message: Update.New & Update.NonChannel & Message.PhotoMessage;
  update_id: number;
}>;

export type ContextType = TextContextType | PhotoContextType;

export type Username = string;

export type ModelName = string;
