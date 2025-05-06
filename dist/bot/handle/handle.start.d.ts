import { Context } from "telegraf";
import { ConfigService } from "src/config/config.service";
import { BotEffect } from "../bot.effect";
import { BotKeyboard } from "../bot.keyboard";
export declare class HandleStart {
    private readonly config;
    private readonly effect;
    private readonly keyboard;
    constructor(config: ConfigService, effect: BotEffect, keyboard: BotKeyboard);
    action: (ctx: Context) => Promise<void>;
}
