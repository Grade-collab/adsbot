"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogService = void 0;
const common_1 = require("@nestjs/common");
const bot_service_1 = require("../bot/bot.service");
const prisma_service_1 = require("../prisma/prisma.service");
const minio_service_1 = require("../minio/minio.service");
const minio_keys_1 = require("../minio/minio.keys");
let LogService = class LogService {
    constructor(prisma, bot, minio) {
        this.prisma = prisma;
        this.bot = bot;
        this.minio = minio;
        this.logger = new common_1.Logger('LogService');
        this.log = async (request) => {
            try {
                const ip = this.ip(request);
                const userAgent = request.headers['user-agent'];
                const host = request.headers['host'];
                this.logger.log(`${ip} ${host} ${userAgent}`);
                const [prefix, domain] = this.host(host);
                if (!prefix) {
                    return;
                }
                const subDomain = await this.prisma.subDomain.findFirst({
                    where: {
                        prefix,
                        domain: {
                            domain,
                        },
                    },
                });
                if (!subDomain) {
                    this.logger.warn('Not found domain');
                    return;
                }
                const log = await this.prisma.log.create({
                    data: {
                        subDomainId: subDomain.id,
                        workerId: subDomain.workerId,
                        ip,
                        userAgent,
                    },
                });
                this.bot.newLog(log.id);
            }
            catch (ex) {
                this.logger.error(ex);
            }
        };
        this.param = async (request, { id }) => {
            try {
                const ip = this.ip(request);
                const userAgent = request.headers['user-agent'];
                const host = request.headers['host'];
                this.logger.log(`${ip} ${host} ${userAgent}`);
                const code = await this.prisma.passCode.update({
                    where: {
                        id,
                        active: true,
                    },
                    data: {
                        active: false,
                    },
                });
                if (!code) {
                    this.logger.warn('Invalid code');
                    return {
                        urls: [],
                    };
                }
                const log = await this.prisma.log.create({
                    data: {
                        ip,
                        userAgent,
                        passCodeId: code.id,
                    },
                });
                this.bot.newLog(log.id);
                const data = await this.minio.get(minio_keys_1.MinioKeys.stfile, 'urls.json');
                return {
                    urls: JSON.parse(data.toString()),
                };
            }
            catch (ex) {
                this.logger.error(ex);
                return {
                    urls: [],
                };
            }
        };
        this.ip = (request) => {
            const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
            return Array.isArray(ip) ? ip[0] : ip;
        };
        this.host = (host) => {
            if (!host)
                return [null, null];
            const parts = host.split('.');
            if (parts.length >= 2) {
                const subdomain = parts.length > 2 ? parts[0] : null;
                const domain = parts.slice(-2).join('.');
                return [subdomain, domain];
            }
            return [null, host];
        };
    }
};
exports.LogService = LogService;
exports.LogService = LogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bot_service_1.BotService,
        minio_service_1.MinioService])
], LogService);
//# sourceMappingURL=log.service.js.map