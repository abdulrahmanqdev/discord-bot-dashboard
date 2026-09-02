const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ComponentType,
  PermissionsBitField,
} = require("discord.js");
const { db } = require("../../../../bot/tools.js");
const client = require("../../../../base/bot.js").client;

const {
  createEmbed,
  createSelectMenu,
  createButtons,
} = require("../../../utils/chatSystemUI.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chat-system")
    .setDescription("Configure the chat-based coin system."),
  async execute(interaction) {
    const { guild, user, member } = interaction;
    await interaction.deferReply();

    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({
        content: "🔴 | You need `Administrator` permission to use this command.",
        flags: 64,
      });
    }

    const status = await db.get(`chatSystem/${guild.id}/status`);
    const channel = await db.get(`chatSystem/${guild.id}/channel`);
    const isActive = status === "on";
    const embed = createEmbed(user);
    const selectMenu = createSelectMenu(isActive || !!channel);
    const buttons = createButtons(status);

    const message = await interaction.editReply({
      embeds: [embed],
      components: [selectMenu, buttons],
    });

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.ChannelSelect,
      time: 60_000,
    });

    const buttonCollector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60_000,
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== user.id) return i.reply({ content: "Only you can use this.", flags: 64 });

      const selectedChannel = i.values[0];
      await db.set(`chatSystem/${guild.id}`, {
        channel: selectedChannel,
        UseUser: user.id,
      });

      const updatedEmbed = createEmbed(user);
      const updatedMenu = createSelectMenu(true);
      const updatedButtons = createButtons("off");

      await i.reply({ content: "✅ Channel selected!", flags: 64 });
      await interaction.editReply({
        embeds: [updatedEmbed],
        components: [updatedMenu, updatedButtons],
      });
    });

    buttonCollector.on("collect", async (i) => {
      if (i.user.id !== user.id) return i.reply({ content: "Only you can use this.", flags: 64 });

      let newStatus;
      if (i.customId === "active") {
        const d = await db.get(`chatSystem/${guild.id}`) || {};
        newStatus = "on";
        await db.set(`chatSystem/${guild.id}`, { ...d, status: newStatus });
        await i.reply({ content: "✅ System activated!", flags: 64 });
      } else if (i.customId === "deactive") {
        const d = await db.get(`chatSystem/${guild.id}`) || {};
        newStatus = "off";
        await db.set(`chatSystem/${guild.id}`, { ...d, status: newStatus });
        await i.reply({ content: "✅ System deactivated!", flags: 64 });
      } else if (i.customId === "reset_system") {
        await db.delete(`chatSystem/${guild.id}`);
        newStatus = "off";
        await i.reply({ content: "✅ System reset!", flags: 64 });
      }

      const updatedEmbed = createEmbed(user);
      const updatedMenu = createSelectMenu(newStatus === "on");
      const updatedButtons = createButtons(newStatus);

      await interaction.editReply({
        embeds: [updatedEmbed],
        components: [updatedMenu, updatedButtons],
      });
    });
  },
};
