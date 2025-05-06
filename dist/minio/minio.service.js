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
exports.MinioService = void 0;
const minio_1 = require("minio");
const common_1 = require("@nestjs/common");
const minio_keys_1 = require("./minio.keys");
const config_service_1 = require("../config/config.service");
let MinioService = class MinioService {
    constructor(config) {
        this.config = config;
        this.init = async () => {
            const names = Object.keys(minio_keys_1.MinioKeys);
            for (let name of names) {
                try {
                    const exists = await this.client.bucketExists(name);
                    if (exists) {
                        continue;
                    }
                    else {
                        await this.client.makeBucket(name);
                    }
                }
                catch (ex) {
                    console.error(ex);
                }
            }
        };
        this.save = (key, fileId, data) => {
            try {
                return this.client.putObject(key, fileId, data);
            }
            catch { }
        };
        this.get = async (key, fileId) => {
            const stream = await this.client.getObject(key, fileId);
            const chunks = [];
            return new Promise((resolve, reject) => {
                stream.on('data', chunk => chunks.push(chunk));
                stream.on('end', () => resolve(Buffer.concat(chunks)));
                stream.on('error', reject);
            });
        };
        this.client = new minio_1.Client({
            endPoint: this.config.MINIO_HOST,
            useSSL: false,
            port: this.config.MINIO_PORT,
            accessKey: this.config.MINIO_USER,
            secretKey: this.config.MINIO_PASSWORD,
        });
        this.init();
    }
};
exports.MinioService = MinioService;
exports.MinioService = MinioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_service_1.ConfigService])
], MinioService);
//# sourceMappingURL=minio.service.js.map