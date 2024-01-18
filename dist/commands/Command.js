"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(client, options) {
        this.validateOptions(options);
        this.client = client;
        this.command = options.command;
        this.alias = options.alias;
        this.description = options.description;
        this.roles = options.roles;
    }
    handle(_, __) {
        throw new Error(`${this.command} has no handle method defined.`);
    }
    checkPermissions(message, ownerOverride = true) {
        let matched = false;
        this.roles.forEach((v) => {
            if (v.toLowerCase() === "administrator" && message.member.permissions.has("ADMINISTRATOR"))
                matched = true;
            if (v.toLowerCase() === "everyone")
                matched = true;
            if (message.member.roles.cache.has(v))
                matched = true;
        });
        return matched;
    }
    validateOptions(options) {
        if (!options.command) {
            let fail = "Cannot register command: command received without a command property";
            throw new TypeError(fail);
        }
        if (options.roles === undefined || !Array.isArray(options.roles)) {
            let fail = "Cannot register command: command received without a valid roles array";
            throw new TypeError(fail);
        }
    }
}
exports.default = Command;
//# sourceMappingURL=Command.js.map