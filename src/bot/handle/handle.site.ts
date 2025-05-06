import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Context } from "telegraf";
import { BotInline } from "../bot.inline";
import { BotEffect } from "../bot.effect";
import { CloudflareService } from "src/cf/cf.service";

@Injectable()
export class HanldeSite {
    constructor(
        private readonly prisma: PrismaService,
        private readonly effect: BotEffect,
        private readonly cloudflare: CloudflareService
    ) {

    }

    action = async (ctx: Context) => {
        await this.effect.delete(ctx)
        const telegramId = ctx.from.id.toString()
        const id = +((ctx as any).match[1] || "0");
        const sub = await this.prisma.subDomain.findUnique({
            where: {
                id,
                worker: {
                    telegramId
                }
            }
        })
        const sites = await this.prisma.site.findMany({
            where: {
                status: true
            }
        })
        const btns: any[][] = []
        let i = 0
        for (let site of sites) {
            const index = i - i % 2
            if (!btns[index]) {
                btns[index] = []
            }
            btns[index][i % 2] = ({
                text: `${sub.siteId == site.id ? "🔹 " : ""}${site.name}`,
                callback_data: `${BotInline.siteSelect}_${sub.id}_${site.id}`,
            })
            i += 1
        }

        btns.push([
            {
                text: '⬅️  Вернуться назад',
                callback_data: `${BotInline.subdomain}_${id}`,
            },
        ])
        ctx.reply(
            `<b>🌐 Выберите сайт:</b>\n\n`,
            {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: btns
                }
            }
        )
    }

    actionSelect = async (ctx: Context) => {
        try {
            await this.effect.delete(ctx)
            const telegramId = ctx.from.id.toString()
            const id = +((ctx as any).match[1] || "0");
            const sub = await this.prisma.subDomain.findUnique({
                where: {
                    id,
                    worker: {
                        telegramId
                    }
                }
            });
            if (!sub) {
                return
            }

            const siteId = +((ctx as any).match[2] || "0");
            await this.prisma.subDomain.update({
                where: {
                    id
                },
                data: {
                    siteId
                }
            })
            const result = await this.cloudflare.subDomain(id)

            this.action(ctx)
        } catch {
            this.action(ctx)
        }
    }
}