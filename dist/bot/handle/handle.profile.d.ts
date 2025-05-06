import { Context } from "telegraf";
import { BotEffect } from "../bot.effect";
import { PrismaService } from "src/prisma/prisma.service";
import { UtilsService } from "src/utils/utils.service";
import { BotKeyboard } from "../bot.keyboard";
export declare class HandleProfile {
    private readonly effect;
    private readonly prisma;
    private readonly utils;
    private readonly keyboard;
    constructor(effect: BotEffect, prisma: PrismaService, utils: UtilsService, keyboard: BotKeyboard);
    action: (ctx: Context) => Promise<void>;
}
