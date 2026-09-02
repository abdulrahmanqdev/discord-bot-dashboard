const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  PermissionsBitField,
} = require("discord.js");
const { db } = require("../../tools");
const bot = require("../../../base/bot").client
const loggedUsers = new Set();
const warningCooldown = new Map();
module.exports = async (message) => {

  

  if (message.author.bot || !message.guild) return;
  const guildId = message.guild.id;
  const member = message.guild.members.cache.get(message.author.id);
  if (message.author.id === message.guild.ownerId || member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return;
  }
  const hasHigherRole = member.roles.cache.some(role => role.permissions.has(PermissionsBitField.Flags.ManageMessages));
  if (hasHigherRole) return;
  const capsChannelId = await db.get(`moderation-system/capsSystem/${guildId}/channel`);
  const channel = message.guild.channels.cache.get(capsChannelId);
  const threshold = await db.get(`moderation-system/capsSystem/${guildId}/threshold`) || 70;
  if (!channel || !channel.isTextBased()) return;
  const text = message.content;
  const capsCount = text.replace(/[^A-Z]/g, "").length;
  const totalCount = text.replace(/[^A-Za-z]/g, "").length;
  if (totalCount === 0) return;
  const capsPercentage = (capsCount / totalCount) * 100;
  if (capsPercentage >= threshold) {
    const lastWarning = warningCooldown.get(message.author.id);
    const cooldownTime = 5 * 60 * 1000;
    if (!lastWarning || Date.now() - lastWarning > cooldownTime) {
      await message.reply(`⚠️ **Caps Lock Spam Detected!** Please reduce capitalization. (Threshold: **${threshold}%**)`)
        .then(msg => setTimeout(() => msg.delete(), 5000));
      message.delete().catch(() => {});
      warningCooldown.set(message.author.id, Date.now());
      setTimeout(() => warningCooldown.delete(message.author.id), cooldownTime);
    }
    if (await db.get(`moderation-system/capsSystem/${guildId}/user`)) {
      if (member && member.moderatable) {
        await member.timeout(10 * 60 * 1000, "Caps lock spammed.").catch(() => {});
      }
      if (loggedUsers.has(message.author.id)) return;
      loggedUsers.add(message.author.id);
      const unmuteButton = new ButtonBuilder()
        .setCustomId(`remove_mute_${member.id}`)
        .setLabel("Remove Mute")
        .setStyle(1);
      const row = new ActionRowBuilder().addComponents(unmuteButton);
      const logMessage = await channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("⚠️ Timeout - Caps Lock Spam")
            .setFields([
              { name: "👤 User", value: `\`\`\`${member.id} | ${message.author.username}\`\`\`` },
              { name: "⏳ Duration", value: "```10 minutes```" },
              { name: "📜 Reason", value: "```Excessive caps usage```" }
            ])
            .setColor("Red")
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setFooter({
              text: "To reset the system, use the /moderation-system command.",
              iconURL: message.author.avatarURL({ dynamic: true })
            })
        ],
        components: [row]
      });
      warningCooldown.set(`logMessage_${member.id}`, logMessage.id);
      warningCooldown.set(`logChannel_${member.id}`, channel.id);
      setTimeout(() => loggedUsers.delete(message.author.id), 5 * 60 * 1000);
    }
  }
};


bot.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  const { customId, member, guild } = interaction;
  if (customId.startsWith("remove_mute_")) {
    const targetId = customId.split("_")[2];
    const targetMember = guild.members.cache.get(targetId);
    if (!targetMember) {
      return interaction.reply({ content: "User not found.", ephemeral: true });
    }
    if (!member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({ content: "You don't have permission to remove mute.", ephemeral: true });
    }
    try {
      await targetMember.timeout(null);
      await interaction.reply({ content: `✅ **Mute removed for** <@${targetId}>`, ephemeral: false });
      const logMessageId = warningCooldown.get(`logMessage_${targetId}`);
      const logChannelId = warningCooldown.get(`logChannel_${targetId}`);
      if (logMessageId && logChannelId) {
        const logChannel = guild.channels.cache.get(logChannelId);
        if (logChannel) {
          try {
            const logMessage = await logChannel.messages.fetch(logMessageId);
            if (logMessage) {
              const updatedButton = new ButtonBuilder()
                .setCustomId(`remove_mute_${targetId}`)
                .setLabel("Mute Removed")
                .setStyle(2)
                .setDisabled(true);

              const updatedRow = new ActionRowBuilder().addComponents(updatedButton);
              await logMessage.edit({ components: [updatedRow] });
            } else {
              console.log("Log message not found.");
            }
          } catch (fetchError) {
            console.error("Failed to fetch log message:", fetchError);
          }
        } else {
          console.log("Log channel not found.");
        }
      }
    } catch (error) {
      console.error("Failed to remove timeout:", error);
      await interaction.reply({ content: "❌ Failed to remove mute.", ephemeral: true });
    }
  }
});
module.exports.conf = {
  name: "messageCreate",
};
