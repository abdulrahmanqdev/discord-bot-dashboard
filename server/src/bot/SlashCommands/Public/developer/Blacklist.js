const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { db } = require("../../../tools.js");
const {developersID} = require("../../../Config/botConfig.js")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("Belirtilen üyeyi blacklist'e alır.")
    .addUserOption((option) =>
      option.setName("kullanıcı")
        .setDescription("Kullanıcı belirtiniz")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("sebep")
        .setDescription("Lütfen sebep belirtiniz.")
        .setRequired(true)
    ),

  async execute(interaction, client) {

    const user = interaction.options.getUser("kullanıcı")
    const reason = interaction.options.getString("sebep")
    const { guild } = interaction;
    const bl = await db.get("blacklist/" + user.id)

    if (!developersID.includes(interaction.user.id)) {
      interaction
        .reply({ content: `> **Başarısız!** Bu komutu bot sahibi ve geliştiricilerine özeldir.`, ephemeral: true })
        .catch(() => { });

      return;
    }

    if(bl) return interaction.reply({
      content: "<a:hata:1270369080028954669> Bu kullanıcı zaten karalistede!",
      ephemeral: true
    }).catch(() => {})

    await interaction.deferReply({ephemeral: true})

    await db.set("blacklist/" + user.id, {
      reason,
      user: interaction.user.id,
      at: Date.now()
    })

    const embed = new EmbedBuilder()
    .setTitle("Successfull")
    .setDescription(`kullanıcı başarılı bir şekilde karalisteye alındı karalisteye alındı.\n\nSebep: \n\`\`\`${reason}\`\`\`\nKişi: \n\`\`\`${user.username} | ${user.id}\`\`\``)
    .setColor("Green")

    interaction.editReply({ embeds: [embed]}).catch(() => {})

}
}
