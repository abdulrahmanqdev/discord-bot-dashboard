const fs = require("fs");
const bot = require("../../base/bot").client
fs.readdirSync("./src/bot/Events/").forEach((folder) => {
  const commandFiles = fs
    .readdirSync(`./src/bot/Events/${folder}/`)
    .filter((file) => file.endsWith(".js"));

  commandFiles.forEach((file) => {
    const event = require(`../Events/${folder}/${file}`);
    bot.on(event.conf.name, event);
  });
});