const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
  } = require("discord.js");
  const { db } = require("../../tools");
  const client = require("../../../base/bot.js").client;
  
  const messageCounters = new Map();
  const claimedGuilds = new Map();
  const userLastMessages = new Map();
  
  module.exports = async (message) => {
    if (message.author.bot || !message.guild) return;
  
    const guildId = message.guild.id;
    const channelId = message.channel.id;
  
    const system = await db.get(`chatSystem/${guildId}`);
    if (!system || system.status !== "on") return;
    if (system.channel !== channelId) return;
  
    const content = message.content.trim();
    const onlySymbols = /^[\.\,\!\?\-_\*\s]+$/g;
  
    // 🔒 Spam/tekrar içerik kontrolü
    if (content.length < 5) return;
    if (onlySymbols.test(content)) return;
  
    const lastMessage = userLastMessages.get(message.author.id);
    if (lastMessage && lastMessage === content) return;
    userLastMessages.set(message.author.id, content);
  
    const currentCount = messageCounters.get(guildId) || 0;
    messageCounters.set(guildId, currentCount + 1);
  
    const targetMessageCount = 10;
    if ((currentCount + 1) % targetMessageCount !== 0) return;
  
    const embed = new EmbedBuilder()
      .setColor("Gold")
      .setTitle("💰 Coin Zamanı!")
      .setDescription("İlk tıklayan kullanıcı rastgele miktarda coin kazanacak! 🎉")
      .setFooter({ text: "Coin Sistemi", iconURL: client.user.displayAvatarURL() });
  
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("claim_coin")
        .setLabel("🎉 Coini Al!")
        .setStyle(ButtonStyle.Success)
    );
  
    const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });
  
    // ⏲ Mesajı 60 saniye sonra sil (opsiyonel) eğer istiyorsan ekle
    /*setTimeout(() => {
      sentMessage.delete().catch(() => {});
    }, 60000);*/
  
    const collector = sentMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15000,
      max: 1,
    });
  
    collector.on("collect", async (i) => {
      if (i.customId !== "claim_coin") return;
    
      const userData = await db.get(`coins/` + i.user.id + `/userdata`) || { coin: 0 };
      const randomCoin = Math.floor(Math.random() * 101) + 10;
      const coinEmoji = "<:coin:123456789012345678>";
    
      await db.set(`coins/` + i.user.id + `/userdata`, {
        ...userData,
        coin: userData.coin + randomCoin,
      });
    
      await i.reply({
        content: `🎉 Tebrikler ${i.user}! ${randomCoin} ${coinEmoji} kazandın!`,
        flags: 64,
      });
    
      const disabledRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("claim_coin")
          .setLabel("✅ Coin Alındı")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true)
      );
    
      await sentMessage.edit({ components: [disabledRow] });
      claimedGuilds.set(guildId, i.user.id);
    });
    
  
    collector.on("end", async (collected) => {
      if (collected.size === 0) {
        const expiredRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("claim_coin")
            .setLabel("⏱ Süre Doldu")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
        );
  
        await sentMessage.edit({ components: [expiredRow] });
      }
    });
  };
  
  module.exports.conf = {
    name: "messageCreate",
  };
  