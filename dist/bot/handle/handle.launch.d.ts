import { Context } from 'telegraf';
import { BotEffect } from '../bot.effect';
import { PrismaService } from 'src/prisma/prisma.service';
import { BotKeyboard } from '../bot.keyboard';
import { MinioService } from 'src/minio/minio.service';
export declare class HandleLaunch {
    private readonly effect;
    private readonly prisma;
    private readonly keyboard;
    private readonly minio;
    constructor(effect: BotEffect, prisma: PrismaService, keyboard: BotKeyboard, minio: MinioService);
    handleCron(): void;
    private handleUpdate;
    action: (ctx: Context) => Promise<void>;
    weChat: (ctx: Context) => Promise<void>;
    zoom: (ctx: Context) => Promise<void>;
    code: (ctx: Context) => Promise<void>;
}
