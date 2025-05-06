import { Context, Scenes } from "telegraf";
import { BotEffect } from "../bot.effect";
import { PrismaService } from "src/prisma/prisma.service";
import { UtilsService } from "src/utils/utils.service";
import { Update } from "telegraf/typings/core/types/typegram";
import { BotKeyboard } from "../bot.keyboard";
import { CloudflareService } from "src/cf/cf.service";
export declare class HandleWebSite {
    private readonly effect;
    private readonly prisma;
    private readonly utils;
    private readonly keyboard;
    private readonly cloudflare;
    constructor(effect: BotEffect, prisma: PrismaService, utils: UtilsService, keyboard: BotKeyboard, cloudflare: CloudflareService);
    action: (ctx: Context) => Promise<void>;
    actionById: (ctx: Context) => Promise<void>;
    actionSubDomainAdd: (ctx: Context<Update> & Scenes.WizardContext<Scenes.WizardSessionData>) => Promise<void>;
    scena: () => Scenes.WizardScene<Context<Update> & {
        scene: Scenes.SceneContextScene<unknown, Scenes.WizardSessionData>;
        wizard: Scenes.WizardContextWizard<unknown>;
    }>;
    subdomainById: (ctx: Context) => Promise<void>;
    subdomainDelete: (ctx: Context) => Promise<void>;
}
