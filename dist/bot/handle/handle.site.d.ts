import { PrismaService } from "src/prisma/prisma.service";
import { Context } from "telegraf";
import { BotEffect } from "../bot.effect";
import { CloudflareService } from "src/cf/cf.service";
export declare class HanldeSite {
    private readonly prisma;
    private readonly effect;
    private readonly cloudflare;
    constructor(prisma: PrismaService, effect: BotEffect, cloudflare: CloudflareService);
    action: (ctx: Context) => Promise<void>;
    actionSelect: (ctx: Context) => Promise<void>;
}
