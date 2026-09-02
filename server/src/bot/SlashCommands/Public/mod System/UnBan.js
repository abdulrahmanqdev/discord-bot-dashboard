const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { db } = require("../../../tools.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unbans the user with the specified ID.")
    .addUserOption((option) =>
      option.setName("id")
        .setDescription("Enter a user id")
        .setRequired(true)
    ),

  async execute(interaction) {
    const client = interaction.client;
    const bot = interaction.client;
    const users = interaction.options.getUser("id");

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({
      content: "🔴 | You need `Ban Members` permission to use this command.",
      ephemeral: true
    }).catch(() => {})

    if(interaction.member.id === users) return await interaction.reply({
      content: "🔴 | You are not banned yourself",
      ephemeral: true
    }).catch(() => {})

    await interaction.guild.bans.fetch()
    .then(async bans => {

      if(bans.size = 0) return await interaction.reply({
        content: "🔴 | There are no banned users on this server",
        ephemeral: true
      }).catch(() => {})
      let bannedID = bans.find(ban => ban.user.id == users);
      if(!bannedID) return await interaction.reply({
        content: "🔴 | A user with the specified ID is not banned",
        ephemeral: true
      }).catch(() => {})

      await interaction.guild.bans.remove(users).catch(err => {
        return interaction.reply({
          content: "🔴 | I cannot unban the specified user.",
          ephemeral: true
        }).catch(() => {})
      })
    })
    await interaction.reply({content: "🟢 | Stated **" + users + "**The user's ban has been lifted." }).catch(() => {})
  }
}