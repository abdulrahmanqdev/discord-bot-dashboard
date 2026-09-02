const { SlashCommandBuilder } = require("@discordjs/builders");
const {
    EmbedBuilder,
    ActionRowBuilder,
    PermissionsBitField,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Shows bot invite links"),

    usage: "/invite",
    description: "Shows bot invite links",
    category: "bot",

    async execute(interaction, bot) {
        const client = interaction.client;
    
        new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setURL("https://discord.gg/6u7328y6")
                    .setLabel(`Support Server`)
                    .setStyle(ButtonStyle.Link),
                    new ButtonBuilder()
                    .setURL("https://discord.gg/6u7328y6")
                    .setLabel(`Bot İnvite`)
                    .setStyle(ButtonStyle.Link)
            )

            const embed = new EmbedBuilder()
            .setAuthor({ name: "Discord Bot", iconURL: client.user.avatarURL({ dynamic: true }) })
            .setTitle("Our bot's invitation links are below.")
            .addFields([
                {
                    name: "Discord Server Support",
                    value: "```https://discord.gg/6u7328y6```",
                    inline: true,
                },
                {
                    name: "Bot İnvite Link",
                    value: "```https://discord.gg/6u7328y6```",
                },
            ])
            .setFooter({
                text: "Best, Discord Bot | 2024",
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
            })

        interaction.reply({ embeds: [embed] }).catch(() => { })
    }
};