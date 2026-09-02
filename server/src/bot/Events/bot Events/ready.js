const { EmbedBuilder } = require("@discordjs/builders");
const { playings } = require("../../Config/botConfig")
const bot = require("../../../base/bot.js").client

module.exports = async () => {

  const playing = playings[Math.floor(Math.random() * playings.length)];

  bot.user.setPresence({
    activities: [{ name: "Başlıyorum..." }],
    status: "online",
  });

  setInterval(() => {
    const playing = playings[Math.floor(Math.random() * playings.length)];

    bot.user.setPresence({
      activities: [{ name: `${playing}` }],
      status: "idle",
    });
  }, 30000);


};
module.exports.conf = {
  name: "ready",
};
