import { Client } from 'minio';
import { MinioKeys } from './minio.keys';
import { ConfigService } from 'src/config/config.service';
export declare class MinioService {
    private readonly config;
    client: Client;
    constructor(config: ConfigService);
    private init;
    save: (key: MinioKeys, fileId: string, data: string | Buffer) => Promise<import("minio/dist/main/internal/type").UploadedObjectInfo>;
    get: (key: MinioKeys, fileId: string) => Promise<Buffer<ArrayBufferLike>>;
}
