const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ButtonStyle,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const { db } = require("../../../../bot/tools.js");
const client = require("../../../../base/bot.js").client;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coin")
    .setDescription("Shows a user's coin count.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Select a user to view their coin balance.")
        .setRequired(false)
    ),

  async execute(interaction) {
    const { guild, user: commandUser } = interaction;
    const targetUser = interaction.options.getUser("user") || commandUser;

    const coin = (await db.get(`coins/${targetUser.id}/userdata/coin`)) || 0;
    const lock = await db.get(`coins/${targetUser.id}/userdata/lockedAt`);
    const reason = await db.get(`coins/${targetUser.id}/userdata/reason`);

    if (lock) {
      return interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: targetUser.username + "(" + targetUser.globalName + ")",
                iconURL: targetUser.displayAvatarURL({ dynamic: true }),
              })
              .setDescription(
                "`" +
                  targetUser.username +
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
        .catch(console.error);
    }

    if (!coin || coin === 0) {
      return interaction
        .reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: targetUser.username + "(" + targetUser.globalName + ")",
                iconURL: targetUser.displayAvatarURL({ dynamic: true }),
              })
              .setDescription(
                `🔴 **${targetUser.username}** The user doesn't seem to have any coins. I guess he hasn't participated in any chats. 🫤`
              )
              .setColor("Red")
              .setFooter({
                text: commandUser.username + " Viewed by",
                iconURL: commandUser.displayAvatarURL({ dynamic: true }),
              }),
          ],
        })
        .catch(console.error);
    }

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${targetUser.username} (${targetUser.globalName || "No Global Name"})`,
        iconURL: targetUser.displayAvatarURL({ dynamic: true }),
      })
      .setDescription("-# Below is the current coin of the user named <@" + targetUser.id + ">")
      .setColor("Gold")
      .addFields(
        {
          name: "👤 User ↷",
          value: `\`\`\`ini\n[${targetUser.username}]\`\`\``,
          inline: false
        },
        {
          name: "💰 Amount ↷",
          value: `\`\`\`diff\n+ ${coin.toLocaleString()}\`\`\``
        }
      )
      .setFooter({
        text: `${commandUser.username} Viewed by`,
        iconURL: commandUser.displayAvatarURL({ dynamic: true }),
      });

    await interaction
      .reply({
        embeds: [embed],
      })
      .catch(console.error);
  },
};
