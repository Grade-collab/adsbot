import { LogService } from './log.service';
import { Request } from 'express';
import { LogQuery } from './log.dto';
export declare class LogController {
    private readonly log;
    constructor(log: LogService);
    handle(request: Request): string;
    param(request: Request, param: LogQuery): Promise<{
        urls: any;
    }>;
}
