"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(client, message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (message.channel.type === "DM") {
            // Only respond to version DMs, ignore the rest
            if (message.content.toLowerCase() === "version") {
                message.author.send(`MASTER CONTROL PROGRAM VERSION ${global.__version} BY DANIEL ESPONDA. END OF LINE.`);
            }
            return;
        }
        const prefixRegex = new RegExp(`^(<@!?&?${client.user.id}>)\\s*`);
        if (prefixRegex.test(message.content)) {
            const [, match] = message.content.match(prefixRegex);
            const args = message.content.slice(match.length).trim().split(/ +/g);
            const cmd = args.shift().toLowerCase();
            const msg = message.content.slice(match.length).trim();
            let command = client.commands.get(msg) || findCommand(client, message.content.slice(match.length).trim().split(/ +/g)) || client.commands.get(cmd); // If command not found as match, try single word command
            if (command) {
                if (!command.checkPermissions(message)) {
                    message.channel.send("YOU DO NOT HAVE ACCESS TO THIS REQUEST. END OF LINE.");
                }
                else {
                    command.handle(message, message.content.slice(match.length).trim().split(/ +/g));
                }
            }
        }
    });
}
exports.default = default_1;
;
function findCommand(client, args) {
    for (let [cmd, value] of client.commands) {
        let numWords = cmd.split(" ").length;
        let equivCmd = args.slice(0, numWords).join(" ");
        if (equivCmd.toLowerCase() == cmd.toLowerCase()) {
            return value;
        }
    }
}
//# sourceMappingURL=messageCreate.js.map