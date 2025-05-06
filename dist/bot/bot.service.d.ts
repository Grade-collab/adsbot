import { ConfigService } from 'src/config/config.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HandleStart } from './handle/handle.start';
import { HandleLogs } from './handle/handle.logs';
import { HandleProfile } from './handle/handle.profile';
import { HandleWebSite } from './handle/handle.website';
import { HanldeSite } from './handle/handle.site';
import { HandleLaunch } from './handle/handle.launch';
export declare class BotService {
    private readonly config;
    private readonly prisma;
    private readonly handleStart;
    private readonly handleLogs;
    private readonly handleProfile;
    private readonly handleWebsite;
    private readonly hanldeSite;
    private readonly handleLaucnh;
    private bot;
    private readonly logger;
    constructor(config: ConfigService, prisma: PrismaService, handleStart: HandleStart, handleLogs: HandleLogs, handleProfile: HandleProfile, handleWebsite: HandleWebSite, hanldeSite: HanldeSite, handleLaucnh: HandleLaunch);
    private init;
    newLog: (id: number) => Promise<void>;
}
