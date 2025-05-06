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
exports.CloudflareService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const cloudflare_1 = require("cloudflare");
const config_service_1 = require("../config/config.service");
const prisma_service_1 = require("../prisma/prisma.service");
let CloudflareService = class CloudflareService {
    constructor(config, prisma) {
        this.config = config;
        this.prisma = prisma;
        this.logger = new common_1.Logger("CloudflareService");
        this.domains = async () => {
            const { result: items } = await this.cloudflare.zones.list();
            const domains = await this.prisma.domain.findMany({
                select: {
                    id: true,
                    domain: true,
                    status: true
                }
            });
            this.logger.log(`Найдено доменов: ${items.length}.`);
            const _success = [];
            for (let item of items) {
                const { id: cfId, name: domain } = item;
                const { status } = item;
                _success.push(domain);
                const _domain = domains.find(e => e.domain == domain);
                if (_domain) {
                    if (status != "active" && _domain.status) {
                        await this.prisma.domain.update({
                            where: {
                                id: _domain.id,
                            },
                            data: {
                                status: false
                            }
                        });
                        this.logger.log(`Домен выключен: ${domain}`);
                    }
                    else if (!_domain.status && status == "active") {
                        await this.prisma.domain.update({
                            where: {
                                id: _domain.id,
                            },
                            data: {
                                status: true
                            }
                        });
                        this.logger.log(`Домен включен: ${domain}`);
                    }
                    continue;
                }
                await this.prisma.domain.create({
                    data: {
                        domain,
                        cfId,
                        status: status == "active"
                    }
                });
                this.logger.log(`Домен создан: ${domain}`);
            }
            if (_success.length == domains.length)
                return;
            const result = await this.prisma.domain.updateMany({
                where: {
                    domain: {
                        notIn: _success
                    }
                },
                data: {
                    status: false
                }
            });
            this.logger.log(`Выключилось доменов: ${result.count}`);
        };
        this.subDomain = async (subDomainId) => {
            try {
                const subDomain = await this.prisma.subDomain.findUnique({
                    where: {
                        id: subDomainId,
                        domain: {
                            status: true
                        },
                        siteId: { not: null },
                        site: {
                            status: true
                        }
                    },
                    select: {
                        id: true,
                        prefix: true,
                        workerId: true,
                        domain: {
                            select: {
                                cfId: true,
                                domain: true
                            }
                        },
                        site: {
                            select: {
                                ip: true
                            }
                        }
                    }
                });
                if (!subDomain) {
                    this.logger.debug("Домен не найден");
                    return false;
                }
                const { result: records } = await this.cloudflare.dns.records.list({
                    zone_id: subDomain.domain.cfId
                });
                const record = records.find((record) => record.name === `${subDomain.prefix}.${subDomain.domain.domain}`);
                if (!record) {
                    const result = await this.cloudflare.dns.records.create({
                        type: "A",
                        name: subDomain.prefix,
                        content: subDomain.site.ip,
                        zone_id: subDomain.domain.cfId,
                        proxied: true,
                        comment: `Worker ${subDomain.workerId}`
                    });
                    console.log(result);
                    if (!result?.id) {
                        return false;
                    }
                    return true;
                }
                const result = await this.cloudflare.dns.records.update(record.id, {
                    type: "A",
                    name: subDomain.prefix,
                    content: subDomain.site.ip,
                    zone_id: subDomain.domain.cfId,
                    proxied: true,
                    comment: `Worker ${subDomain.workerId}`
                });
                console.log(result);
                if (!result?.id) {
                    return false;
                }
                return true;
            }
            catch (ex) {
                this.logger.error(ex);
                return false;
            }
        };
        this.delete = async (subDomainId) => {
            const subDomain = await this.prisma.subDomain.findUnique({
                where: {
                    id: subDomainId,
                    domain: {
                        status: true
                    },
                    siteId: { not: null },
                },
                select: {
                    id: true,
                    prefix: true,
                    workerId: true,
                    domain: {
                        select: {
                            cfId: true,
                            domain: true
                        }
                    },
                    site: {
                        select: {
                            ip: true
                        }
                    }
                }
            });
            const { result: records } = await this.cloudflare.dns.records.list({
                zone_id: subDomain.domain.cfId
            });
            const record = records.find((record) => record.name === `${subDomain.prefix}.${subDomain.domain.domain}`);
            if (!record) {
                return;
            }
            const res = await this.cloudflare.dns.records.delete(record.id, { zone_id: subDomain.domain.cfId });
        };
        this.cloudflare = new cloudflare_1.default({
            apiToken: this.config.CLOUDFLARE_API_TOKEN,
        });
    }
    hanldeDomains() {
        this.domains();
    }
};
exports.CloudflareService = CloudflareService;
__decorate([
    (0, schedule_1.Cron)("0 * * * * *"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CloudflareService.prototype, "hanldeDomains", null);
exports.CloudflareService = CloudflareService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService,
        prisma_service_1.PrismaService])
], CloudflareService);
//# sourceMappingURL=cf.service.js.map