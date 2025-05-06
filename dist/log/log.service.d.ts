import { Request } from 'express';
import { BotService } from 'src/bot/bot.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LogQuery } from './log.dto';
import { MinioService } from 'src/minio/minio.service';
export declare class LogService {
    private readonly prisma;
    private readonly bot;
    private readonly minio;
    private readonly logger;
    constructor(prisma: PrismaService, bot: BotService, minio: MinioService);
    log: (request: Request) => Promise<void>;
    param: (request: Request, { id }: LogQuery) => Promise<{
        urls: any;
    }>;
    private ip;
    private host;
}
