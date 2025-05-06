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
exports.HandleLaunch = void 0;
const common_1 = require("@nestjs/common");
const bot_effect_1 = require("../bot.effect");
const prisma_service_1 = require("../../prisma/prisma.service");
const bot_keyboard_1 = require("../bot.keyboard");
const schedule_1 = require("@nestjs/schedule");
const minio_service_1 = require("../../minio/minio.service");
let HandleLaunch = class HandleLaunch {
    constructor(effect, prisma, keyboard, minio) {
        this.effect = effect;
        this.prisma = prisma;
        this.keyboard = keyboard;
        this.minio = minio;
        this.handleUpdate = async () => {
            const date = new Date(Date.now() - 48 * 60 * 60 * 1000);
            await this.prisma.passCode.deleteMany({
                where: {
                    active: true,
                    createdAt: {
                        lt: date,
                    },
                },
            });
        };
        this.action = async (ctx) => {
            await this.effect.delete(ctx);
            await ctx.reply('<b>Выберите установочник:</b>', {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: this.keyboard.launcher(),
                },
            });
        };
        this.weChat = async (ctx) => {
            await this.effect.delete(ctx);
            await ctx.reply('<b>💚 WeChat:</b>\n\n', {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: this.keyboard.launcherCode(),
                },
            });
        };
        this.zoom = async (ctx) => {
            await this.effect.delete(ctx);
            await ctx.reply('<b>💙 Zoom:</b>\n\n', {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: this.keyboard.launcherCode(),
                },
            });
        };
        this.code = async (ctx) => {
            await this.effect.delete(ctx);
            const worker = await this.prisma.worker.findUnique({
                where: {
                    telegramId: ctx.from.id.toString(),
                },
            });
            if (!worker) {
                return;
            }
            const code = await this.prisma.passCode.create({
                data: {
                    workerId: worker.id,
                },
            });
            await ctx.reply('<b>Секретный код:</b>\n\n' + `<code>${code.id}</code>`, {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: this.keyboard.back(),
                },
            });
        };
    }
    handleCron() {
        this.handleUpdate();
    }
};
exports.HandleLaunch = HandleLaunch;
__decorate([
    (0, schedule_1.Cron)('0 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HandleLaunch.prototype, "handleCron", null);
exports.HandleLaunch = HandleLaunch = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bot_effect_1.BotEffect,
        prisma_service_1.PrismaService,
        bot_keyboard_1.BotKeyboard,
        minio_service_1.MinioService])
], HandleLaunch);
//# sourceMappingURL=handle.launch.js.map