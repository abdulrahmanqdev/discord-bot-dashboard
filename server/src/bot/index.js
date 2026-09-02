const { Client, Collection, } = require("discord.js");
const { token } = require("./Config/botConfig")
const chalk = require("chalk")
const times = new Date();
const bot = require("../base/bot").client
bot.Public = new Collection();
bot.default_Cmd = new Collection();
bot.aliases = new Collection();
bot.guildInvites = new Map();
bot.guildVaintyInvites = new Map();

require("discord-logs")(bot, { debug: false });

require("./Handlers/eventHandler");
require("./Handlers/commandHandler");
//