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
exports.BotKeyboard = void 0;
const common_1 = require("@nestjs/common");
const bot_inline_1 = require("./bot.inline");
const config_service_1 = require("../config/config.service");
let BotKeyboard = class BotKeyboard {
    constructor(config) {
        this.config = config;
        this.back = () => {
            return [
                [
                    {
                        text: '🚀 Приступить к работе',
                        callback_data: bot_inline_1.BotInline.start,
                    },
                ],
            ];
        };
        this.subdomainSuccess = (id) => {
            return [
                [
                    {
                        text: '🚀 Приступить к работе',
                        callback_data: `${bot_inline_1.BotInline.subdomain}_${id}`,
                    },
                ],
            ];
        };
        this.subdomainCancel = (id) => {
            return [
                [
                    {
                        text: '⬅️  Вернуться назад',
                        callback_data: `${bot_inline_1.BotInline.websites}_${id}`,
                    },
                ],
            ];
        };
        this.launcher = () => {
            return [
                [
                    { text: '💚 WeChat', callback_data: bot_inline_1.BotInline.launcher_wechat },
                    { text: '💙 Zoom', callback_data: bot_inline_1.BotInline.launcher_zoom },
                ],
                [
                    {
                        text: '⬅️  Вернуться назад',
                        callback_data: `${bot_inline_1.BotInline.start}`,
                    },
                ],
            ];
        };
        this.launcherCode = () => {
            return [
                [{ text: '🔄 Генерация кода', callback_data: bot_inline_1.BotInline.launcher_code }],
                [
                    {
                        text: '⬅️  Вернуться назад',
                        callback_data: `${bot_inline_1.BotInline.start}`,
                    },
                ],
            ];
        };
        this.start = () => {
            return [
                [
                    { text: '🖥️ Домены', callback_data: bot_inline_1.BotInline.websites },
                    { text: '📜 Логи', callback_data: bot_inline_1.BotInline.logs },
                ],
                [
                    { text: '🎛 Установочник', callback_data: bot_inline_1.BotInline.launcher },
                ],
                [{ text: '👤 Мой профиль', callback_data: bot_inline_1.BotInline.profile }],
                [{ text: '🛠️ Тех. Поддержка', url: this.config.TELEGRAM_SUPPORT }],
            ];
        };
        this.subdomainSetting = (id, subId, siteId) => {
            return [
                [
                    {
                        text: `${!siteId ? '❗️ ' : ''}🌐 Сайт`,
                        callback_data: `${bot_inline_1.BotInline.site}_${subId}`,
                    },
                    { text: '📜 Логи', callback_data: `${bot_inline_1.BotInline.logs}_${subId}` },
                ],
                [
                    {
                        text: '⚠️ Удаление',
                        callback_data: `${bot_inline_1.BotInline.subdomainDelete}_${subId}`,
                    },
                ],
                [
                    {
                        text: '⬅️  Вернуться назад',
                        callback_data: `${bot_inline_1.BotInline.websites}_${id}`,
                    },
                ],
            ];
        };
        this.subdomainBack = (id) => {
            return [
                [
                    {
                        text: '⬅️  Вернуться назад',
                        callback_data: `${bot_inline_1.BotInline.websites}_${id}`,
                    },
                ],
            ];
        };
    }
};
exports.BotKeyboard = BotKeyboard;
exports.BotKeyboard = BotKeyboard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], BotKeyboard);
//# sourceMappingURL=bot.keyboard.js.map