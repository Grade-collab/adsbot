import { ConfigService } from "src/config/config.service";
import { PrismaService } from "src/prisma/prisma.service";
export declare class CloudflareService {
    private readonly config;
    private readonly prisma;
    private cloudflare;
    private readonly logger;
    constructor(config: ConfigService, prisma: PrismaService);
    hanldeDomains(): void;
    private domains;
    subDomain: (subDomainId: any) => Promise<boolean>;
    delete: (subDomainId: number) => Promise<void>;
}
