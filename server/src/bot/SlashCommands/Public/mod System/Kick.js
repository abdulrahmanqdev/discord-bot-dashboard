const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks the specified user from the server.")
    .addUserOption((option) =>
      option.setName("user")
        .setDescription("Select a user")
        .setRequired(true)
    ),

  async execute(interaction) {
    const client = interaction.client;
    const bot = interaction.client;
    const user = interaction.options.getMember("user")
    const ID = user.id;
    const member = await interaction.guild.members.fetch(user.id)

    if(interaction.member.id === ID) return await interaction.reply({
      content: "🔴 | You can't kick yourself out of the server",
      ephemeral: true
    }).catch(() => {})

    if(member.roles.highest.position >= interaction.member.roles.highest.position) {
     return interaction.reply({
          content: "🔴 | You need `Ban Members` permission to use this command.",
          ephemeral: true
      }).catch(() => {})
    }

    
    await member.kick()

    interaction.reply({content: "🟢 | Specified **" + user + "** was kicked from the server."}).catch(() => {})

  }
}