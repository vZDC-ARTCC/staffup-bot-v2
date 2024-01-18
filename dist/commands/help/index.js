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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("../Command"));
class HelpCommand extends Command_1.default {
    constructor(client) {
        super(client, {
            command: "help",
            description: "Shows vZDC Operator Help",
            roles: [
                "everyone"
            ]
        });
    }
    handle(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = new discord_js_1.MessageEmbed();
            embed
                .setTitle("vZDC OPERATOR HELP")
                .setDescription("PREFIX: TAG MASTER CONTROL PROGRAM")
                .setFooter({ text: "END OF LINE." })
                .setColor(message.guild.me.displayHexColor);
            const commands = [];
            message.client.commands.forEach(cmd => {
                try {
                    commands.push(`\`${cmd.command}\` - ${cmd.description}`);
                }
                catch (e) {
                    console.log("could not push message");
                }
            });
            embed.addField("Commands", commands.join("\n"));
            message.channel.send({ embeds: [embed] }).catch(error => {
                console.log(error);
            });
        });
    }
}
exports.default = HelpCommand;
//# sourceMappingURL=index.js.map