const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("premium-info")
    .setDescription("Botun pinginizi öğrenmenize yarar."),

  usage: "/ping",
  description: "Botun pinginizi öğrenmenize yarar.",
  category: "bot",

  async execute(interaction, bot) {
    const guild = interaction.guild;
    const { user } = interaction;

    const premiumButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setLabel("⚪ | İron Package")
            .setCustomId("iron_paket")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setLabel("🟡 | Gold Package")
            .setCustomId("gold_paket")
            .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
            .setLabel("🔵 | Diamond Package")
            .setCustomId("dia_paket")
            .setStyle(ButtonStyle.Secondary)
        )

    const premium = new EmbedBuilder()
    .setAuthor({
        name: bot.user.username + " | Premium İnformation",
        iconURL: bot.user.avatarURL({ dynamic: true })
    })
    .setDescription("# Welcome to Premium Page\n\n-# We have 3 premium packages as follows. You can choose the package that suits you and get more detailed information.")
    .setColor("DarkButNotBlack")
    .setFooter({
        text: user.username + " Using The Command",
        iconURL: user.avatarURL({ dynamic: true })
    })

    interaction.reply({
        embeds: [premium],
        components: [premiumButton]
    }).catch(() => {})

  }
};
