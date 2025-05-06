import { PrismaService } from 'src/prisma/prisma.service';
import { Context } from 'telegraf';
export declare class BotMiddleware {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    validateUser(ctx: Context, next: () => Promise<any>): Promise<void>;
}
