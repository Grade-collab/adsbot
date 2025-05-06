import { ParseValid } from "./parse.dto";
import { ParseService } from "./parse.service";
export declare class ParseController {
    private readonly parse;
    constructor(parse: ParseService);
    valid(body: ParseValid): Promise<{
        success: boolean;
    }>;
}
