const { EmbedBuilder, WebhookClient, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { db } = require("../../tools")
const { checkCooldown } = require("../../utils/commandCooldown.js");

module.exports = async (interaction) => {
  const client = interaction.client;
  const bot = interaction.client;
  const guild = interaction.guild;
  if (!interaction.isCommand()) return;
  const webhookClient = new WebhookClient({ url: 'https://canary.discord.com/api/webhooks/1368949003554652245/pCCUMNSS9MhPdpjb4zpqe39d75qtqdQXpNPwWKbIC15sKoyZ0GRbhyynAWvklZdlgnMF' });
  const command = bot.Public.get(interaction.commandName)
  if (!command) return;
  

  //if (!interaction.guild) return interaction.reply({ content: "Komutlarım sunucuya özeldir.", ephemeral: true })

  let data = await db.get(`blacklist/${interaction.user.id}`);

  if (data) {
    const reason = data.reason;
    const embed = new EmbedBuilder()
      .setAuthor({ name: `Ops! Wait a minute! ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
      .setDescription(`🔴 | Sorry, you are blacklisted by **${bot.user.username}**, due to **${reason}** you will no longer be able to use any of the bot's commands! Blacklisting date: <t:${Math.floor(data?.at / 1000)}:R>.`)
      .setThumbnail(interaction.user.avatarURL({dynamic: true} || client.user.avatarURL({dynamic: true})))
      .setFooter({ text: `${bot.user.username} Blacklist`, iconURL: bot.user.displayAvatarURL({ dynamic: true }) })
      .setColor("Red");
    return await interaction.reply({ embeds: [embed], flags: 64 }).catch(() => { });
  }

  const cooldown = checkCooldown('global', interaction.user.id, 3);
  if (!cooldown.allowed) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
        .setAuthor({
          name: guild.name,
          iconURL: guild.iconURL({ dynamic: true })
        })
        .setTitle("Wow you are so fast")
        .setDescription(`-# ⏳ | Bu komutu tekrar kullanmak için **${cooldown.timeLeft}** saniye beklemelisin.`)
        .setColor("Red")
        .setFooter({
          text: interaction.user.username + " | using the command",
          iconURL: interaction.user.avatarURL({ dynamic: true })
        })
      ],
      flags: 64
    }).catch(() => {})
  }

  try {
    await command.execute(interaction, bot);
  } catch (err) {
    if (err) console.error(err);

    const errorEmbed = new EmbedBuilder()
      .setTitle("Komut Hatası")
      .setColor("Red")
      .setDescription(`Komut: \`/${interaction.commandName}\`\nKullanıcı: <@${interaction.user.id}> (${interaction.user.tag})\nHata: \`${err.message}\``)
      .setTimestamp();

    webhookClient.send({
      username: 'Hata Bildirimi',
      embeds: [errorEmbed],
    });

    const hata = new EmbedBuilder()
      .setDescription(`> Komut çalıştırılırken bir hata oluştu. Bu durumu yöneticilere bildirdik.`)


    await interaction.reply({
      embeds: [hata], flags: 64, components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setURL("https://discord.gg/HBrByySrFK")
            .setLabel(`Destek Sunucumuz`)
            .setStyle(ButtonStyle.Link)
        )
      ]
    }).catch(() => { });
  }
};

module.exports.conf = {
  name: "interactionCreate",
};
