import { Injectable } from "@nestjs/common";
import { Context } from "telegraf";
import { BotInline } from "../bot.inline";
import { ConfigService } from "src/config/config.service";
import { BotEffect } from "../bot.effect";
import { BotKeyboard } from "../bot.keyboard";

@Injectable()
export class HandleStart {
    constructor(
        private readonly config: ConfigService,
        private readonly effect: BotEffect,
        private readonly keyboard: BotKeyboard
    ) {

    }

    action = async (ctx: Context) => {
        await this.effect.delete(ctx)


        await ctx.reply(`🤖 <b>Добро пожаловать в проект <u>${this.config.APP_NAME}</u></b>\n\n`
            + 'Мы предоставляем вам мощный инструмент для управления и мониторинга доменов.\n'
            + 'Все возможности бота доступны только подписчикам нашего канала.\n\n'
            + '📌 Если у вас есть вопросы или предложения, обращайтесь в службу поддержки.\n\n'
            + 'Выберите действие и начинайте работать!', {
            reply_markup: {
                inline_keyboard: this.keyboard.start(),
            },
            parse_mode: "HTML"
        });
    }
}