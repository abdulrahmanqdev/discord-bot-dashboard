const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { db } = require("../../../../bot/tools.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coin-top")
    .setDescription("Shows the users with the most coins on the server."),
  async execute(interaction) {
    const allData = await db.all();
    const coinsData = allData.coins || {};

    const sortedUsers = Object.entries(coinsData)
      .map(([userId, value]) => {
        const coin = Number(value?.userdata?.coin) || 0;
        const isLocked = value?.userdata?.locked || false;
        return {
          id: userId,
          coin: coin,
          locked: isLocked,
        };
      })
      .filter((user) => user.coin > 0 && !user.locked)
      .sort((a, b) => b.coin - a.coin);

    if (sortedUsers.length === 0) {
      const emptyEmbed = new EmbedBuilder()
        .setTitle("💰 List of the Richest")
        .setDescription("No one has earned any coins yet")
        .setColor("Gold")
        .setThumbnail(interaction.client.user.displayAvatarURL())
        .setFooter({
          text: "Coin System",
          iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setTimestamp();

      return await interaction.reply({ embeds: [emptyEmbed] });
    }

    const pageSize = 10;
    let currentPage = 0;
    const totalPages = Math.ceil(sortedUsers.length / pageSize);

    const getEmbed = (page) => {
      const start = page * pageSize;
      const currentUsers = sortedUsers.slice(start, start + pageSize);
      const embed = new EmbedBuilder()
        .setTitle("💰 List of the Richest | Top 10")
        .setColor("Gold")
        .setThumbnail(interaction.client.user.displayAvatarURL())
        .setFooter({
          text: `Page ${page + 1}/${totalPages} • Coin System`,
          iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setTimestamp();

      const description = currentUsers
        .map((user, index) => {
          const position = start + index;
          const medal =
            position === 0
              ? "🥇"
              : position === 1
              ? "🥈"
              : position === 2
              ? "🥉"
              : `**${position + 1}.**`;

          return `${medal} <@${user.id}> ─ **${user.coin.toLocaleString()}** <:coin:123456789012345678>`;
        })
        .join("\n");
      embed.setDescription(description);
      return embed;
    };

    const getRow = (page) => {
      return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("prev")
          .setLabel("⬅ Back")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === 0),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Forward ➡")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === totalPages - 1)
      );
    };

    const message = await interaction.reply({
      embeds: [getEmbed(currentPage)],
      components: [getRow(currentPage)],
      flags: 64,
    });

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60_000,
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({
          content: "🔴 This pagination is specific only to the person using the command.",
          flags: 64,
        });
      }
      if (i.customId === "next" && currentPage < totalPages - 1) {
        currentPage++;
      } else if (i.customId === "prev" && currentPage > 0) {
        currentPage--;
      }
      await i.update({
        embeds: [getEmbed(currentPage)],
        components: [getRow(currentPage)],
      });
    });

    collector.on("end", async () => {
      try {
        await message.edit({ components: [] });
      } catch (err) {
        console.error("Message could not be edited when pagination time expired:", err);
      }
    });
  },
};