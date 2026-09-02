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
    .setName("coin-daily")
    .setDescription("Get your daily coin reward."),
  async execute(interaction) {
    const userId = interaction.user.id;
    const userName = interaction.user.username;
    const userGlobalName = interaction.user.globalName;
    const avatar = interaction.user.displayAvatarURL({ dynamic: true });
    const lock = await db.get(`coins/` + userId + "/userdata/lockedAt");
    const reason = await db.get(`coins/` + userId + "/userdata/reason");
    let userData = await db.get(`coins/` + userId + "/userdata");

    const currentDate = new Date();
    const lastClaimDate = userData ? userData.lastClaimDate : null;

    if (lock) {
        return interaction
          .reply({
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: userName + "(" + userGlobalName + ")",
                  iconURL: avatar,
                })
                .setDescription(
                  "`" +
                  userName +
                    "`" +
                    ` User's coins are locked 🔒\n` +
                    "`" +
                    reason +
                    "`" +
                    " For some reason your coins are locked."
                )
                .setColor("Red"),
            ],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setLabel("Destek Sunucusu")
                  .setURL("https://discord.gg/HBrByySrFK")
                  .setStyle(ButtonStyle.Link)
              ),
            ],
            flags: 64,
          })
          .catch(() => {});
      }

    if (lastClaimDate) {
      const timeDifference = currentDate - new Date(lastClaimDate);
      const oneDay = 24 * 60 * 60 * 1000;

      if (timeDifference < oneDay) {
        const remainingTime = oneDay - timeDifference;
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor(
          (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
        );
        return interaction.reply({
          content: `🎉 You have to wait another **${hours} hours ${minutes} minutes** to get your daily reward!`,
          flags: 64,
        });
      }
    }

    const rewardAmount = Math.floor(Math.random() * (100 - 50 + 1)) + 50;

    if (!userData) {
      userData = {
        coin: rewardAmount,
        lastClaimDate: currentDate.toISOString(),
      };
    } else {
      userData.coin =
        typeof userData.coin === "number"
          ? userData.coin + rewardAmount
          : rewardAmount;
      userData.lastClaimDate = currentDate.toISOString();
    }

    const existingUserData = await db.get(`coins/${userId}/userdata`);
    await db.set(`coins/${userId}/userdata`, { ...existingUserData, ...userData });

    await interaction.reply({
      content: `✅ You have received your daily reward of **${rewardAmount}** <:coin:123456789012345678> coins!`,
      flags: 64,
    });

    const reminderTime = 24 * 60 * 60 * 1000;
    setTimeout(async () => {
      try {
        await interaction.user.send(
          "⏰ Remember, come back again to get your daily reward! 🎉"
        );
      } catch (error) {
        console.error("DM gönderilirken hata oluştu:", error);
      }
    }, reminderTime);
  },
};
