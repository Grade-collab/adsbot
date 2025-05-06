import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context, Telegraf } from 'telegraf';

@Injectable()
export class BotMiddleware {
    private readonly logger = new Logger("BotMiddleware")
    constructor(private readonly prisma: PrismaService) { }

    async validateUser(ctx: Context, next: () => Promise<any>) {
        const telegramId = ctx.from?.id

        if (!telegramId || telegramId < 0) return;
        const user = ctx.from
        try {
            // const chatMember = await ctx.telegram.getChatMember(process.env.CHANNEL_ID, chatId);
            const worker = await this.prisma.worker.findFirst({
                where: {
                    telegramId:`${telegramId}`
                },
                select: {
                    blocked: true
                }
            })
            
            if (!worker) {
                await this.prisma.worker.create({
                    data: {
                        telegramId:`${telegramId}`,
                        username: user.username,
                        name: `${user.first_name || ""} ${user.last_name||""}`
                    }
                })
            }
            if (worker?.blocked) {
                return
            }
            await next();
            // if (chatMember.status === 'member' || chatMember.status === 'administrator') {
            //     await next();
            // } else {
            //     await ctx.reply('🚫 Подпишитесь на канал, чтобы использовать бота.');
            //     Logger.warn(`User ${chatId} is not subscribed to the channel`);
            // }
        } catch (error) {
            this.logger.error('Middleware validation error', error);
            await ctx.reply('Бот временно не работает. Попробуйте позже.');
        }
    }
}
