"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const common_1 = require("@nestjs/common");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
let ConfigService = class ConfigService {
    constructor() {
        this.CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
        this.TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        this.TELEGRAM_SUPPORT = process.env.TELEGRAM_SUPPORT;
        this.TELEGRAM_LOG = process.env.TELEGRAM_LOG;
        this.APP_NAME = process.env.APP_NAME;
        this.MINIO_HOST = process.env.MINIO_HOST;
        this.MINIO_PORT = +process.env.MINIO_PORT;
        this.MINIO_USER = process.env.MINIO_USER;
        this.MINIO_PASSWORD = process.env.MINIO_PASSWORD;
    }
};
exports.ConfigService = ConfigService;
exports.ConfigService = ConfigService = __decorate([
    (0, common_1.Injectable)()
], ConfigService);
//# sourceMappingURL=config.service.js.map