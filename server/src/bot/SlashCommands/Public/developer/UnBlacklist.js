const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField, } = require("discord.js");
const { db } = require("../../../tools.js")
const {developersID} = require("../../../Config/botConfig.js")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("unblacklist")
    .setDescription("Belirtilen üyeyi blacklist'e alır.")
    .addUserOption((option) =>
      option.setName("kullanıcı")
        .setDescription("Kullanıcı belirtiniz")
        .setRequired(true)
    ),

  async execute(interaction, client) {

    const user = interaction.options.getUser("kullanıcı")
    const { guild } = interaction;
    const bl = await db.get("blacklist/" + user.id)

    if (!developersID.includes(interaction.user.id)) {
      interaction.reply({ content: `> **Başarısız!** Bu komutu bot sahibi ve geliştiricilerine özeldir.`, ephemeral: true }).catch(() => { });
      return;
    }

    if(!bl) return interaction.reply({
      content: "> Belirlenen kullanıcı karaliste'de bulunmamaktadır.",
      ephemeral: true
    }).catch(() => {})

    await interaction.deferReply({ephemeral: true})

    await db.delete("blacklist")

    const sex = new EmbedBuilder()
    .setDescription(`> <@${user.id}> Adlı kullanıcı karaliste'den çıkarıldı.\n- Artık komutları kullanabilecek.`)
    .setColor("Green")

    interaction.editReply({ embeds: [sex], ephemeral: true }).catch(() => {})

}
}
