const {
    SlashCommandBuilder,
    ButtonStyle,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
  } = require("discord.js");
  const { db } = require("../../../../bot/tools.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("coin-transfer")
      .setDescription("Coins can be transferred to users")
      .addUserOption((option) =>
        option
          .setName("user")
          .setDescription("Select the person you want to send coins to")
          .setRequired(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("amount")
          .setDescription("Enter the amount of coins you want to send")
          .setRequired(true)
      ),
    async execute(interaction) {
      const senderId = interaction.user.id;
      const receiver = interaction.options.getUser("user");
      const amount = interaction.options.getInteger("amount");

      const DAILY_TRANSFER_LIMIT = 500000;
      let senderDailyData = await db.get(`coins/${senderId}/dailyTransfer`);

      const now = new Date();
      const today = now.toISOString().split('T')[0];

      if (!senderDailyData || senderDailyData.date !== today) {
        senderDailyData = {
          date: today,
          amount: 0,
        };
      }

      const senderLock = await db.get(`coins/${senderId}/userdata/lockedAt`);
      const senderReason = await db.get(`coins/${senderId}/userdata/reason`);
  
      if (senderLock) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              })
              .setDescription(
                `🔒 Your coins are locked.\nReason:` + "`" +senderReason || "Unspecified" + "`"
              )
              .setColor("Red"),
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel("Support Server")
                .setURL("https://discord.gg/HBrByySrFK")
                .setStyle(ButtonStyle.Link)
            ),
          ],
          flags: 64,
        });
      }
  
      const receiverLock = await db.get(`coins/${receiver.id}/userdata/lockedAt`);
      const receiverReason = await db.get(`coins/${receiver.id}/userdata/reason`);
  
      if (receiverLock) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: receiver.username,
                iconURL: receiver.displayAvatarURL({ dynamic: true }),
              })
              .setDescription(
            "🔒 `" + receiver.username + "` The user's coins are locked.\nReason: `" + receiverReason || "Unspecified" + "`"
              )
              .setColor("Red"),
          ],
          flags: 64,
        });
      }
  
      if (receiver.bot) {
        return interaction.reply({
          content: "🤖 You cannot send coins to bots!",
          flags: 64,
        });
      }
  
      if (receiver.id === senderId) {
        return interaction.reply({
          content: "🔴 You cannot send coins to yourself!",
          flags: 64,
        });
      }
  
      if (amount <= 0) {
        return interaction.reply({
          content: "🔴 The amount to be sent must be greater than 1!",
          flags: 64,
        });
      }
      if (senderDailyData.amount + amount > DAILY_TRANSFER_LIMIT) {
          const remaining = DAILY_TRANSFER_LIMIT - senderDailyData.amount;
          return interaction.reply({
              content: `❌ You are exceeding your daily transfer limit. Today **${senderDailyData.amount.toLocaleString()}** You have sent coins. Your remaining limit is **${remaining.toLocaleString()}** coins.`,
              flags: 64
          });
      }
      const senderData = (await db.get(`coins/${senderId}/userdata`)) || {
        coin: 0,
      };
      const receiverData = (await db.get(`coins/${receiver.id}/userdata`)) || {
        coin: 0,
      };
      senderData.coin = Number(senderData.coin) || 0;
      receiverData.coin = Number(receiverData.coin) || 0;
  
      if (senderData.coin < amount) {
        return interaction.reply({
          content: "🔴 You don't have enough coins.",
          flags: 64,
        });
      }

      senderData.coin -= amount;
      receiverData.coin += amount;
      senderDailyData.amount += amount;
      senderDailyData.date = today;
      await db.set(`coins/${senderId}/dailyTransfer`, senderDailyData);
      await db.set(`coins/${senderId}/userdata`, senderData);
      await db.set(`coins/${receiver.id}/userdata`, receiverData);
  
      return interaction.reply({
        content: `✅ You sent **${amount.toLocaleString()}** <:coin:123456789012345678> coins to <@${receiver.id}>.`,
      });
    },
  };