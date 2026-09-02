const { EmbedBuilder } = require("discord.js");
const { db } = require("../../tools");

module.exports = async (interaction) => {
  try {
    const client = interaction.client;
    const guild = interaction.guild;

    // Veritabanından tüm welcomeSetup verisini al
    const data = await db.get(`welcomeSetup/${guild.id}`);
    if (!data || !data.channel) {
      console.log(`Kanal ID'si veritabanında bulunamadı. Guild ID: ${guild.id}`);
      return;
    }

    // Kanalı bul
    const channel = interaction.guild.channels.cache.get(data.channel);
    if (!channel) {
      console.log(`Kanal bulunamadı veya bota erişim izni yok: ${data.channel}`);
      return;
    }

    // Sistem durumu kontrolü
    if (data.enabled) {
      const member = interaction.user;
      const Welcome = new EmbedBuilder()
        .setTitle("Welcome")
        .setDescription(`👋 ${member} The person named joined the server, welcome`)
        .setColor("Blue")
        .setFooter({
          text: client.user.username + " Welcome system",
          iconURL: interaction.user.avatarURL({ dynamic: true }) || client.user.avatarURL({ dynamic: true }),
        });

      await channel.send({ embeds: [Welcome], content: member }).catch((err) => {
        console.log("Mesaj gönderme hatası:", err);
      });
    } else {
      await channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("Unsuccessful")
            .setDescription(
              "🔴 | Welcome message could not be sent because the welcome system is deactivated. Use the system command again to set up the system"
            )
            .setColor("Red"),
        ],
      }).catch((err) => {
        console.log("Mesaj gönderme hatası:", err);
      });
    }
  } catch (error) {
    console.log("Hata oluştu:", error);
  }
};

module.exports.conf = {
  name: "guildMemberAdd",
};