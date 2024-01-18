"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../Command"));
class VersionCommand extends Command_1.default {
    constructor(client) {
        super(client, {
            command: "request version information",
            alias: "version",
            description: "vZDC Operator Version information",
            roles: [
                "everyone"
            ]
        });
    }
    handle(message, args) {
        message.channel.send(`vZDC OPERATOR PROGRAM VERSION ${global.__version} BY DANIEL ESPONDA. END OF LINE.`);
    }
}
exports.default = VersionCommand;
//# sourceMappingURL=index.js.map