import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import Cloudflare from "cloudflare";
import { ConfigService } from "src/config/config.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CloudflareService {
    private cloudflare: Cloudflare
    private readonly logger = new Logger("CloudflareService")
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService
    ) {
        this.cloudflare = new Cloudflare({
            apiToken: this.config.CLOUDFLARE_API_TOKEN,
        })
    }


    @Cron("0 * * * * *")
    hanldeDomains() {
        this.domains()
    }

    private domains = async () => {
        const { result: items } = await this.cloudflare.zones.list();
        const domains = await this.prisma.domain.findMany({
            select: {
                id: true,
                domain: true,
                status: true
            }
        })
        this.logger.log(`Найдено доменов: ${items.length}.`)
        const _success: string[] = []
        for (let item of items) {
            const { id: cfId, name: domain } = item
            const { status } = item as any
            _success.push(domain)
            const _domain = domains.find(e => e.domain == domain)
            if (_domain) {
                if (status != "active" && _domain.status) {
                    await this.prisma.domain.update({
                        where: {
                            id: _domain.id,
                        },
                        data: {
                            status: false
                        }
                    })
                    this.logger.log(`Домен выключен: ${domain}`)
                }
                else if (!_domain.status && status == "active") {
                    await this.prisma.domain.update({
                        where: {
                            id: _domain.id,
                        },
                        data: {
                            status: true
                        }
                    })
                    this.logger.log(`Домен включен: ${domain}`)
                }
                continue
            }

            await this.prisma.domain.create({
                data: {
                    domain,
                    cfId,
                    status: status == "active"
                }
            })
            this.logger.log(`Домен создан: ${domain}`)
        }
        if (_success.length == domains.length)
            return

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

        this.logger.log(`Выключилось доменов: ${result.count}`)
    }

    subDomain = async (subDomainId) => {
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
                            domain:true
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
                this.logger.debug("Домен не найден")
                return false
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
                console.log(result)
                if (!result?.id) {
                    return false
                }
                return true

            }
            const result = await this.cloudflare.dns.records.update(record.id, {
                type: "A",
                name: subDomain.prefix,
                content: subDomain.site.ip,
                zone_id: subDomain.domain.cfId,
                proxied: true,
                comment: `Worker ${subDomain.workerId}`
            })
            console.log(result)
            if (!result?.id) {
                return false
            }
            return true

        } catch (ex) {
            this.logger.error(ex)
            return false
        }
    }
    delete = async (subDomainId: number) => {
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
            return
        }

        const res = await this.cloudflare.dns.records.delete(record.id, { zone_id: subDomain.domain.cfId })
    }

}