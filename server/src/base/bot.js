// @ts-check
const settings = require("../settings.js");
const { Client, Collection, IntentsBitField } = require("discord.js");
const chalk = require("chalk");
const client = new Client({
  intents: 3276543,
  failIfNotExists: true,
});
const times = new Date();
async function start() {
  client.once("ready", () => {
    console.log(chalk.blue(`${times.toLocaleString()}`) + chalk.magenta(` [BOT] `) + chalk.white(`Successfully [${client.user.tag}] activated.`))
  });
  
  await client.login(settings.bot.token)
}

module.exports = { client, start };
