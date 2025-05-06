import { Injectable } from "@nestjs/common";
import { Context } from "telegraf";

@Injectable()
export class BotEffect {
    delete = async (ctx: Context) => {
        try {
            if (ctx.callbackQuery?.message?.message_id) {
                await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
            }
        } catch { }
    }
}