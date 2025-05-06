import { Client } from 'minio'
import { Injectable } from '@nestjs/common'
import { MinioKeys } from './minio.keys'
import { ConfigService } from 'src/config/config.service'

@Injectable()
export class MinioService {
  public client: Client
  constructor (private readonly config: ConfigService) {
    this.client = new Client({
      endPoint: this.config.MINIO_HOST,
      useSSL: false,
      port: this.config.MINIO_PORT,
      accessKey: this.config.MINIO_USER,
      secretKey: this.config.MINIO_PASSWORD,
    })
    this.init()
  }

  private init = async () => {
    const names = Object.keys(MinioKeys)
    
    for (let name of names) {
      try {
        const exists = await this.client.bucketExists(name)
        if (exists) {
          continue
        } else {
          await this.client.makeBucket(name)
        }
      } catch (ex) {
        console.error(ex)
        // await this.init()
      }
    }
  }

  save = (key: MinioKeys, fileId: string, data: string | Buffer) => {
    try {
      return this.client.putObject(key, fileId, data)
    } catch {}
  }

  get = async (key: MinioKeys, fileId: string) => {
    const stream = await this.client.getObject(key, fileId)
    const chunks: Buffer[] = []
    return new Promise<Buffer>((resolve, reject) => {
      stream.on('data', chunk => chunks.push(chunk))
      stream.on('end', () => resolve(Buffer.concat(chunks)))
      stream.on('error', reject)
    })
  }
}
