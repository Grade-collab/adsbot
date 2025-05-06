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
exports.HandleStart = void 0;
const common_1 = require("@nestjs/common");
const config_service_1 = require("../../config/config.service");
const bot_effect_1 = require("../bot.effect");
const bot_keyboard_1 = require("../bot.keyboard");
let HandleStart = class HandleStart {
    constructor(config, effect, keyboard) {
        this.config = config;
        this.effect = effect;
        this.keyboard = keyboard;
        this.action = async (ctx) => {
            await this.effect.delete(ctx);
            await ctx.reply(`🤖 <b>Добро пожаловать в проект <u>${this.config.APP_NAME}</u></b>\n\n`
                + 'Мы предоставляем вам мощный инструмент для управления и мониторинга доменов.\n'
                + 'Все возможности бота доступны только подписчикам нашего канала.\n\n'
                + '📌 Если у вас есть вопросы или предложения, обращайтесь в службу поддержки.\n\n'
                + 'Выберите действие и начинайте работать!', {
                reply_markup: {
                    inline_keyboard: this.keyboard.start(),
                },
                parse_mode: "HTML"
            });
        };
    }
};
exports.HandleStart = HandleStart;
exports.HandleStart = HandleStart = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService,
        bot_effect_1.BotEffect,
        bot_keyboard_1.BotKeyboard])
], HandleStart);
//# sourceMappingURL=handle.start.js.map