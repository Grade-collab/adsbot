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
exports.HandleLogs = void 0;
const common_1 = require("@nestjs/common");
const bot_effect_1 = require("../bot.effect");
const prisma_service_1 = require("../../prisma/prisma.service");
const utils_service_1 = require("../../utils/utils.service");
const bot_keyboard_1 = require("../bot.keyboard");
let HandleLogs = class HandleLogs {
    constructor(effect, prisma, utils, keyboard) {
        this.effect = effect;
        this.prisma = prisma;
        this.utils = utils;
        this.keyboard = keyboard;
        this.action = async (ctx) => {
            await this.effect.delete(ctx);
            let subDomainId = +(ctx?.match?.[1] || '0');
            if (!subDomainId) {
                subDomainId = undefined;
            }
            const logs = await this.prisma.log.findMany({
                where: {
                    OR: [
                        {
                            worker: {
                                telegramId: ctx.from.id.toString(),
                            },
                        },
                        {
                            passCode: {
                                worker: {
                                    telegramId: ctx.from.id.toString(),
                                },
                            },
                        },
                    ],
                    subDomainId,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    id: true,
                    createdAt: true,
                    ip: true,
                    userAgent: true,
                    subDomain: {
                        select: {
                            prefix: true,
                            siteId: true,
                            domain: {
                                select: {
                                    domain: true,
                                },
                            },
                        },
                    },
                },
            });
            const logContent = logs
                .map(log => `${log.id}. [${log.createdAt.toISOString()}] - ${log?.subDomain?.prefix || "null"}.${log?.subDomain?.domain?.domain || "null"} ${log.ip} ${log.userAgent}`)
                .join('\n');
            const date = new Date();
            const buffer = Buffer.from(`${this.utils.date(date)}\n\n` + logContent, 'utf-8');
            await ctx.replyWithDocument({ source: buffer, filename: `logs_${ctx.from.id}_${date.getTime()}.txt` }, {
                caption: `📜 <b>Выгрузка логов</b>\n\n` +
                    `<b>Количество:</b> ${logs.length}\n` +
                    `<b>Дата и время:</b> ${this.utils.date(date)}`,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: this.keyboard.back(),
                },
            });
        };
    }
};
exports.HandleLogs = HandleLogs;
exports.HandleLogs = HandleLogs = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bot_effect_1.BotEffect,
        prisma_service_1.PrismaService,
        utils_service_1.UtilsService,
        bot_keyboard_1.BotKeyboard])
], HandleLogs);
//# sourceMappingURL=handle.logs.js.map