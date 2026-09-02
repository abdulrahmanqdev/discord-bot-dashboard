const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { db } = require("../../../tools.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans the specified member..")
    .addUserOption((option) =>
      option.setName("user")
        .setDescription("Select a user")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason")
        .setDescription("Please enter a reason.")
        .setRequired(true)
    ),

  async execute(interaction, client) {

    const bot = interaction.client;
    const users = interaction.options.getUser("user");
    const ID = users.id;
    const banUser = client.users.cache.get(ID);

    if(!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({
      content: "🔴 | You need `Ban Members` permission to use this command.",
      ephemeral: true
    }).catch(() => {})

    if(interaction.member.id === ID) return await interaction.reply({
      content: "🔴 | You cannot ban yourself.",
      ephemeral: true
    }).catch(() => {})

    let reason = interaction.options.getString('sebep');
    if(!reason) reason = "🔴 | You must provide a reason."

    await interaction.guild.bans.create(banUser.id, {reason}).catch(err => {
       interaction.reply({
        content: "🔴 | I can't ban the user.",
        ephemeral: true
      }).catch(() => {})
    })
    
    await banUser.send({content: "🔴 | " + interaction.guild.name + "From the server named" + reason + "ou have been banned due to."}).catch(err => {
      return;
    })
    await interaction.reply({content: "🟢 | Specified **" + banUser.tag + "** User **" + reason + "** was banned from the server due to.", ephemeral: true}).catch(() => {})
  }
}
