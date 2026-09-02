const { token } = require("../Config/botConfig")
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const fs = require("fs");
const chalk = require("chalk").default
const bot = require("../../base/bot").client
const times = new Date();

const commands = [];

fs.readdirSync("./src/bot/SlashCommands/Public/").forEach((folder) => {
  const commandFiles = fs
    .readdirSync(`./src/bot/SlashCommands/Public/${folder}/`)
    .filter((file) => file.endsWith(".js"));

  commandFiles.forEach((file) => {
    const command = require(`../SlashCommands/Public/${folder}/${file}`);
    bot.Public.set(command.data.name, command);
    commands.push(command.data.toJSON());
  });
});

bot.on("ready", () => {
  const CLIENT_ID = bot.user.id;

  const rest = new REST({ version: "10" }).setToken(token);

  (async () => {
    try {
      await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

      console.log(chalk.blue(`${times.toLocaleString()}`) + (chalk.magenta(` [COMMAND] `) + chalk.white(`Successfully reloaded application (/) commands.`)));
    } catch (error) {
      console.error(error);
    }
  })();
});