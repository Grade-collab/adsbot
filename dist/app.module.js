"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./prisma/prisma.module");
const config_module_1 = require("./config/config.module");
const cf_module_1 = require("./cf/cf.module");
const schedule_1 = require("@nestjs/schedule");
const bot_module_1 = require("./bot/bot.module");
const utils_module_1 = require("./utils/utils.module");
const log_module_1 = require("./log/log.module");
const minio_module_1 = require("./minio/minio.module");
const parse_module_1 = require("./parse/parse.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            config_module_1.ConfigModule,
            cf_module_1.CloudflareModule,
            schedule_1.ScheduleModule.forRoot(),
            bot_module_1.BotModule,
            utils_module_1.UtilsModule,
            log_module_1.LogModule,
            minio_module_1.MinioModule,
            parse_module_1.ParseModule
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map