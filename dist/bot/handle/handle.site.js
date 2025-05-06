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
exports.HanldeSite = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bot_inline_1 = require("../bot.inline");
const bot_effect_1 = require("../bot.effect");
const cf_service_1 = require("../../cf/cf.service");
let HanldeSite = class HanldeSite {
    constructor(prisma, effect, cloudflare) {
        this.prisma = prisma;
        this.effect = effect;
        this.cloudflare = cloudflare;
        this.action = async (ctx) => {
            await this.effect.delete(ctx);
            const telegramId = ctx.from.id.toString();
            const id = +(ctx.match[1] || "0");
            const sub = await this.prisma.subDomain.findUnique({
                where: {
                    id,
                    worker: {
                        telegramId
                    }
                }
            });
            const sites = await this.prisma.site.findMany({
                where: {
                    status: true
                }
            });
            const btns = [];
            let i = 0;
            for (let site of sites) {
                const index = i - i % 2;
                if (!btns[index]) {
                    btns[index] = [];
                }
                btns[index][i % 2] = ({
                    text: `${sub.siteId == site.id ? "🔹 " : ""}${site.name}`,
                    callback_data: `${bot_inline_1.BotInline.siteSelect}_${sub.id}_${site.id}`,
                });
                i += 1;
            }
            btns.push([
                {
                    text: '⬅️  Вернуться назад',
                    callback_data: `${bot_inline_1.BotInline.subdomain}_${id}`,
                },
            ]);
            ctx.reply(`<b>🌐 Выберите сайт:</b>\n\n`, {
                parse_mode: "HTML",
                reply_markup: {
                    inline_keyboard: btns
                }
            });
        };
        this.actionSelect = async (ctx) => {
            try {
                await this.effect.delete(ctx);
                const telegramId = ctx.from.id.toString();
                const id = +(ctx.match[1] || "0");
                const sub = await this.prisma.subDomain.findUnique({
                    where: {
                        id,
                        worker: {
                            telegramId
                        }
                    }
                });
                if (!sub) {
                    return;
                }
                const siteId = +(ctx.match[2] || "0");
                await this.prisma.subDomain.update({
                    where: {
                        id
                    },
                    data: {
                        siteId
                    }
                });
                const result = await this.cloudflare.subDomain(id);
                this.action(ctx);
            }
            catch {
                this.action(ctx);
            }
        };
    }
};
exports.HanldeSite = HanldeSite;
exports.HanldeSite = HanldeSite = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bot_effect_1.BotEffect,
        cf_service_1.CloudflareService])
], HanldeSite);
//# sourceMappingURL=handle.site.js.map