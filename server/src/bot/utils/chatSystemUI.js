const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ChannelSelectMenuBuilder,
  ButtonStyle,
  ChannelType,
} = require("discord.js");

function createEmbed(user) {
  return new EmbedBuilder()
    .setDescription(
      "# Welcome to the chat system menu.\n> You can use the buttons or menus below to set up the system\n> Select which channel to earn coins from. Then click the Active button"
    )
    .setColor("Blue")
    .setFooter({
      text: `${user.username} Thank you for use me`,
      iconURL: user.avatarURL({ dynamic: true }),
    });
}

function createSelectMenu(disabled) {
  return new ActionRowBuilder().addComponents(
    new ChannelSelectMenuBuilder()
      .setCustomId("coin_channel")
      .setPlaceholder("Would you choose a coin channel..")
      .setChannelTypes([ChannelType.GuildText])
      .setDisabled(disabled)
  );
}

function createButtons(status) {
  const isActive = status === "on";
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("active")
      .setLabel("🟢 | Active")
      .setStyle(ButtonStyle.Success)
      .setDisabled(isActive),
    new ButtonBuilder()
      .setCustomId("deactive")
      .setLabel("🔴 | Deactive")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(!isActive),
    new ButtonBuilder()
      .setCustomId("reset_system")
      .setLabel("🔎 | Reset System")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(!isActive)
  );
}

module.exports = { createEmbed, createSelectMenu, createButtons };
