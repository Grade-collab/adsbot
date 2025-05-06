import { Global, Module } from '@nestjs/common';
import { MinioService } from './minio.service';

const providers =[
    MinioService
]
@Global()
@Module({
    providers,
    exports: providers,
})
export class MinioModule { }