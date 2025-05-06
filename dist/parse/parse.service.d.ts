import { ParseValid } from "./parse.dto";
import { PrismaService } from "src/prisma/prisma.service";
export declare class ParseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    valid: ({ secretKey }: ParseValid) => Promise<{
        success: boolean;
    }>;
}
