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
exports.HandleProfile = void 0;
const common_1 = require("@nestjs/common");
const bot_effect_1 = require("../bot.effect");
const prisma_service_1 = require("../../prisma/prisma.service");
const utils_service_1 = require("../../utils/utils.service");
const bot_keyboard_1 = require("../bot.keyboard");
let HandleProfile = class HandleProfile {
    constructor(effect, prisma, utils, keyboard) {
        this.effect = effect;
        this.prisma = prisma;
        this.utils = utils;
        this.keyboard = keyboard;
        this.action = async (ctx) => {
            await this.effect.delete(ctx);
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
            });
            const message = `👤 <b>Мой профиль</b>\n\n`
                + `<b>ID:</b> <code>${worker.id}</code>\n`
                + `<b>Ключ доступа:</b>  <code>${worker.secretKey || "Нет доступа"}</code>\n`
                + `<b>Дата создания:</b> ${this.utils.date(worker.createdAt)}\n`
                + `<b>Логов:</b> ${worker._count.logs}\n`
                + `<b>Генераций: </b> ${worker._count.logs}`;
            ctx.reply(message, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: this.keyboard.back(),
                },
            });
        };
    }
};
exports.HandleProfile = HandleProfile;
exports.HandleProfile = HandleProfile = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bot_effect_1.BotEffect,
        prisma_service_1.PrismaService,
        utils_service_1.UtilsService,
        bot_keyboard_1.BotKeyboard])
], HandleProfile);
//# sourceMappingURL=handle.profile.js.map