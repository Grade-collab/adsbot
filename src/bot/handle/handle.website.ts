import { Injectable } from "@nestjs/common";
import { Context, Scenes } from "telegraf";
import { BotEffect } from "../bot.effect";
import { PrismaService } from "src/prisma/prisma.service";
import { BotInline } from "../bot.inline";
import { UtilsService } from "src/utils/utils.service";
import { CallbackQuery, Update } from "telegraf/typings/core/types/typegram";
import { BotKeyboard } from "../bot.keyboard";
import { CloudflareService } from "src/cf/cf.service";

@Injectable()
export class HandleWebSite {
    constructor(
        private readonly effect: BotEffect,
        private readonly prisma: PrismaService,
        private readonly utils: UtilsService,
        private readonly keyboard: BotKeyboard,
        private readonly cloudflare: CloudflareService
    ) {

    }

    action = async (ctx: Context) => {
        await this.effect.delete(ctx)
        const telegramId = ctx.from.id.toString()
        const domains = await this.prisma.domain.findMany({
            where: {
                status: true
            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                domain: true,
                subdomains: {
                    take: 1,
                    where: {
                        worker: {
                            telegramId
                        }
                    },
                    select: {
                        id: true
                    }
                }
            }
        })
        const domainButtons: any[][] = []
        let i = 0
        for (let domain of domains) {
            const index = i - i % 2
            if (!domainButtons[index]) {
                domainButtons[index] = []
            }
            domainButtons[index][i % 2] = ({
                text: `${domain.subdomains.length > 0 ? "🔹" : "🔸"} ${domain.domain}`,
                callback_data: `${BotInline.websites}_${domain.id}`,
            })
            i += 1
        }

        domainButtons.push([
            {
                text: "⬅️ Вернуться назад",
                callback_data: `${BotInline.start}`
            }
        ]);
        await ctx.reply('<b>🖥️ Выберите домен:</b>', {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: domainButtons.filter(e => e),
            },
        });
    }

    actionById = async (ctx: Context) => {
        await this.effect.delete(ctx)
        const telegramId = ctx.from.id.toString()
        const id = +((ctx as any).match?.[1] || "0");
        if (!id) return
        const domain = await this.prisma.domain.findUnique({
            where: {
                id,
                status: true
            },
            select: {
                id: true,
                domain: true,
                createdAt: true,
                subdomains: {
                    where: {
                        worker: {
                            telegramId
                        }
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    select: {
                        id: true,
                        prefix: true,
                        _count: {
                            select: {
                                logs: true
                            }
                        }
                    }
                }
            }
        })
        const domainButtons: any[][] = []
        let i = 0
        for (let sub of domain.subdomains) {
            const index = i - i % 2
            if (!domainButtons[index]) {
                domainButtons[index] = []
            }
            domainButtons[index][i % 2] = ({
                text: `${sub._count.logs > 0 ? "🔹" : "🔸"} ${sub.prefix}.${domain.domain}`,
                callback_data: `${BotInline.subdomain}_${sub.id}`,
            })
            i += 1
        }

        domainButtons.push([
            {
                text: "♻️ Добавить поддомен",
                callback_data: `${BotInline.subdomainAdd}_${domain.id}`
            }
        ]);

        domainButtons.push([
            {
                text: "⬅️ Вернуться назад",
                callback_data: `${BotInline.websites}`
            }
        ]);

        ctx.reply(
            `<b>🖥️ Вы выбрали:</b>\n\n`
            + `<b>ID:</b> ${id}\n`
            + `<b>Домен:</b> ${domain.domain}\n`
            + `<b>Создан:</b> ${this.utils.date(domain.createdAt)}\n`
            + `<b>Логи:</b> ${domain.subdomains.reduce((a, b) => a + b._count.logs, 0)}`,
            {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: domainButtons.filter(e => e),
                },
            }
        )
    }

    actionSubDomainAdd = async (ctx: Context<Update> & Scenes.WizardContext<Scenes.WizardSessionData>) => {

        const id = +((ctx as any).match[1] || "0");
        ctx.scene.enter(BotInline.subdomainAdd, { id })
    }

    scena = () => {
        const data = new Scenes.WizardScene(
            BotInline.subdomainAdd,
            async (ctx) => {

                await this.effect.delete(ctx)
                const { id } = (ctx.scene.session.state as any);
                const telegramId = ctx.from.id.toString()
                const limit = await this.prisma.subDomain.count({
                    where: {
                        domainId: id,
                        worker: {
                            telegramId
                        }
                    }
                });
                if (limit > 2) {
                    await ctx.reply('⚠️ Достигнут лимит поддоменов на один домен. Максимальное количество 3', {
                        reply_markup: {
                            inline_keyboard: this.keyboard.subdomainCancel(id)
                        }
                    });
                    await ctx.scene.leave();
                    return
                }

                await ctx.reply('✍️ Пожалуйста, введите имя сабдомена:', {
                    reply_markup: {
                        inline_keyboard: this.keyboard.subdomainCancel(id)
                    }
                });
                await ctx.wizard.next();
            },
            async (ctx) => {
                try {
                    const pyaload = (ctx as any).callbackQuery?.data as string
                    if (pyaload?.includes(BotInline.websites)) {
                        await ctx.scene.leave();
                        if (!(ctx as any).match) {
                            (ctx as any).match = []
                        }
                        (ctx as any).match[1] = pyaload.split("_")[1]
                        this.actionById(ctx)
                        return;
                    }
                    const prefix = ctx?.text;
                    const test = this.utils.subdomain(prefix)
                    const { id } = (ctx.scene.session.state as any);
                    await this.effect.delete(ctx)

                    if (!test) {

                        await ctx.reply('❗️ Вы ввели неверное имя поддомена', {
                            reply_markup: {
                                inline_keyboard: this.keyboard.subdomainCancel(id)
                            }
                        });
                        return
                    }
                    const telegramId = ctx.from.id.toString()
                    const worker = await this.prisma.worker.findUnique({
                        where: {
                            telegramId
                        }
                    })
                    const sub = await this.prisma.subDomain.create({
                        data: {
                            prefix,
                            domainId: id,
                            workerId: worker.id
                        }
                    })
                    await ctx.reply('✅ Вы успешно добавили домен!', {
                        reply_markup: {
                            inline_keyboard: this.keyboard.subdomainSuccess(sub.id)
                        }
                    });
                } catch (ex) {
                    const { id } = (ctx.scene.session.state as any);

                    await ctx.reply('❗️ Поддомен уже занят. Повторите попытку', {
                        reply_markup: {
                            inline_keyboard: this.keyboard.subdomainCancel(id)
                        }
                    });
                    return
                }
                await ctx.scene.leave();
            }
        );
        return data
    }

    subdomainById = async (ctx: Context) => {
        await this.effect.delete(ctx)

        const telegramId = ctx.from.id.toString()
        const id = +((ctx as any).match[1] || "0");
        const sub = await this.prisma.subDomain.findUnique({
            where: {
                id,
                worker: {
                    telegramId
                }
            },
            select: {
                id: true,
                createdAt: true,
                prefix: true,
                siteId: true,
                domain: {
                    select: {
                        id: true,
                        domain: true
                    }
                },
                site: {
                    select: {
                        name: true
                    }
                },
                _count: {
                    select: {
                        logs: true
                    }
                }
            }
        })
        if (!sub) {
            return
        }
        ctx.reply(
            `<b>⚙️ Настройка сабдомена</b>\n\n`
            + `<b>ID:</b> ${sub.id}\n`
            + `<b>Дата и время:</b> ${this.utils.date(sub.createdAt)}\n`
            + `<b>Ссылка:</b> ${sub.prefix}.${sub.domain.domain}\n`
            + `<b>Сайт:</b> ${sub.site?.name || "Сайт не выбран"}\n`
            + `<b>Логи:</b> ${sub._count.logs}`,
            {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: this.keyboard.subdomainSetting(sub.domain.id, sub.id, sub.siteId)
                }
            }
        )


    }
    subdomainDelete = async (ctx: Context) => {
        await this.effect.delete(ctx)

        const telegramId = ctx.from.id.toString()
        const id = +((ctx as any).match[1] || "0");
        const _sub = await this.prisma.subDomain.findUnique({
            where: {
                id,
                worker: {
                    telegramId
                }
            }
        })
        if (!_sub) {
            return
        }
        try {
            await this.cloudflare.delete(id)
        } catch {

        }
        const sub = await this.prisma.subDomain.delete({
            where: {
                id,
                worker: {
                    telegramId
                }
            },
            select: {
                id: true,
                createdAt: true,
                prefix: true,
                domain: {
                    select: {
                        id: true,
                        domain: true
                    }
                },
                site: {
                    select: {
                        name: true
                    }
                },
                _count: {
                    select: {
                        logs: true
                    }
                }
            }
        })

        ctx.reply(
            `<b>✅ Поддомен успешно удален</b>\n\n`,
            {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: this.keyboard.subdomainBack(sub.domain.id)
                }
            }
        )


    }
}