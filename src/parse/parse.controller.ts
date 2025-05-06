import { Body, Controller, Post } from "@nestjs/common";
import { ParseValid } from "./parse.dto";
import { ParseService } from "./parse.service";

@Controller('/parse')
export class ParseController {
    constructor(
        private readonly parse: ParseService
    ) {

    }
    @Post("/valid")
    valid(@Body() body: ParseValid) {
        return this.parse.valid(body)
    }
}