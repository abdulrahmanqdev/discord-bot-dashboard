const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Botun pinginizi öğrenmenize yarar."),

  usage: "/ping",
  description: "Botun pinginizi öğrenmenize yarar.",
  category: "bot",

  async execute(interaction, bot) {
    const client = interaction.client;

    const date = Date.now();

    interaction
      .reply({
        content: `Ping ölçümü yapılıyor bekleyiniz...`
      })
      .then(async () => {
        let msg = await interaction.fetchReply();

        try {

          const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("🏓  Pong!")
            .addFields(
              {
                name: `⏱️ Bot Pingi ↷`,
                value: `\`\`\`${Math.round(bot.ws.ping)}ms\`\`\``,
              },
              {
                name: `⌛ Mesaj Yanıt Pingi ↷`,
                value: `\`\`\`${msg.createdTimestamp - date}ms\`\`\``,
              }
            );

          interaction
            .editReply({
              content: "",
              embeds: [embed]
            }).catch(() => { });
        } catch {
          interaction
            .editReply({
              content: ` **Başarısız!** Bir hata meydana geldi!`
            }).catch(() => { });
        }
      })
      .catch(() => { });
  },
};
