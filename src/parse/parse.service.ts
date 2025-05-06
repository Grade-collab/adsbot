import { Injectable } from "@nestjs/common";
import { ParseValid } from "./parse.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ParseService {
    constructor(
        private readonly prisma: PrismaService
    ) {

    }

    valid = async ({ secretKey }: ParseValid) => {
        const account = await this.prisma.worker.findUnique({
            where: {
                secretKey,
                blocked: false
            }
        });
        return {
            success: !!account
        }
    }
}