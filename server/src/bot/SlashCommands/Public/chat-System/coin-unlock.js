const { SlashCommandBuilder } = require("discord.js");
const { db } = require("../../../../bot/tools.js");
const { developersID } = require("../../../Config/botConfig.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coin-unlock")
    .setDescription("Unlock a user's coins in the system.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a user to unlock their coins.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
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
      const { lockedAt, reason, ...updatedData } = existingData;
      await db.set(userKey, updatedData);

      return interaction.reply({
        content: `Successfully unlocked coins for user ${user}.`,
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