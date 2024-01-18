"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const fs_1 = require("fs");
const Log_1 = __importDefault(require("./Log"));
const path_1 = require("path");
//import Database from "./Database";
class Client extends discord_js_1.default.Client {
    constructor(options) {
        super(options);
        this.commands = new discord_js_1.default.Collection();
        this.aliases = new discord_js_1.default.Collection();
    }
    loadCommands(path) {
        Log_1.default.info("Loading commands...");
        (0, fs_1.readdirSync)((0, path_1.resolve)(global.__basedir, path)).filter(f => !f.endsWith(".js") && !f.endsWith(".map")).forEach(dir => {
            const commands = (0, fs_1.readdirSync)((0, path_1.resolve)(global.__basedir, (0, path_1.join)(path, dir))).filter(f => f.endsWith(".js"));
            commands.forEach(f => {
                const Command = require((0, path_1.resolve)(global.__basedir, (0, path_1.join)(path, dir, f)));
                const command = new Command.default(this);
                if (command.command) {
                    Log_1.default.info(`Loaded command: ${command.command}`);
                    this.commands.set(command.command, command);
                    if (command.alias) {
                        this.aliases.set(command.alias, command);
                    }
                }
                else {
                    Log_1.default.info(`Problem while loading ${(0, path_1.join)(path, dir, f)}, doesn't appear to be a valid command file.`);
                }
            });
        });
        return this;
    }
    loadEvents(path) {
        (0, fs_1.readdirSync)((0, path_1.resolve)(global.__basedir, path)).filter(f => f.endsWith(".js")).forEach(file => {
            const event = require((0, path_1.resolve)(global.__basedir, (0, path_1.join)(path, file)));
            const eventName = file.substring(0, file.indexOf("."));
            super.on(eventName, event.default.bind(null, this));
            delete require.cache[require.resolve((0, path_1.resolve)(global.__basedir, (0, path_1.join)(path, file)))]; // Delete cache
            Log_1.default.info(`Loaded event: ${eventName}`);
        });
        return this;
    }
}
exports.default = Client;
//# sourceMappingURL=Client.js.map