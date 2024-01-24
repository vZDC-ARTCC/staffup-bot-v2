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
exports.guild = void 0;

const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const Log_1 = __importDefault(require("./lib/Log"));
const Client_1 = __importDefault(require("./lib/Client"));
const node_cron_1 = __importDefault(require("node-cron"));
const axios_1 = __importDefault(require("axios"));

if (!fs_1.default.existsSync(path_1.default.resolve("config.json"))) {
    Log_1.default.error("Config not found");
    process.exit(1);
}

global.__version = "2.0.0";
global.__basedir = __dirname;

const config = JSON.parse(fs_1.default.readFileSync(path_1.default.resolve("config.json")).toString());
const client = new Client_1.default({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
    ],
    partials: [
        'CHANNEL',
    ],
});

let previouslyOnlineZDCControllers = [];
let guild;
exports.guild = guild;

Log_1.default.info(`vZDC Staff Update Bot ${global.__version}`);
client.loadEvents("./events");
client.loadCommands("./commands");

const ratingMap = { 1: "Observer", 2: "Student 1", 3: "Student 2", 4: "Student 3", 5: "Controller 1", 6: "Controller 2", 7: "Controller 3", 8: "Instructor 1", 9: "Instructor 2",
    10: "Instructor 3", 11: "Supervisor", 12: "Admin" };

client.login(config.discord.token);

client.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    Log_1.default.info(`Logged in as ${client.user.tag}`);
    client.user.setActivity("Falcon", { type: "WATCHING" });

    const roles = ["Admin"];

    //set role cache for easy referencing
    let rc = {};
    exports.guild = guild = client.guilds.cache.first();
    yield guild.roles.fetch();

    roles.forEach((r) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        rc[r] = (_a = guild.roles.cache.find((rl) => rl.name === r)) === null || _a === void 0 ? void 0 : _a.id;
        console.log(`Role ${r} found with id ${rc[r]}`);
    }));
    client.roleCache = rc;

    //set channel cache for easy referencing
    const channels = ["test"];
    const categories = ['Washington Center', 'PCT Approach', 'Minor Approach', 'Tower', 'Ground', 'Delivery'];
    let cc = {};
    yield guild.channels.fetch();

    channels.forEach(async (c) => {
        var _b;
        cc[c] = (_b = guild.channels.cache.find((ch) => ch.name === c)) === null || _b === void 0 ? void 0 : _b.id;
        console.log(`Channel ${c} found with id: ${cc[c]}`);
        
        // Clear all messages from the channel
        const initialEmbedChannel = guild.channels.cache.get(cc[c]);
        await initialEmbedChannel.messages.fetch().then(messages => {
            messages.forEach(msg => msg.delete());
        });
    });

    // Initial setup for embed messages
    for (const category of categories) {
        const categoryEmbed = new discord_js_1.MessageEmbed()
            .setColor(0xA01013) // Customize the color
            .setTitle(`${category}`)
            .setDescription("No Controller is Online!");
        const initialEmbedChannel = guild.channels.cache.get(cc["test"]);
        initialEmbedChannel.send({ embeds: [categoryEmbed] });
    }

    node_cron_1.default.schedule("*/10 * * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("running online cron");
        let c = yield client.channels.cache.get(cc["test"]);
        axios_1.default
            .get('https://data.vatsim.net/v3/vatsim-data.json')
            .then(res => {
                const watchedPositions = ['DCA_', 'IAD_', 'BWI_', 'PCT_', 'ADW_', 'DC_C', 'RIC_', 'ROA_', 'ORF_', 'ACY_', 'NGU_',
                    'NTU_', 'NHK_', 'RDU_', 'CHO_', 'HGR_', 'LYH_', 'EWN_', 'LWB_', 'ISO_', 'MTN_', 'HEF_',
                    'MRB_', 'PHF_', 'SBY_', 'NUI_', 'FAY_', 'ILM_', 'NKT_', 'NCA_', 'NYG_', 'DAA_', 'DOV_',
                    'POB_', 'GSB_', 'WAL_', 'CVN_', 'DC_0', 'DC_1', 'DC_2', 'DC_3', 'DC_5', 'DC_N',
                    'DC_S', 'DC_E', 'DC_W', 'DC_I', 'JYO_'];

                let onlineControllers = res.data.controllers;

                // Filter to include only ZDC controllers and watched positions
                onlineControllers = onlineControllers.filter(controller => watchedPositions.some(prefix => controller.callsign.startsWith(prefix)));
    
                categories.forEach(category => {
                    const filteredControllers = filterControllersByCategory(category, onlineControllers);
                    const previouslyFilteredControllers = filterControllersByCategory(category, previouslyOnlineZDCControllers);

                    // Check for changes in controllers
                    const controllersOnline = filteredControllers.filter(controller => !previouslyFilteredControllers.includes(controller));
                    const controllersOffline = previouslyFilteredControllers.filter(controller => !filteredControllers.includes(controller));

                    // Update the corresponding embed message only if there is a change
                    if (controllersOnline.length > 0 || controllersOffline.length > 0) {
                        updateEmbedMessage(`${category}`, filteredControllers, cc);
                    }
                });

                // Update the previously fetched controllers for the next comparison
                previouslyOnlineZDCControllers = onlineControllers.slice();
            })
            .catch(error => {
                console.error(error);
            });
    }));
}));

// Helper function to filter controllers based on category
function filterControllersByCategory(category, controllers) {
    if (category === 'Washington Center') {
        return controllers.filter(controller => controller.callsign.endsWith('CTR'));
    } else if (category === 'PCT Approach') {
        return controllers.filter(controller =>
            ['PCT_', 'IAD_', 'DCA_', 'BWI_'].some(prefix => controller.callsign.startsWith(prefix))
            && (controller.callsign.endsWith('APP') || controller.callsign.endsWith('DEP'))
        );
    } else if (category === 'Minor Approach') {
        // Exclude PCT Approach controllers
        return controllers.filter(controller =>
            !['PCT_', 'IAD_', 'DCA_', 'BWI_'].some(prefix => controller.callsign.startsWith(prefix))
            && (controller.callsign.endsWith('APP') || controller.callsign.endsWith('DEP'))
        );
    } else if (category === 'Tower') {
        return controllers.filter(controller => controller.callsign.endsWith('TWR'));
    } else if (category === 'Ground') {
        return controllers.filter(controller => controller.callsign.endsWith('GND'));
    } else if (category === 'Delivery') {
        return controllers.filter(controller => controller.callsign.endsWith('DEL'));
    } else {
        return [];
    }
}
// Helper function to update embed messages
async function updateEmbedMessage(category, controllers, cc) {
    const categoryEmbed = new discord_js_1.MessageEmbed()
        .setColor(0x1a6b28)
        .setTitle(`${category}`);

    // Check if there are controllers to display
    if (controllers.length > 0) {
        // Add the first controller without an empty field
        const firstController = controllers[0];
        categoryEmbed.addFields(
            { name: "Facility", value: firstController.callsign, inline: true },
            { name: "Name", value: firstController.name, inline: true },
            { name: "Rating", value: ratingMap[firstController.rating], inline: true },
        );

        // Add an empty field and subsequent controllers with an empty field
        for (let i = 1; i < controllers.length; i++) {
            const controller = controllers[i];
            categoryEmbed.addFields(
                { name: '\u200B', value: '\u200B', inline: false }, // Add an empty field for one-line gap
                { name: "Facility", value: controller.callsign, inline: true },
                { name: "Name", value: controller.name, inline: true },
                { name: "Rating", value: ratingMap[controller.rating], inline: true },
            );
        }
    } else {
        // Display a message when no controllers are online
        categoryEmbed.setDescription("No Controller is Online!")
                        .setColor(0xA01013); // Set the color to red
    }

    const initialEmbedChannel = guild.channels.cache.get(cc["test"]);

    try {
        const messages = await initialEmbedChannel.messages.fetch();
        const existingMessage = messages.find(message => message.embeds[0]?.title === category);

        if (existingMessage) {
            // Check if there are changes in controllers before editing the message
            const currentEmbed = existingMessage.embeds[0];
            const hasChanges = !currentEmbed || !currentEmbed.equals(categoryEmbed);

            if (hasChanges) {
                await existingMessage.edit({ embeds: [categoryEmbed] });
            }
        } else {
            // If no messages are found, send a new one
            await initialEmbedChannel.send({ embeds: [categoryEmbed] });
        }

    } catch (error) {
        // Handle any errors during fetch or edit
        console.error(`Error updating message: ${error}`);
    }
}
//# sourceMappingURL=index.js.map