import { Injectable } from "@nestjs/common";
import { Context } from "telegraf";
import { BotEffect } from "../bot.effect";
import { PrismaService } from "src/prisma/prisma.service";
import { UtilsService } from "src/utils/utils.service";
import { BotKeyboard } from "../bot.keyboard";

@Injectable()
export class HandleProfile {
    constructor(
        private readonly effect: BotEffect,
        private readonly prisma: PrismaService,
        private readonly utils: UtilsService,
        private readonly keyboard: BotKeyboard
    ) {

    }
    action = async (ctx: Context) => {
        await this.effect.delete(ctx)

        const worker = await this.prisma.worker.findUnique({
            where: {
                telegramId: ctx.from.id.toString()
            },
            select: {
                id: true,
                createdAt: true,
                secretKey: true,
                _count: {
                    select: {
                        logs: true,
                        subdomains: true
                    }
                }
            }
        })

        const message = `👤 <b>Мой профиль</b>\n\n`
            + `<b>ID:</b> <code>${worker.id}</code>\n`
            + `<b>Ключ доступа:</b>  <code>${worker.secretKey||"Нет доступа"}</code>\n`
            + `<b>Дата создания:</b> ${this.utils.date(worker.createdAt)}\n`
            + `<b>Логов:</b> ${worker._count.logs}\n`
            + `<b>Генераций: </b> ${worker._count.logs}`
        ctx.reply(message, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: this.keyboard.back(),
            },
        })
    }
}