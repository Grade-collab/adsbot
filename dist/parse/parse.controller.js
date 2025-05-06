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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseController = void 0;
const common_1 = require("@nestjs/common");
const parse_dto_1 = require("./parse.dto");
const parse_service_1 = require("./parse.service");
let ParseController = class ParseController {
    constructor(parse) {
        this.parse = parse;
    }
    valid(body) {
        return this.parse.valid(body);
    }
};
exports.ParseController = ParseController;
__decorate([
    (0, common_1.Post)("/valid"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [parse_dto_1.ParseValid]),
    __metadata("design:returntype", void 0)
], ParseController.prototype, "valid", null);
exports.ParseController = ParseController = __decorate([
    (0, common_1.Controller)('/parse'),
    __metadata("design:paramtypes", [parse_service_1.ParseService])
], ParseController);
//# sourceMappingURL=parse.controller.js.map