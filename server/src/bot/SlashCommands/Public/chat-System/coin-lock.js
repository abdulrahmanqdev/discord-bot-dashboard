const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../../../../bot/tools.js");
const { developersID } = require("../../../Config/botConfig.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coin-lock")
    .setDescription("Lock your coins in the system for security purposes.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user whose coins you want to lock.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("The reason for locking the coins.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const userKey = `coins/${user.id}/userdata`;

    if (!developersID.includes(interaction.user.id)) {
      return interaction
        .reply({
          content: `> **Failed!** This command is reserved for bot owners and developers.`,
          flags: 64,
        })
        .catch(() => {});
    }

    try {
      const existingData = (await db.get(userKey)) || {};
      const updatedData = {
        ...existingData,
        lockedAt: new Date().toISOString(),
        reason: reason,
      };

      await db.set(userKey, updatedData);

      return interaction.reply({
        content: `Successfully locked coins for ${user}.\n**Reason:** ${reason}`,
        flags: 64,
      }).catch(() => {});
    } catch (error) {
      console.error("Error updating user data:", error);
      return interaction.reply({
        content: "An error occurred while processing your request.",
        flags: 64,
      }).catch(() => {});
    }
  },
};