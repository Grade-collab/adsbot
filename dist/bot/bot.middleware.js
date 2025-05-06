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
exports.BotMiddleware = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BotMiddleware = class BotMiddleware {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger("BotMiddleware");
    }
    async validateUser(ctx, next) {
        const telegramId = ctx.from?.id;
        if (!telegramId || telegramId < 0)
            return;
        const user = ctx.from;
        try {
            const worker = await this.prisma.worker.findFirst({
                where: {
                    telegramId: `${telegramId}`
                },
                select: {
                    blocked: true
                }
            });
            if (!worker) {
                await this.prisma.worker.create({
                    data: {
                        telegramId: `${telegramId}`,
                        username: user.username,
                        name: `${user.first_name || ""} ${user.last_name || ""}`
                    }
                });
            }
            if (worker?.blocked) {
                return;
            }
            await next();
        }
        catch (error) {
            this.logger.error('Middleware validation error', error);
            await ctx.reply('Бот временно не работает. Попробуйте позже.');
        }
    }
};
exports.BotMiddleware = BotMiddleware;
exports.BotMiddleware = BotMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BotMiddleware);
//# sourceMappingURL=bot.middleware.js.map