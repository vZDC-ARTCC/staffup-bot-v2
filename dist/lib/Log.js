"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Log {
    static write(message, error) {
        const d = new Date();
        let msg = `[${d.toISOString()}] ${error ? " ERROR - " : " INFO  - "} ${message}`;
        console.log(msg);
    }
    static info(message) {
        Log.write(message, false);
    }
    static error(message) {
        Log.write(message, true);
    }
}
exports.default = Log;
//# sourceMappingURL=Log.js.map