"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleWebSite = void 0;
const common_1 = require("@nestjs/common");
const telegraf_1 = require("telegraf");
const bot_effect_1 = require("../bot.effect");
const prisma_service_1 = require("../../prisma/prisma.service");
const bot_inline_1 = require("../bot.inline");
const utils_service_1 = require("../../utils/utils.service");
const bot_keyboard_1 = require("../bot.keyboard");
const cf_service_1 = require("../../cf/cf.service");
let HandleWebSite = class HandleWebSite {
    constructor(effect, prisma, utils, keyboard, cloudflare) {
        this.effect = effect;
        this.prisma = prisma;
        this.utils = utils;
        this.keyboard = keyboard;
        this.cloudflare = cloudflare;
        this.action = async (ctx) => {
            await this.effect.delete(ctx);
            const telegramId = ctx.from.id.toString();
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
            });
            const domainButtons = [];
            let i = 0;
            for (let domain of domains) {
                const index = i - i % 2;
                if (!domainButtons[index]) {
                    domainButtons[index] = [];
                }
                domainButtons[index][i % 2] = ({
                    text: `${domain.subdomains.length > 0 ? "🔹" : "🔸"} ${domain.domain}`,
                    callback_data: `${bot_inline_1.BotInline.websites}_${domain.id}`,
                });
                i += 1;
            }
            domainButtons.push([
                {
                    text: "⬅️ Вернуться назад",
                    callback_data: `${bot_inline_1.BotInline.start}`
                }
            ]);
            await ctx.reply('<b>🖥️ Выберите домен:</b>', {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: domainButtons.filter(e => e),
                },
            });
        };
        this.actionById = async (ctx) => {
            await this.effect.delete(ctx);
            const telegramId = ctx.from.id.toString();
            const id = +(ctx.match?.[1] || "0");
            if (!id)
                return;
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
            });
            const domainButtons = [];
            let i = 0;
            for (let sub of domain.subdomains) {
                const index = i - i % 2;
                if (!domainButtons[index]) {
                    domainButtons[index] = [];
                }
                domainButtons[index][i % 2] = ({
                    text: `${sub._count.logs > 0 ? "🔹" : "🔸"} ${sub.prefix}.${domain.domain}`,
                    callback_data: `${bot_inline_1.BotInline.subdomain}_${sub.id}`,
                });
                i += 1;
            }
            domainButtons.push([
                {
                    text: "♻️ Добавить поддомен",
                    callback_data: `${bot_inline_1.BotInline.subdomainAdd}_${domain.id}`
                }
            ]);
            domainButtons.push([
                {
                    text: "⬅️ Вернуться назад",
                    callback_data: `${bot_inline_1.BotInline.websites}`
                }
            ]);
            ctx.reply(`<b>🖥️ Вы выбрали:</b>\n\n`
                + `<b>ID:</b> ${id}\n`
                + `<b>Домен:</b> ${domain.domain}\n`
                + `<b>Создан:</b> ${this.utils.date(domain.createdAt)}\n`
                + `<b>Логи:</b> ${domain.subdomains.reduce((a, b) => a + b._count.logs, 0)}`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: domainButtons.filter(e => e),
                },
            });
        };
        this.actionSubDomainAdd = async (ctx) => {
            const id = +(ctx.match[1] || "0");
            ctx.scene.enter(bot_inline_1.BotInline.subdomainAdd, { id });
        };
        this.scena = () => {
            const data = new telegraf_1.Scenes.WizardScene(bot_inline_1.BotInline.subdomainAdd, async (ctx) => {
                await this.effect.delete(ctx);
                const { id } = ctx.scene.session.state;
                const telegramId = ctx.from.id.toString();
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
                    return;
                }
                await ctx.reply('✍️ Пожалуйста, введите имя сабдомена:', {
                    reply_markup: {
                        inline_keyboard: this.keyboard.subdomainCancel(id)
                    }
                });
                await ctx.wizard.next();
            }, async (ctx) => {
                try {
                    const pyaload = ctx.callbackQuery?.data;
                    if (pyaload?.includes(bot_inline_1.BotInline.websites)) {
                        await ctx.scene.leave();
                        if (!ctx.match) {
                            ctx.match = [];
                        }
                        ctx.match[1] = pyaload.split("_")[1];
                        this.actionById(ctx);
                        return;
                    }
                    const prefix = ctx?.text;
                    const test = this.utils.subdomain(prefix);
                    const { id } = ctx.scene.session.state;
                    await this.effect.delete(ctx);
                    if (!test) {
                        await ctx.reply('❗️ Вы ввели неверное имя поддомена', {
                            reply_markup: {
                                inline_keyboard: this.keyboard.subdomainCancel(id)
                            }
                        });
                        return;
                    }
                    const telegramId = ctx.from.id.toString();
                    const worker = await this.prisma.worker.findUnique({
                        where: {
                            telegramId
                        }
                    });
                    const sub = await this.prisma.subDomain.create({
                        data: {
                            prefix,
                            domainId: id,
                            workerId: worker.id
                        }
                    });
                    await ctx.reply('✅ Вы успешно добавили домен!', {
                        reply_markup: {
                            inline_keyboard: this.keyboard.subdomainSuccess(sub.id)
                        }
                    });
                }
                catch (ex) {
                    const { id } = ctx.scene.session.state;
                    await ctx.reply('❗️ Поддомен уже занят. Повторите попытку', {
                        reply_markup: {
                            inline_keyboard: this.keyboard.subdomainCancel(id)
                        }
                    });
                    return;
                }
                await ctx.scene.leave();
            });
            return data;
        };
        this.subdomainById = async (ctx) => {
            await this.effect.delete(ctx);
            const telegramId = ctx.from.id.toString();
            const id = +(ctx.match[1] || "0");
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
            });
            if (!sub) {
                return;
            }
            ctx.reply(`<b>⚙️ Настройка сабдомена</b>\n\n`
                + `<b>ID:</b> ${sub.id}\n`
                + `<b>Дата и время:</b> ${this.utils.date(sub.createdAt)}\n`
                + `<b>Ссылка:</b> ${sub.prefix}.${sub.domain.domain}\n`
                + `<b>Сайт:</b> ${sub.site?.name || "Сайт не выбран"}\n`
                + `<b>Логи:</b> ${sub._count.logs}`, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: this.keyboard.subdomainSetting(sub.domain.id, sub.id, sub.siteId)
                }
            });
        };
        this.subdomainDelete = async (ctx) => {
            await this.effect.delete(ctx);
            const telegramId = ctx.from.id.toString();
            const id = +(ctx.match[1] || "0");
            const _sub = await this.prisma.subDomain.findUnique({
                where: {
                    id,
                    worker: {
                        telegramId
                    }
                }
            });
            if (!_sub) {
                return;
            }
            try {
                await this.cloudflare.delete(id);
            }
            catch {
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
            });
            ctx.reply(`<b>✅ Поддомен успешно удален</b>\n\n`, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: this.keyboard.subdomainBack(sub.domain.id)
                }
            });
        };
    }
};
exports.HandleWebSite = HandleWebSite;
exports.HandleWebSite = HandleWebSite = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bot_effect_1.BotEffect,
        prisma_service_1.PrismaService,
        utils_service_1.UtilsService,
        bot_keyboard_1.BotKeyboard,
        cf_service_1.CloudflareService])
], HandleWebSite);
//# sourceMappingURL=handle.website.js.map